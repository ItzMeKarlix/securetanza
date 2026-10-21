/** Editable presentation and narrative content for a report. Counts and scope stay data-driven. */
export type ReportEditOptions = {
  fontFamily: 'helvetica' | 'times' | 'courier';
  fontSize: number;
  lineSpacing: number;
  title: string;
  /** Empty uses the report's factual geographic scope as its subheading. */
  subtitle: string;
  paragraphOverrides: Record<string, string>;
};

/** A text hit area in the actual generated PDF, in millimetres from its top left. */
export interface ReportEditRegion {
  id: string;
  label: string;
  target: 'title' | 'subtitle' | 'paragraph';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  fontFamily: ReportEditOptions['fontFamily'];
  fontWeight: 'normal' | 'bold';
  value: string;
  originalValue: string;
}

export interface ReportOutlineEntry { id: string; title: string; page: number }

export const DEFAULT_REPORT_EDITS: ReportEditOptions = {
  fontFamily: 'helvetica',
  fontSize: 9.5,
  lineSpacing: 1,
  title: 'Offense Pattern and Trend Report',
  subtitle: '',
  paragraphOverrides: {},
};

/** Normalize browser inputs and bound typography to the printable page. */
export function normalizeReportEdits(edits: Partial<ReportEditOptions> = {}): ReportEditOptions {
  const finite = (value: number | undefined, fallback: number) => Number.isFinite(value) ? value! : fallback;
  return {
    fontFamily: ['helvetica', 'times', 'courier'].includes(edits.fontFamily ?? '') ? edits.fontFamily! : DEFAULT_REPORT_EDITS.fontFamily,
    fontSize: Math.min(14, Math.max(8, finite(edits.fontSize, DEFAULT_REPORT_EDITS.fontSize))),
    lineSpacing: Math.min(1.6, Math.max(0.9, finite(edits.lineSpacing, DEFAULT_REPORT_EDITS.lineSpacing))),
    title: edits.title?.trim() || DEFAULT_REPORT_EDITS.title,
    subtitle: edits.subtitle?.trim() ?? '',
    paragraphOverrides: { ...edits.paragraphOverrides },
  };
}
