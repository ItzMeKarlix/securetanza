import { createHash } from "node:crypto";
import { Prisma, type PrismaClient } from "./generated/prisma";
import { classifyOffense } from "@/lib/offense-classification";
import { generateCrimeFingerprint } from "./crime-deduplication";

/** What an import or a manual entry supplies; classification fields are derived. */
export type CrimeInput = Omit<
  Prisma.OffenseUncheckedCreateInput,
  "offenseDefinitionId" | "importKey" | "crimeType" | "felonyStage"
>;
export const offenseImportKey = (record: CrimeInput) =>
  createHash("md5").update(generateCrimeFingerprint(record)).digest("hex");

/** Shared offense labels, created on first use. */
async function definitionIds(
  tx: Prisma.TransactionClient,
  definitions: Map<string, { code: string; label: string }>,
) {
  await tx.offenseDefinition.createMany({
    data: [...definitions.values()].sort((a, b) => a.code.localeCompare(b.code)),
    skipDuplicates: true,
  });
  const rows = await tx.offenseDefinition.findMany({
    where: { code: { in: [...definitions.keys()] } },
    select: { id: true, code: true },
  });
  return new Map(rows.map((row) => [row.code, row.id]));
}

/**
 * Adds offenses that aren't in the register yet. Each offense's import key is
 * unique in the database, so a repeated row — in the same upload, a re-upload,
 * or two uploads at once — is skipped rather than duplicated.
 */
export async function insertCrimeRecords(records: CrimeInput[], client: PrismaClient) {
  if (!records.length) return [];
  return client.$transaction(
    async (tx) => {
      const prepared = records.map((input) => ({
        input,
        importKey: offenseImportKey(input),
        classification: classifyOffense(input.offense, input.stageOfFelony),
      }));
      const ids = await definitionIds(
        tx,
        new Map(
          prepared.map((p) => [
            p.classification.code,
            { code: p.classification.code, label: p.classification.category },
          ]),
        ),
      );
      // Old exact duplicates were kept without a key; they still count as
      // "already in the register". Normally there are none, so this is cheap.
      const unkeyed = await tx.offense.findMany({ where: { importKey: null } });
      const unkeyedKeys = new Set(unkeyed.map(offenseImportKey));
      return tx.offense.createManyAndReturn({
        data: prepared.filter((p) => !unkeyedKeys.has(p.importKey)).map((p) => ({
          ...p.input,
          offenseDefinitionId: ids.get(p.classification.code)!,
          importKey: p.importKey,
          crimeType: p.classification.crimeType,
          felonyStage: p.classification.felonyStage,
        })),
        skipDuplicates: true,
      });
    },
    { timeout: 60_000, maxWait: 30_000 },
  );
}

export async function updateCrimeRecord(
  id: string,
  changes: Partial<CrimeInput>,
  client: PrismaClient,
) {
  return client.$transaction(async (tx) => {
    const current = await tx.offense.findUniqueOrThrow({ where: { id } });
    const input = { ...current, ...changes };
    const classification = classifyOffense(input.offense, input.stageOfFelony);
    const ids = await definitionIds(
      tx,
      new Map([[classification.code, { code: classification.code, label: classification.category }]]),
    );
    return tx.offense.update({
      where: { id },
      data: {
        ...changes,
        offenseDefinitionId: ids.get(classification.code)!,
        importKey: offenseImportKey(input),
        crimeType: classification.crimeType,
        felonyStage: classification.felonyStage,
      },
    });
  });
}

export async function deleteCrimeRecord(id: string, client: PrismaClient) {
  return client.offense.delete({ where: { id } });
}

/**
 * The API shape of one offense: the normalised stage of felony replaces the
 * workbook's wording (kept as sourceStageOfFelony), and the offense category
 * is included when the definition was loaded.
 */
export function presentCrimeRecord<
  T extends {
    crimeType: string;
    felonyStage: string;
    stageOfFelony?: string | null;
    offenseDefinition?: { label: string } | null;
  },
>(row: T) {
  const { offenseDefinition, ...rest } = row;
  return {
    ...rest,
    offenseCategory: offenseDefinition?.label ?? row.crimeType,
    sourceStageOfFelony: row.stageOfFelony ?? null,
    stageOfFelony: row.felonyStage,
  };
}
