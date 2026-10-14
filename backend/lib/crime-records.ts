import { createHash } from "node:crypto";
import { Prisma, type PrismaClient } from "./generated/prisma";
import { classifyOffense } from "@/lib/offense-classification";
import {
  generateCrimeFingerprint,
  generateIncidentKey,
} from "./crime-deduplication";

export type CrimeInput = Omit<
  Prisma.CrimeIncidentUncheckedCreateInput,
  | "incidentId"
  | "offenseDefinitionId"
  | "importKey"
  | "crimeType"
  | "felonyStage"
>;
export const offenseImportKey = (record: CrimeInput) =>
  createHash("md5").update(generateCrimeFingerprint(record)).digest("hex");

async function serializableMutation<T>(
  client: PrismaClient,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await client.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 30_000,
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
      const adapterError = error.meta?.driverAdapterError as
        { cause?: { kind?: string } } | undefined;
      const conflict =
        error.code === "P2034" ||
        (error.code === "P2010" &&
          adapterError?.cause?.kind === "TransactionWriteConflict");
      if (!conflict || attempt >= 4) throw error;
    }
  }
}

async function refreshIncidentCounts(
  tx: Prisma.TransactionClient,
  incidentIds: string[],
) {
  if (!incidentIds.length) return;
  await tx.$executeRaw`
    UPDATE incidents i SET offense_count=q.total, has_multiple_offenses=q.distinct_offenses>1, updated_at=CURRENT_TIMESTAMP
    FROM (SELECT incident_id,COUNT(*)::integer AS total,COUNT(DISTINCT offense_definition_id)::integer AS distinct_offenses
      FROM crime_incidents WHERE incident_id IN (${Prisma.join(incidentIds)}) GROUP BY incident_id) q
    WHERE i.id=q.incident_id`;
  // Keep empty parents as stable identities for later re-imports.
  await tx.incident.updateMany({
    where: { id: { in: incidentIds }, offenses: { none: {} } },
    data: { offenseCount: 0, hasMultipleOffenses: false },
  });
}

/** Unique constraints + ordered parent locks serialize overlapping/concurrent imports. */
export async function insertCrimeRecords(
  records: CrimeInput[],
  client: PrismaClient,
) {
  if (!records.length) return [];
  return client.$transaction(
    async (tx) => {
      const prepared = records.map((input) => ({
        input,
        key: generateIncidentKey(input),
        classification: classifyOffense(
          input.offense,
          input.stageOfFelony,
          input.incidentType,
        ),
      }));
      const parents = new Map(
        prepared.map((p) => [
          p.key,
          {
            key: p.key,
            blotterNo: p.input.blotterNo ?? null,
            station: p.input.stn ?? null,
          },
        ]),
      );
      const definitions = new Map(
        prepared.map((p) => [
          p.classification.code,
          { code: p.classification.code, label: p.classification.category },
        ]),
      );
      await tx.incident.createMany({
        data: [...parents.values()].sort((a, b) => a.key.localeCompare(b.key)),
        skipDuplicates: true,
      });
      await tx.offenseDefinition.createMany({
        data: [...definitions.values()].sort((a, b) =>
          a.code.localeCompare(b.code),
        ),
        skipDuplicates: true,
      });
      const incidents = await tx.incident.findMany({
        where: { key: { in: [...parents.keys()] } },
        select: { id: true, key: true },
      });
      const offenses = await tx.offenseDefinition.findMany({
        where: { code: { in: [...definitions.keys()] } },
        select: { id: true, code: true },
      });
      const ids = incidents.map((p) => p.id).sort();
      await tx.$queryRaw`SELECT id FROM incidents WHERE id IN (${Prisma.join(ids)}) ORDER BY id FOR UPDATE`;
      const parentIds = new Map(incidents.map((p) => [p.key, p.id]));
      const offenseIds = new Map(offenses.map((p) => [p.code, p.id]));
      // Migration retains legacy duplicates with nullable keys. Parent locks make
      // this identity check safe even if the originally keyed duplicate was deleted.
      const existing = await tx.crimeIncident.findMany({
        where: { incidentId: { in: ids } },
      });
      const existingKeys = new Set(existing.map(offenseImportKey));
      const created = await tx.crimeIncident.createManyAndReturn({
        data: prepared
          .filter((p) => !existingKeys.has(offenseImportKey(p.input)))
          .map((p) => ({
            ...p.input,
            incidentId: parentIds.get(p.key)!,
            offenseDefinitionId: offenseIds.get(p.classification.code)!,
            importKey: offenseImportKey(p.input),
            crimeType: p.classification.crimeType,
            felonyStage: p.classification.felonyStage,
          })),
        skipDuplicates: true,
      });
      await refreshIncidentCounts(tx, ids);
      return created;
    },
    { timeout: 60_000, maxWait: 30_000 },
  );
}

