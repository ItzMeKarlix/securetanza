import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/auth";
import { getClientIp, getUserAgent } from "@/lib/request-context";
import { cacheService, CacheKeys } from "@/backend/cache";
import {
  generateCrimeFingerprint,
  findExistingCrimeFingerprints,
} from "@/backend/lib/crime-deduplication";
import { insertCrimeRecords } from "@/backend/lib/crime-records";
import { parseCrimeWorkbookRow } from "@/backend/lib/crime-workbook";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
} from "@/components/upload/upload-meta";

// POST /api/crimes/upload - Upload Excel/CSV file with crime data
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (
      !session ||
      (!session.permissions.includes("admin_operational_officer") &&
        !session.permissions.includes("admin"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Administrative access required",
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type (supports xlsx, xls, csv)
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.",
        },
        { status: 400 },
      );
    }

    // The dialog checks this too, but the route is the boundary that actually holds:
    // the whole workbook is read into memory below, so an oversized file is refused
    // before a single byte is parsed.
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File is over the ${MAX_UPLOAD_LABEL} limit. Split the workbook by year or by station and import each part.`,
        },
        { status: 413 },
      );
    }

    // Read Excel/CSV file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[];

    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: "Uploaded file is empty" },
        { status: 400 },
      );
    }

    console.log(`📊 Processing ${jsonData.length} rows from ${file.name}`);

    // Process and insert data with two-tier deduplication
    const results = {
      total: jsonData.length,
      inserted: 0,
      skipped: 0,
      duplicatesSkipped: 0,
      errors: [] as string[],
    };

    const seenInFileFingerprints = new Set<string>();
    const candidateRows: Array<{
      rowIndex: number;
      data: any;
      fingerprint: string;
    }> = [];
    const validRowsToInsert: any[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const sourceRowNumber =
        typeof row.__rowNum__ === "number" ? row.__rowNum__ + 1 : i + 2;

      try {
        const candidateData = parseCrimeWorkbookRow(row, {
          file: file.name,
          sheet: workbook.SheetNames[0],
          row: sourceRowNumber,
        });

        // Tier 1: In-File Deduplication
        const fingerprint = generateCrimeFingerprint(candidateData);
        if (seenInFileFingerprints.has(fingerprint)) {
          results.skipped++;
          results.duplicatesSkipped++;
          results.errors.push(
            `Row ${sourceRowNumber}: Duplicate record within uploaded file (skipped)`,
          );
          continue;
        }

        seenInFileFingerprints.add(fingerprint);
        candidateRows.push({
          rowIndex: sourceRowNumber,
          data: candidateData,
          fingerprint,
        });
      } catch (error) {
        results.skipped++;
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.errors.push(`Row ${sourceRowNumber}: ${errorMessage}`);
      }
    }

    // Tier 2: In-Database Deduplication
    if (candidateRows.length > 0) {
      const existingDbFingerprints = await findExistingCrimeFingerprints(
        candidateRows.map((r) => r.data),
        prisma,
      );

      for (const candidate of candidateRows) {
        if (existingDbFingerprints.has(candidate.fingerprint)) {
          results.skipped++;
          results.duplicatesSkipped++;
          results.errors.push(
            `Row ${candidate.rowIndex}: Record already exists in crime register (duplicate skipped)`,
          );
        } else {
          validRowsToInsert.push(candidate.data);
          // Add to existing set to avoid any collision
          existingDbFingerprints.add(candidate.fingerprint);
        }
      }
    }

    console.log(
      `🔍 Deduplication results: ${candidateRows.length} unique in file, ${results.duplicatesSkipped} duplicates rejected, ${validRowsToInsert.length} ready to insert`,
    );

    // Persist parent/definition links and offense rows atomically per chunk.
    const BATCH_SIZE = 250;
    for (let b = 0; b < validRowsToInsert.length; b += BATCH_SIZE) {
      const chunk = validRowsToInsert.slice(b, b + BATCH_SIZE);
      try {
        const created = await insertCrimeRecords(chunk, prisma);
        results.inserted += created.length;
        const concurrentDuplicates = chunk.length - created.length;
        results.skipped += concurrentDuplicates;
        results.duplicatesSkipped += concurrentDuplicates;
      } catch (batchError) {
        console.warn(
          "[UPLOAD] Batch rolled back; validating individual offense rows",
          batchError,
        );
        // A malformed row must not discard its valid neighbors.
        for (const row of chunk) {
          try {
            const created = await insertCrimeRecords([row], prisma);
            results.inserted += created.length;
            if (!created.length) {
              results.skipped++;
              results.duplicatesSkipped++;
            }
          } catch (rowError) {
            results.skipped++;
            const message =
              rowError instanceof Error
                ? rowError.message
                : "Unknown import error";
            results.errors.push(`Row ${row.sourceRow}: ${message}`);
          }
        }
      }
    }

    console.log(
      `✅ Upload complete: ${results.inserted} inserted, ${results.skipped} skipped (${results.duplicatesSkipped} duplicates rejected)`,
    );

    // Invalidate cached crime analytics and queries
    if (results.inserted > 0) {
      await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
    }

    // Record the upload audit entry
    const auditDetails =
      results.duplicatesSkipped > 0
        ? `Imported ${results.inserted} records from ${file.name} (${results.duplicatesSkipped} duplicate(s) rejected)`
        : `Imported ${results.inserted} records from ${file.name}`;

    const outcome =
      results.inserted === 0
        ? results.duplicatesSkipped > 0
          ? "duplicate"
          : "failed"
        : results.skipped > 0
          ? "partial"
          : "success";

    const uploadLog = await prisma.auditLog.create({
      data: {
        action: "Import",
        details: auditDetails,
        user:
          session?.fullName || session?.accountNumber || "Operational Officer",
        resource: "CrimeData",
        ip: getClientIp(request) || "unknown",
        // session.accountNumber was stored here before — that's who, which the
        // `user` field already captures. This should be which login session did
        // it, for correlating actions within one sign-in.
        session: session?.sessionId || "unknown",
        userAgent: getUserAgent(request),
        fileName: file.name,
        fileSize: file.size,
        recordsImported: results.inserted,
        outcome,
        errorMessage:
          results.errors.length > 0
            ? results.errors.slice(0, 5).join("; ")
            : null,
      },
    });

    const responseMsg =
      results.inserted > 0
        ? `Successfully uploaded ${results.inserted} record(s)${results.duplicatesSkipped > 0 ? ` (${results.duplicatesSkipped} duplicate(s) rejected)` : ""}.`
        : results.duplicatesSkipped > 0
          ? `Upload skipped: All ${results.duplicatesSkipped} record(s) in this file already exist in the crime register.`
          : `No valid records found to import.`;

    return NextResponse.json({
      success: true,
      message: responseMsg,
      data: results,
      uploadLogId: uploadLog.id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
