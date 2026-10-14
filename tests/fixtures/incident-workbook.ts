import * as XLSX from "xlsx";
import { existsSync, readFileSync } from "node:fs";

/** Sanitized fixture excludes narratives, names and other unneeded personal fields. */
export function loadIncidentWorkbook() {
  const source = "data/incidentrep_20160100448_2026-01-01-2026-09-29.xlsx";
  if (existsSync(source)) return XLSX.readFile(source);
  const rows = JSON.parse(
    readFileSync("tests/fixtures/incident-offenses.json", "utf8"),
  );
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), "Sheet1");
  return book;
}