export async function updateCrimeRecord(
  id: string,
  changes: Partial<CrimeInput>,
  client: PrismaClient,
) {
  return serializableMutation(client, async (tx) => {
    const current = await tx.crimeIncident.findUniqueOrThrow({ where: { id } });
    const input = { ...current, ...changes };
    const key = generateIncidentKey(input);
    const classification = classifyOffense(
      input.offense,
      input.stageOfFelony,
      input.incidentType,
    );
    const parent = await tx.incident.upsert({
      where: { key },
      create: { key, blotterNo: input.blotterNo, station: input.stn },
      update: {},
    });
    const definition = await tx.offenseDefinition.upsert({
      where: { code: classification.code },
      create: { code: classification.code, label: classification.category },
      update: {},
    });
    const ids = [...new Set([current.incidentId, parent.id])].sort();
    await tx.$queryRaw`SELECT id FROM incidents WHERE id IN (${Prisma.join(ids)}) ORDER BY id FOR UPDATE`;
    const updated = await tx.crimeIncident.update({
      where: { id },
      data: {
        ...changes,
        incidentId: parent.id,
        offenseDefinitionId: definition.id,
        importKey: offenseImportKey(input),
        crimeType: classification.crimeType,
        felonyStage: classification.felonyStage,
      },
    });
    await refreshIncidentCounts(tx, ids);
    return updated;
  });
}

export async function deleteCrimeRecord(id: string, client: PrismaClient) {
  return serializableMutation(client, async (tx) => {
    const current = await tx.crimeIncident.findUniqueOrThrow({ where: { id } });
    await tx.$queryRaw`SELECT id FROM incidents WHERE id=${current.incidentId} FOR UPDATE`;
    const deleted = await tx.crimeIncident.delete({ where: { id } });
    await refreshIncidentCounts(tx, [current.incidentId]);
    return deleted;
  });
}

/** API compatibility: existing charts read incidentType; expose original separately. */
export function presentCrimeRecord<
  T extends {
    incidentType: string;
    crimeType: string;
    felonyStage: string;
    stageOfFelony?: string | null;
    incident?: {
      offenseCount: number;
      hasMultipleOffenses: boolean;
      offenses?: { caseStatus: string | null }[];
      allOffensesCleared?: boolean;
      allOffensesResolved?: boolean;
    };
  },
>(row: T) {
  const statuses =
    row.incident?.offenses?.map((r) =>
      (r.caseStatus ?? "").trim().toLowerCase(),
    ) ?? [];
  return {
    ...row,
    sourceIncidentType: row.incidentType,
    sourceStageOfFelony: row.stageOfFelony,
    incidentType: row.crimeType,
    stageOfFelony: row.felonyStage,
    incidentCleared:
      row.incident?.allOffensesCleared ??
      (statuses.length > 0 && statuses.every((s) => s === "cleared")),
    incidentResolved:
      row.incident?.allOffensesResolved ??
      (statuses.length > 0 &&
        statuses.every((s) =>
          ["cleared", "solved", "archived", "closed"].includes(s),
        )),
    offenseCount: row.incident?.offenseCount ?? 1,
    hasMultipleOffenses: row.incident?.hasMultipleOffenses ?? false,
  };
}
