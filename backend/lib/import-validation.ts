/** Blank means unrecorded; zero is a recorded value, and malformed numbers are errors. */
export function parseNumericField(
  value: unknown,
  field: string,
  count = false,
): number | null {
  if (value === null || value === undefined || String(value).trim() === "")
    return null;
  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    (count && (!Number.isInteger(number) || number < 0))
  ) {
    throw new Error(
      `${field} must be ${count ? "a non-negative integer" : "a finite number"}`,
    );
  }
  return number;
}
