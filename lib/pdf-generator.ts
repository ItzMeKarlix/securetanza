import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { normalizeReportEdits, type ReportEditOptions, type ReportEditRegion, type ReportOutlineEntry } from './report-editor';
import {
  type ThreatLevel,
  type GeoBounds,
  type BarangayShape,
  THREAT_RGB,
  calculateDynamicThresholds,
  threatLevelOf,
  loadTanzaGeography,
  makeGeoProjector,
} from './geo-threat';
import { buildHeatLevels, levelRangeLabel } from './heat-levels';
import { type RGB, INK, INK_MID, INK_SOFT, RULE, HAIR, ACCENT, ACCENT_DEEP, PAPER, RAMP_LO, RAMP_HI, mix, rampColor } from './report-theme';

export type SectionOptions = {
  enabled: boolean;
  includeText: boolean;
  includeCharts: boolean;
  includeTables: boolean;
};

export interface ReportConfig {
  includeExecutiveSummary: SectionOptions;
  includeOverview: SectionOptions;
  includeTrends: SectionOptions;
  includeTimePatterns: SectionOptions;
  includeCrimeTypes: SectionOptions;
  includeBarangayComparison: SectionOptions;
  includeGeographicHighlights: SectionOptions;
  includeCrimeMatrix: SectionOptions;
  includeRecommendations: SectionOptions;
}

export interface AnalyticsData {
  crimesByType: Array<{ type: string; count: number }>;
  crimesByMonth: Array<{ month: number; count: number }>;
  crimesByBarangay: Array<{ barangay: string; count: number }>;
  crimeMatrix?: Array<{ crimeType: string; monthlyData: number[] }>;
  timePatterns: {
    hourlyDistribution: number[];
    peakHour: number;
  };
  trends: {
    monthlyChange: number;
    resolutionRate: number;
    safetyIndex: number;
    trendLevel: string;
    trendDirection: string;
    currentThreatLevel: string;
    previousThreatLevel: string;
    currentQuarterCrimes: number;
    previousQuarterCrimes: number;
    currentQuarterLabel: string;
    previousQuarterLabel: string;
  };
}

export interface ReportData {
  barangayName: string;
  timeRange: string;
  /** Display name of the crime type / group the data is narrowed to, or null for all types. */
  crimeType?: string | null;
  analyticsData: AnalyticsData;
  totalOffenses: number;
  generatedBy?: string;
}

/* ── Geometry (mm) ────────────────────────────────────────────────────────── */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 20;
const CONTENT_TOP = 30;
const CONTENT_BOTTOM = PAGE_H - 24;
const MEASURE = PAGE_W - MARGIN_X * 2; // 170 — tables, charts, rules
const TEXT_COL = 126; // ≈ 74 characters at 9.5pt Helvetica

/* ── Type scale: size in points, leading in millimetres ───────────────────── */
const T = {
  micro: { size: 7, lead: 3.2 },
  small: { size: 8, lead: 3.7 },
  caption: { size: 8.5, lead: 4.0 },
  body: { size: 9.5, lead: 4.7 },
  sub: { size: 10.5, lead: 5.0 },
  lead: { size: 11.5, lead: 5.6 },
  section: { size: 13, lead: 6.0 },
  figure: { size: 19, lead: 8.0 },
  title: { size: 27, lead: 11.5 },
} as const;

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function hourBand(hour: number): string {
  const next = (hour + 1) % 24;
  return `${formatHour(hour)}–${formatHour(next)}`;
}

function sortDesc<T extends Record<string, unknown>>(rows: T[], key: keyof T): T[] {
  return [...rows].sort((a, b) => Number(b[key] ?? 0) - Number(a[key] ?? 0));
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private y: number;
  private sectionNo = 0;
  private contents: Array<{ no: number; title: string; page: number }> = [];
  private reference = '';
  private runningHead = '';
  private runningPeriod = '';
  private geoFeatures: BarangayShape[] | null = null;
  private geoBounds: GeoBounds | null = null;

  private readonly edits: ReportEditOptions;
  private readonly T: Record<keyof typeof T, { size: number; lead: number }>;
  private editableBlocks: Array<{ id: string; label: string; text: string }> = [];
  private blockSection = 'Report';
  private blockOrdinals = new Map<string, number>();
  private editableRegions: ReportEditRegion[] = [];
  private contentsInserted = false;

  constructor(edits: Partial<ReportEditOptions> = {}) {
    this.edits = normalizeReportEdits(edits);
    const ratio = this.edits.fontSize / T.body.size;
    this.T = Object.fromEntries(Object.entries(T).map(([key, scale]) => {
      // Keep dense chart, table and page furniture legible without crowding it.
      const factor = ['micro', 'small', 'caption'].includes(key) ? Math.min(ratio, 1.15) : ratio;
      return [key, { size: scale.size * factor, lead: scale.lead * factor * this.edits.lineSpacing }];
    })) as typeof this.T;
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    this.y = CONTENT_TOP;
  }

  /** Original generated wording, even when an override is applied to the PDF. */
  getEditableBlocks(): Array<{ id: string; label: string; text: string }> {
    return this.editableBlocks.map((block) => ({ ...block }));
  }

  getEditableRegions(): ReportEditRegion[] {
    return this.editableRegions.map(region => ({ ...region, page: region.page + (this.contentsInserted && region.page >= 2 ? 1 : 0) }));
  }

  getDocumentOutline(): ReportOutlineEntry[] {
    return [{ id: 'cover', title: 'Title & details', page: 1 }, ...this.contents.map(entry => ({
      id: entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title: entry.title,
      page: entry.page + (this.contentsInserted && entry.page >= 2 ? 1 : 0),
    }))];
  }

  private captureEditableLine(id: string, value: string, target: ReportEditRegion['target'], x: number, baseline: number, width: number, scale: { size: number; lead: number }, weight: 'normal' | 'bold') {
    const page = this.doc.getCurrentPageInfo().pageNumber;
    const top = baseline - scale.size * 25.4 / 72 * 0.85;
    const existing = this.editableRegions.find(region => region.id === id && region.page === page);
    if (existing) {
      existing.height = top + scale.lead - existing.y;
      return;
    }
    this.editableRegions.push({ id, label: target === 'paragraph' ? this.editableBlocks.find(block => block.id === id)!.label : target === 'title' ? 'Report title' : 'Subtitle',
      target, page, x, y: top, width, height: scale.lead, fontSize: scale.size, lineHeight: scale.lead,
      fontFamily: this.edits.fontFamily, fontWeight: weight, value,
      originalValue: target === 'paragraph' ? this.editableBlocks.find(block => block.id === id)!.text : value });
  }

  private editableText(text: string, kind: 'paragraph' | 'list-item'): string {
    const section = this.blockSection.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const key = `${section}:${kind}`;
    const ordinal = (this.blockOrdinals.get(key) ?? 0) + 1;
    this.blockOrdinals.set(key, ordinal);
    const id = `${key}:${ordinal}`;
    this.editableBlocks.push({ id, label: `${this.blockSection} · ${kind === 'paragraph' ? 'Paragraph' : 'List item'} ${ordinal}`, text });
    return Object.hasOwn(this.edits.paragraphOverrides, id) ? this.edits.paragraphOverrides[id] : text;
  }

  /* ── Primitives ─────────────────────────────────────────────────────────── */

  private get page(): number {
    return this.doc.getNumberOfPages();
  }

  private ink(color: RGB) {
    this.doc.setTextColor(color[0], color[1], color[2]);
  }

  private fill(color: RGB) {
    this.doc.setFillColor(color[0], color[1], color[2]);
  }

  private stroke(color: RGB, width: number) {
    this.doc.setDrawColor(color[0], color[1], color[2]);
    this.doc.setLineWidth(width);
  }

  private type(scale: { size: number; lead: number }, weight: 'normal' | 'bold' = 'normal') {
    this.doc.setFont(this.edits.fontFamily, weight);
    this.doc.setFontSize(scale.size);
  }

  private rule(y: number, color: RGB = HAIR, width = 0.15, x = MARGIN_X, w = MEASURE) {
    this.stroke(color, width);
    this.doc.line(x, y, x + w, y);
  }

  /** Reserve vertical space, breaking the page when it will not fit. */
  private ensure(space: number) {
    if (this.y + space > CONTENT_BOTTOM) {
      this.doc.addPage();
      this.y = CONTENT_TOP;
    }
  }

  private gap(space: number) {
    this.y += space;
  }

  /* ── Text blocks ────────────────────────────────────────────────────────── */

  private capsLabel(
    text: string,
    x: number,
    y: number,
    color: RGB = INK_SOFT,
    align: 'left' | 'center' | 'right' = 'left'
  ) {
    const upper = text.toUpperCase();
    const tracking = 0.28;
    this.type(this.T.micro, 'bold');
    this.ink(color);
    this.doc.setCharSpace(tracking);
    let drawX = x;
    if (align !== 'left') {
      // getTextWidth ignores charSpace, so add the tracking back in by hand.
      const width = this.doc.getTextWidth(upper) + tracking * Math.max(0, upper.length - 1);
      drawX = align === 'right' ? x - width : x - width / 2;
    }
    this.doc.text(upper, drawX, y);
    this.doc.setCharSpace(0);
  }

  private paragraph(
    text: string,
    opts: { scale?: { size: number; lead: number }; weight?: 'normal' | 'bold'; color?: RGB; width?: number; x?: number } = {}
  ) {
    text = this.editableText(text, 'paragraph');
    const blockId = this.editableBlocks[this.editableBlocks.length - 1].id;
    const scale = opts.scale ?? this.T.body;
    const width = opts.width ?? TEXT_COL;
    const x = opts.x ?? MARGIN_X;
    this.type(scale, opts.weight ?? 'normal');
    this.ink(opts.color ?? INK_MID);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    lines.forEach((line) => {
      this.ensure(scale.lead);
      this.type(scale, opts.weight ?? 'normal');
      this.ink(opts.color ?? INK_MID);
      this.captureEditableLine(blockId, text, 'paragraph', x, this.y, width, scale, opts.weight ?? 'normal');
      this.doc.text(line, x, this.y);
      this.y += scale.lead;
    });
  }

  private subhead(text: string) {
    this.ensure(this.T.sub.lead + 8);
    this.gap(4);
    this.type(this.T.sub, 'bold');
    this.ink(INK);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += this.T.sub.lead + 1.5;
  }

  /** Hanging-indent list item with a drawn accent dash for a marker. */
  private listItem(text: string, indent = 6) {
    text = this.editableText(text, 'list-item');
    const blockId = this.editableBlocks[this.editableBlocks.length - 1].id;
    this.type(this.T.body);
    const lines = this.doc.splitTextToSize(text, TEXT_COL - indent) as string[];
    lines.forEach((line, i) => {
      this.ensure(this.T.body.lead);
      if (i === 0) {
        this.fill(ACCENT);
        this.doc.rect(MARGIN_X, this.y - 1.4, 2.4, 0.5, 'F');
      }
      this.type(this.T.body);
      this.ink(INK_MID);
      this.captureEditableLine(blockId, text, 'paragraph', MARGIN_X + indent, this.y, TEXT_COL - indent, this.T.body, 'normal');
      this.doc.text(line, MARGIN_X + indent, this.y);
      this.y += this.T.body.lead;
    });
    this.y += 0.8;
  }

  private section(title: string, keepWith = 52) {
    this.blockSection = title;
    const lead = this.y > CONTENT_TOP + 1 ? 12 : 0;
    // Keep the heading with enough of its first block that it never sits alone.
    if (this.y + lead + 22 + keepWith > CONTENT_BOTTOM) {
      this.doc.addPage();
      this.y = CONTENT_TOP;
    } else {
      this.y += lead;
    }
    this.sectionNo += 1;
    this.contents.push({ no: this.sectionNo, title, page: this.page });

    const label = String(this.sectionNo).padStart(2, '0');
    this.type(this.T.section, 'bold');
    this.ink(ACCENT_DEEP);
    this.doc.text(label, MARGIN_X, this.y);
    const labelWidth = this.doc.getTextWidth(label);
    this.ink(INK);
    const headingLines = this.doc.splitTextToSize(title, MEASURE - labelWidth - 4) as string[];
    headingLines.forEach((line, index) => this.doc.text(line, MARGIN_X + labelWidth + 4, this.y + index * this.T.section.lead));

    this.y += (headingLines.length - 1) * this.T.section.lead + 3.4;
    this.rule(this.y, RULE, 0.4);
    this.y += Math.max(8, this.T.body.lead);
  }

  private note(text: string) {
    this.ensure(this.T.caption.lead * 2);
    this.type(this.T.caption, 'normal');
    this.ink(INK_SOFT);
    const lines = this.doc.splitTextToSize(text, TEXT_COL) as string[];
    lines.forEach((line) => {
      this.ensure(this.T.caption.lead);
      this.doc.text(line, MARGIN_X, this.y);
      this.y += this.T.caption.lead;
    });
    this.y += 2;
  }

  private emptyNotice(what: string) {
    this.ensure(10);
    this.gap(1);
    this.type(this.T.caption);
    this.ink(INK_SOFT);
    this.doc.text(`No ${what} was recorded for the selected period.`, MARGIN_X, this.y);
    this.y += this.T.caption.lead + 3;
  }

  /* ── Figure band: three key numbers, hairline-delimited, no boxes ───────── */

  private figureBand(figures: Array<{ label: string; value: string; caption?: string }>) {
    const count = figures.length;
    if (!count) return;
    const colW = MEASURE / count;
    const bandH = 26;
    this.ensure(bandH + 6);

    const top = this.y;

    figures.forEach((figure, i) => {
      const x = MARGIN_X + i * colW;
      this.capsLabel(figure.label, x, top + 4);

      this.type(this.T.figure, 'bold');
      this.ink(INK);
      this.doc.text(figure.value, x, top + 14);

      if (figure.caption) {
        this.type(this.T.micro);
        this.ink(INK_SOFT);
        this.doc.text(figure.caption, x, top + 19.5);
      }

      if (i > 0) {
        this.stroke(HAIR, 0.15);
        this.doc.line(x - 5, top - 1, x - 5, top + bandH - 5);
      }
    });

    this.rule(top + bandH - 3, HAIR, 0.15);
    this.y = top + bandH + 3;
  }

  /** Fit labels using the active font's glyph widths, leaving room before data. */
  private fittedLabel(text: string, width: number): string {
    const line = text.replace(/\s+/g, ' ').trim();
    if (this.doc.getTextWidth(line) <= width) return line;
    const suffix = '...';
    let end = line.length;
    while (end > 0 && this.doc.getTextWidth(line.slice(0, end).trimEnd() + suffix) > width) end -= 1;
    return line.slice(0, end).trimEnd() + suffix;
  }

  /* ── Charts, drawn as vectors so they stay sharp at any zoom ─────────────── */

  private horizontalBars(
    items: Array<{ label: string; value: number }>,
    opts: { caption?: string; labelW?: number } = {}
  ) {
    if (!items.length) return;
    const labelW = opts.labelW ?? 44;
    const valueW = 14;
    const trackW = MEASURE - labelW - valueW - 6;
    const rowH = 7.2;
    const barH = 4.2;
    const max = Math.max(...items.map((d) => d.value), 1);

    this.ensure(items.length * rowH + 10);
    if (opts.caption) {
      this.capsLabel(opts.caption, MARGIN_X, this.y);
      this.y += 5.5;
    }

    const top = this.y;
    items.forEach((item, i) => {
      const y = top + i * rowH;
      const w = Math.max((item.value / max) * trackW, item.value > 0 ? 0.6 : 0);

      this.type(this.T.small);
      this.ink(INK_MID);
      this.doc.text(this.fittedLabel(item.label, labelW - 3), MARGIN_X, y + barH - 0.7);

      this.fill(mix(RAMP_LO, PAPER, 0.45));
      this.doc.rect(MARGIN_X + labelW, y, trackW, barH, 'F');

      this.fill(rampColor(item.value / max));
      this.doc.rect(MARGIN_X + labelW, y, w, barH, 'F');

      this.type(this.T.small, 'bold');
      this.ink(INK);
      this.doc.text(String(item.value), MARGIN_X + MEASURE, y + barH - 0.7, { align: 'right' });
    });

    this.y = top + items.length * rowH + 2;
    this.rule(this.y, HAIR, 0.15);
    this.y += 6;
  }

  private columnChart(
    items: Array<{ label: string; value: number }>,
    opts: { caption?: string; height?: number; labelEvery?: number; highlight?: number } = {}
  ) {
    if (!items.length) return;
    const h = opts.height ?? 34;
    const labelEvery = opts.labelEvery ?? 1;
    const max = Math.max(...items.map((d) => d.value), 1);

    this.ensure(h + 26);
    if (opts.caption) {
      this.capsLabel(opts.caption, MARGIN_X, this.y);
      this.y += 6.5;
    }

    const top = this.y;
    const baseline = top + h;
    const slot = MEASURE / items.length;
    const barW = Math.min(slot * 0.62, 9);

    items.forEach((item, i) => {
      const barH = (item.value / max) * (h - 6);
      const x = MARGIN_X + i * slot + (slot - barW) / 2;
      const isPeak = opts.highlight === i;
      this.fill(isPeak ? RAMP_HI : rampColor(0.32 + (item.value / max) * 0.45));
      if (barH > 0) this.doc.rect(x, baseline - barH, barW, barH, 'F');

      // Persistent counts include zero-value columns, matching the image export.
      {
        this.type(this.T.micro, 'bold');
        const valueWidth = this.doc.getTextWidth(String(item.value));
        if (valueWidth > slot - 0.6) this.doc.setFontSize(this.T.micro.size * (slot - 0.6) / valueWidth);
        this.ink(INK);
        this.doc.text(String(item.value), x + barW / 2, baseline - barH - 1.8, { align: 'center' });
      }

      if (i % labelEvery === 0) {
        this.type(this.T.micro, isPeak ? 'bold' : 'normal');
        this.ink(isPeak ? INK : INK_SOFT);
        this.doc.text(item.label, x + barW / 2, baseline + 4, { align: 'center' });
      }
    });

    this.rule(baseline, RULE, 0.3);
    this.y = baseline + 9;
  }

  private matrixGrid(rows: Array<{ crimeType: string; monthlyData: number[] }>) {
    if (!rows.length) return;
    const labelW = 52;
    const totalW = 14;
    const cellW = (MEASURE - labelW - totalW) / 12;
    const cellH = 6.4;
    const { levels, levelOf } = buildHeatLevels(rows);

    this.ensure(rows.length * cellH + 24);

    const headY = this.y;
    MONTHS_SHORT.forEach((month, i) => {
      this.capsLabel(month, MARGIN_X + labelW + i * cellW + cellW / 2, headY, INK_SOFT, 'center');
    });
    this.capsLabel('Total', MARGIN_X + MEASURE, headY, INK, 'right');

    this.y = headY + 2.6;
    this.rule(this.y, RULE, 0.3);
    this.y += 1.4;

    const top = this.y;
    rows.forEach((row, r) => {
      const y = top + r * cellH;
      const total = row.monthlyData.reduce((a, b) => a + b, 0);

      this.type(this.T.small);
      this.ink(INK_MID);
      const label = this.fittedLabel(row.crimeType, labelW - 3);
      this.doc.text(label, MARGIN_X, y + cellH - 2.2);

      row.monthlyData.forEach((value, m) => {
        const x = MARGIN_X + labelW + m * cellW;
        if (value > 0) {
          const intensity = levels[levelOf(value)]?.intensity ?? 0.5;
          this.fill(rampColor(intensity));
          this.doc.rect(x + 0.35, y + 0.5, cellW - 0.7, cellH - 1.2, 'F');
          this.type(this.T.micro, 'bold');
          this.ink(intensity >= 0.6 ? PAPER : INK);
          const valueWidth = this.doc.getTextWidth(String(value));
          if (valueWidth > cellW - 1) this.doc.setFontSize(this.T.micro.size * (cellW - 1) / valueWidth);
          this.doc.text(String(value), x + cellW / 2, y + cellH - 2.4, { align: 'center' });
        } else {
          this.stroke(HAIR, 0.12);
          this.doc.line(x + cellW / 2 - 0.7, y + cellH / 2 - 0.3, x + cellW / 2 + 0.7, y + cellH / 2 - 0.3);
        }
      });

      this.type(this.T.small, 'bold');
      this.ink(INK);
      this.doc.text(String(total), MARGIN_X + MEASURE, y + cellH - 2.2, { align: 'right' });
    });

    this.y = top + rows.length * cellH + 1.5;
    this.rule(this.y, HAIR, 0.15);
    this.y += 5;

    // Ramp legend: one swatch per level in use, labelled with the counts it covers
    const swatchW = 13;
    this.capsLabel('Fewer', MARGIN_X, this.y + 1.8);
    const legendX = MARGIN_X + 14;
    levels.forEach((level, i) => {
      const x = legendX + i * (swatchW + 1);
      this.fill(rampColor(level.intensity));
      this.doc.rect(x, this.y - 1.2, swatchW, 3, 'F');
      this.type(this.T.micro);
      this.ink(INK_SOFT);
      this.doc.text(levelRangeLabel(level), x + swatchW / 2, this.y + 4.2, { align: 'center' });
    });
    this.capsLabel('More', legendX + levels.length * (swatchW + 1) + 1, this.y + 1.8);
    this.y += 9;
  }

  /* ── Map: Tanza's barangay boundaries, drawn as vector shapes from the same
     GeoJSON the live map uses, coloured with the same threat-level palette. ── */

  /** Fetches and caches public/tanza_cavite.geojson (via lib/geo-threat.ts,
   *  shared with lib/image-export.ts). Safe to call repeatedly — only the
   *  first call does any work. Leaves geoFeatures as [] on failure so callers
   *  can treat "no data" and "fetch failed" the same way. */
  private async loadGeography(): Promise<void> {
    if (this.geoFeatures) return;
    const { features, bounds } = await loadTanzaGeography();
    this.geoFeatures = features;
    this.geoBounds = bounds;
  }

  /** Builds a lon/lat → page-mm projector fitted to a box. See lib/geo-threat.ts. */
  private makeProjector(bounds: GeoBounds, box: { x: number; y: number; w: number; h: number }) {
    return makeGeoProjector(bounds, box);
  }

  /** Fills (and optionally strokes) one boundary ring, already projected to mm. */
  private fillRing(
    ring: Array<[number, number]>,
    project: (lon: number, lat: number) => [number, number],
    fill: RGB,
    opts: { stroke?: RGB; strokeWidth?: number } = {}
  ) {
    const pts = ring.map(([lon, lat]) => project(lon, lat));
    // GeoJSON rings repeat their start point to close the loop; drop the dupe.
    if (pts.length > 1) {
      const [sx, sy] = pts[0];
      const [lx, ly] = pts[pts.length - 1];
      if (Math.abs(sx - lx) < 1e-6 && Math.abs(sy - ly) < 1e-6) pts.pop();
    }
    if (pts.length < 3) return;

    const segments = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
    this.fill(fill);
    if (opts.stroke) {
      this.stroke(opts.stroke, opts.strokeWidth ?? 0.25);
      this.doc.lines(segments, pts[0][0], pts[0][1], [1, 1], 'FD', true);
    } else {
      this.doc.lines(segments, pts[0][0], pts[0][1], [1, 1], 'F', true);
    }
  }

  /** Caption + swatch/label for each threat band, stacked vertically. Returns
   *  the y position just past the last row, so callers can continue below it.
   *  Captioned "Barangay risk band" — distinct from the quarterly threat
   *  rating used elsewhere, since this is a different metric (per-barangay,
   *  recalculated from this report's own data, not the fixed quarterly bands
   *  defined in Closing Notes). See the "Barangay risk band" glossary entry. */
  private threatLegend(x: number, y: number): number {
    this.capsLabel('Barangay risk band', x, y);
    let ly = y + 6.5;

    const items: Array<[ThreatLevel, string]> = [
      ['secure', 'Secure'],
      ['low', 'Low'],
      ['moderate', 'Moderate'],
      ['high', 'High'],
      ['critical', 'Critical'],
    ];
    items.forEach(([level, label]) => {
      this.fill(THREAT_RGB[level]);
      this.doc.rect(x, ly - 2.6, 3.2, 3.2, 'F');
      this.type(this.T.micro);
      this.ink(INK_MID);
      this.doc.text(label, x + 5.5, ly);
      ly += 5.6;
    });
    return ly;
  }

  /** Every barangay in Tanza, filled by threat level. If `highlight` names one,
   *  it gets a dark outline and everything else is tinted toward paper. */
  private tanzaChoropleth(byBarangay: Array<{ barangay: string; count: number }>, opts: { highlight?: string } = {}) {
    if (!this.geoFeatures?.length || !this.geoBounds) return;
    const bounds = this.geoBounds;
    const features = this.geoFeatures;

    const counts: Record<string, number> = {};
    byBarangay.forEach((b) => {
      counts[b.barangay.toUpperCase()] = b.count;
    });
    const thresholds = calculateDynamicThresholds(features.map((f) => counts[f.name.toUpperCase()] ?? 0));
    const highlightUpper = opts.highlight?.toUpperCase();

    const latMean = (bounds.minLat + bounds.maxLat) / 2;
    const lonScale = Math.cos((latMean * Math.PI) / 180);
    const dataW = (bounds.maxLon - bounds.minLon) * lonScale || 1;
    const dataH = bounds.maxLat - bounds.minLat || 1;
    const boxH = 78;
    const mapW = boxH * (dataW / dataH);

    this.ensure(boxH + 10);
    const top = this.y;
    const project = this.makeProjector(bounds, { x: MARGIN_X, y: top, w: mapW, h: boxH });

    features.forEach((feature) => {
      const count = counts[feature.name.toUpperCase()] ?? 0;
      const level = threatLevelOf(count, thresholds);
      const isHighlighted = !!highlightUpper && feature.name.toUpperCase() === highlightUpper;
      const isDimmed = !!highlightUpper && !isHighlighted;
      const fillColor = isDimmed ? mix(THREAT_RGB[level], PAPER, 0.7) : THREAT_RGB[level];
      this.fillRing(feature.ring, project, fillColor, {
        stroke: isHighlighted ? INK : PAPER,
        strokeWidth: isHighlighted ? 0.7 : 0.25,
      });
    });

    const legendX = MARGIN_X + mapW + 12;
    let ly = this.threatLegend(legendX, top + 4);

    if (highlightUpper) {
      ly += 3;
      this.type(this.T.micro);
      this.ink(INK_SOFT);
      const lines = this.doc.splitTextToSize(
        `Outlined barangay is this report's scope.`,
        MEASURE - mapW - 12
      ) as string[];
      lines.forEach((line) => {
        this.doc.text(line, legendX, ly);
        ly += this.T.micro.lead;
      });
    }

    this.y = top + boxH + 6;
  }

  /** A single barangay's shape, tightly framed with a small margin, plus a
   *  caption underneath. Caller positions it explicitly (used in small grids). */
  private miniMapCard(feature: BarangayShape, level: ThreatLevel, count: number, box: { x: number; y: number; size: number }) {
    const { x, y, size } = box;
    const mapH = size - 14;

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    feature.ring.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    const padLon = (maxLon - minLon) * 0.18 || 0.0005;
    const padLat = (maxLat - minLat) * 0.18 || 0.0005;
    const bounds: GeoBounds = {
      minLon: minLon - padLon,
      maxLon: maxLon + padLon,
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
    };
    const project = this.makeProjector(bounds, { x, y, w: size, h: mapH });

    this.fillRing(feature.ring, project, THREAT_RGB[level], { stroke: INK, strokeWidth: 0.4 });

    this.rule(y + mapH + 2, HAIR, 0.15, x, size);
    this.type(this.T.small, 'bold');
    this.ink(INK);
    this.doc.text(feature.name, x, y + mapH + 7);
    this.type(this.T.micro);
    this.ink(INK_SOFT);
    this.doc.text(`${count.toLocaleString()} offense${count === 1 ? '' : 's'} · ${this.titleCase(level)}`, x, y + mapH + 11.5);
  }

  /* ── Tables ─────────────────────────────────────────────────────────────── */

  private table(opts: {
    head: string[];
    body: Array<Array<string | number>>;
    columnStyles?: Record<number, Record<string, unknown>>;
    shareColumn?: { index: number; values: number[] };
  }) {
    const shareColumn = opts.shareColumn;
    autoTable(this.doc, {
      startY: this.y,
      head: [opts.head.map((h) => h.toUpperCase())],
      body: opts.body,
      theme: 'plain',
      margin: { top: CONTENT_TOP, left: MARGIN_X, right: MARGIN_X, bottom: PAGE_H - CONTENT_BOTTOM },
      styles: {
        font: this.edits.fontFamily,
        fontSize: this.T.caption.size,
        textColor: [INK[0], INK[1], INK[2]],
        cellPadding: { top: 2 * this.edits.lineSpacing, right: 2.5, bottom: 2 * this.edits.lineSpacing, left: 0 },
        valign: 'middle',
        lineWidth: 0,
        overflow: 'linebreak',
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: this.T.micro.size,
        textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]],
        cellPadding: { top: 0, right: 2.5, bottom: 2, left: 0 },
        lineWidth: { bottom: 0.4 },
        lineColor: [RULE[0], RULE[1], RULE[2]],
      },
      bodyStyles: {
        lineWidth: { bottom: 0.12 },
        lineColor: [HAIR[0], HAIR[1], HAIR[2]],
      },
      columnStyles: opts.columnStyles,
      willDrawCell: (data) => {
        if (data.section === 'body' && shareColumn && data.column.index === shareColumn.index) {
          // Cell text is drawn as a bar instead of a string.
          data.cell.text = [];
        }
      },
      didDrawCell: (data) => {
        if (data.section !== 'body' || !shareColumn || data.column.index !== shareColumn.index) return;
        const value = shareColumn.values[data.row.index] ?? 0;
        const trackW = data.cell.width - 2.5;
        const barH = 2.6;
        const y = data.cell.y + (data.cell.height - barH) / 2;
        this.fill(mix(RAMP_LO, PAPER, 0.45));
        this.doc.rect(data.cell.x, y, trackW, barH, 'F');
        if (value > 0) {
          this.fill(rampColor(value));
          this.doc.rect(data.cell.x, y, Math.max(trackW * value, 0.6), barH, 'F');
        }
      },
    });

    const finalY = (this.doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY;
    this.y = (finalY ?? this.y) + 6;
  }

  /* ── Cover ──────────────────────────────────────────────────────────────── */

  private coverPage(data: ReportData, sectionCount: number) {
    const scope =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'Tanza, Cavite — all barangays'
        : `Barangay ${data.barangayName}, Tanza, Cavite`;

    this.fill(INK);
    this.doc.rect(0, 0, PAGE_W, 6, 'F');

    this.capsLabel('Crime analytics case study', MARGIN_X, 52, ACCENT_DEEP);

    this.y = 68;
    const coverText = (text: string, scale: { size: number; lead: number }, weight: 'normal' | 'bold', color: RGB, target?: 'title' | 'subtitle') => {
      this.type(scale, weight);
      const lines = this.doc.splitTextToSize(text, MEASURE) as string[];
      lines.forEach((line) => {
        this.ensure(scale.lead);
        this.type(scale, weight);
        this.ink(color);
        if (target) this.captureEditableLine(target, text, target, MARGIN_X, this.y, MEASURE, scale, weight);
        this.doc.text(line, MARGIN_X, this.y);
        this.y += scale.lead;
      });
    };
    // Fit ordinary long titles on the cover, and flow exceptionally long input
    // onto another page rather than clipping or silently discarding text.
    let titleScale = { ...this.T.title };
    this.type(titleScale, 'bold');
    while (this.doc.splitTextToSize(this.edits.title, MEASURE).length * titleScale.lead > 80 && titleScale.size > 18) {
      titleScale = { size: titleScale.size * 0.95, lead: titleScale.lead * 0.95 };
      this.type(titleScale, 'bold');
    }
    coverText(this.edits.title, titleScale, 'bold', INK, 'title');
    this.gap(4);
    if (this.edits.subtitle) {
      coverText(this.edits.subtitle, this.T.lead, 'normal', INK_MID, 'subtitle');
      this.gap(3);
    }
    // User wording never replaces the source scope, reporting period or filter.
    coverText(scope, this.T.lead, 'normal', INK_MID);
    coverText(`Reporting period: ${data.timeRange}`, this.T.lead, 'normal', INK_MID);
    if (data.crimeType) coverText(`Crime type: ${data.crimeType}`, this.T.lead, 'normal', INK_MID);

    this.ensure(14);
    this.stroke(ACCENT, 1.4);
    this.doc.line(MARGIN_X, this.y + 8, MARGIN_X + 42, this.y + 8);
    this.gap(20);

    // Keep the factual metadata together below the editable cover text.
    this.ensure(42);
    const metaTop = Math.max(this.y, PAGE_H - 64);
    this.rule(metaTop, RULE, 0.4);

    const meta: Array<[string, string]> = [
      ['Reference', this.reference],
      ['Total offenses', data.totalOffenses.toLocaleString()],
      ['Recorded offenses', data.totalOffenses.toLocaleString()],
      ['Sections included', String(sectionCount)],
      ['Generated', new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })],
    ];

    let my = metaTop + 8;
    meta.forEach(([label, value]) => {
      this.capsLabel(label, MARGIN_X, my);
      this.type(this.T.caption, 'bold');
      this.ink(INK);
      this.doc.text(value, MARGIN_X + 46, my);
      my += 5.4;
      this.rule(my - 2.2, HAIR, 0.12);
    });

    this.type(this.T.micro);
    this.ink(INK_SOFT);
    this.doc.text(
      'Produced by the Secure Tanza crime analytics system. For official use in planning and deployment review.',
      MARGIN_X,
      PAGE_H - 18
    );
  }

  /* ── Contents ───────────────────────────────────────────────────────────── */

  private contentsPage() {
    this.doc.insertPage(2);
    this.doc.setPage(2);

    let y = CONTENT_TOP + 6;
    this.type(this.T.section, 'bold');
    this.ink(INK);
    this.doc.text('Contents', MARGIN_X, y);
    y += 3.6;
    this.rule(y, RULE, 0.4);
    y += 9;

    this.contents.forEach((entry) => {
      const label = String(entry.no).padStart(2, '0');
      this.type(this.T.caption, 'bold');
      this.ink(ACCENT_DEEP);
      this.doc.text(label, MARGIN_X, y);

      this.type(this.T.body);
      this.ink(INK);
      this.doc.text(entry.title, MARGIN_X + 10, y);
      const titleW = this.doc.getTextWidth(entry.title);

      const pageLabel = String(entry.page + 1);
      this.type(this.T.caption, 'bold');
      this.ink(INK_MID);
      this.doc.text(pageLabel, MARGIN_X + MEASURE, y, { align: 'right' });
      const pageW = this.doc.getTextWidth(pageLabel);

      const leaderStart = MARGIN_X + 10 + titleW + 3;
      const leaderEnd = MARGIN_X + MEASURE - pageW - 3;
      if (leaderEnd > leaderStart) {
        this.stroke(HAIR, 0.15);
        this.doc.setLineDashPattern([0.4, 1.4], 0);
        this.doc.line(leaderStart, y - 1, leaderEnd, y - 1);
        this.doc.setLineDashPattern([], 0);
      }

      y += 8.4;
    });
  }

  /* ── Sections ───────────────────────────────────────────────────────────── */

  private executiveSummary(data: ReportData, opts: SectionOptions) {
    if (!opts.includeText) return;

    this.section('Executive Summary');

    const { trends } = data.analyticsData;
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const scope =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'all barangays of Tanza, Cavite'
        : `Barangay ${data.barangayName}`;

    this.paragraph(
      `${data.totalOffenses.toLocaleString()} offenses${data.crimeType ? ` (${data.crimeType})` : ''} were recorded across ${scope} during ${data.timeRange}. ` +
        `The current quarterly threat rating is ${trends.currentThreatLevel.toLowerCase()}, ` +
        `${
          trends.trendDirection === 'improved' ? 'down from' : trends.trendDirection === 'worsened' ? 'up from' : 'unchanged against'
        } ${trends.previousThreatLevel.toLowerCase()} in the preceding quarter.`,
      { scale: this.T.lead, color: INK, width: MEASURE }
    );
    this.gap(3);

    this.subhead('Findings');

    const topType = byType[0];
    const currentLabel = trends.currentQuarterLabel || 'the current quarter';
    const previousLabel = trends.previousQuarterLabel || 'the previous quarter';
    const peakCount = data.analyticsData.timePatterns.hourlyDistribution[data.analyticsData.timePatterns.peakHour] ?? 0;
    const findings: string[] = [
      `Offense volume moved ${trends.monthlyChange > 0 ? 'up' : trends.monthlyChange < 0 ? 'down' : 'sideways'} by ${Math.abs(
        trends.monthlyChange
      )}% between ${previousLabel} (${trends.previousQuarterCrimes}) and ${currentLabel} (${
        trends.currentQuarterCrimes
      }).`,
      topType
        ? `${topType.type} is the leading offense category at ${topType.count} ${
            topType.count === 1 ? 'offense' : 'offenses'
          }${data.totalOffenses ? ` (${((topType.count / data.totalOffenses) * 100).toFixed(1)}% of recorded offenses)` : ''}.`
        : 'No offense types were recorded in this period, so no leading category can be identified.',
      // Full time-of-day breakdown lives in Temporal Analysis — this just flags the busiest window.
      `Roughly ${peakCount} offense${peakCount === 1 ? '' : 's'} cluster in the ${hourBand(
        data.analyticsData.timePatterns.peakHour
      )} window, the busiest stretch of the day.`,
    ];

    findings.forEach((finding) => this.listItem(finding));
  }

  private situationalOverview(data: ReportData, opts: SectionOptions) {
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const hasData = byType.length > 0;
    if (hasData && !opts.includeText && !opts.includeCharts) return;

    this.section('Situational Overview');

    const { trends } = data.analyticsData;

    if (opts.includeText) {
      this.paragraph(
        `${data.totalOffenses.toLocaleString()} offenses were recorded across the reporting period. ` +
          `The figures below summarise the current situation at a glance.`
      );
      this.gap(3);
    }

    if (opts.includeCharts) {
      this.figureBand([
        { label: 'Total offenses', value: data.totalOffenses.toLocaleString(), caption: data.timeRange },
        { label: 'Cleared', value: `${trends.resolutionRate}%`, caption: 'Cases marked cleared' },
        { label: 'Safety index', value: `${trends.safetyIndex}%`, caption: 'Cleared or solved' },
      ]);
      this.gap(4);
    }

    if (!byType.length) {
      this.emptyNotice('offense data');
      return;
    }

    if (opts.includeCharts) {
      this.horizontalBars(
        byType.slice(0, 8).map((crime) => ({
          label: crime.type,
          value: crime.count,
        })),
        { caption: 'Leading offense types' }
      );
      this.gap(2);
    }
  }

  private trendAnalysis(data: ReportData, opts: SectionOptions) {
    if (!opts.includeText && !opts.includeCharts && !opts.includeTables) return;

    this.section('Trend Analysis');

    const { trends, crimesByMonth } = data.analyticsData;
    const direction =
      trends.trendDirection === 'improved'
        ? 'Improving — offenses decreased'
        : trends.trendDirection === 'worsened'
        ? 'Deteriorating — offenses increased'
        : 'Stable — no material change';

    if (opts.includeText) {
      this.paragraph(
        `Quarter-on-quarter comparison of recorded offenses and the resulting quarterly threat rating. ` +
          `Change is capped at ±90% so that low-count quarters do not distort the reading.`
      );
      this.gap(4);
    }

    if (opts.includeTables) {
      this.table({
        head: ['Period', 'Offenses', 'Quarterly Rating'],
        body: [
          [trends.currentQuarterLabel || 'Current quarter', trends.currentQuarterCrimes.toLocaleString(), this.titleCase(trends.currentThreatLevel)],
          [trends.previousQuarterLabel || 'Previous quarter', trends.previousQuarterCrimes.toLocaleString(), this.titleCase(trends.previousThreatLevel)],
          [
            'Change',
            `${trends.monthlyChange > 0 ? '+' : ''}${trends.monthlyChange}%`,
            direction,
          ],
        ],
        columnStyles: {
          1: { halign: 'right', cellWidth: 30 },
          2: { cellWidth: 70, cellPadding: { top: 2, right: 0, bottom: 2, left: 6 } },
        },
      });
      this.gap(8);
    }

    if (opts.includeCharts) {
      const monthly = crimesByMonth.filter((m) => m.month >= 1 && m.month <= 12);
      if (!monthly.length || monthly.every((m) => m.count === 0)) {
        this.emptyNotice('monthly activity');
      } else {
        const peakMonth = monthly.reduce((best, m, i) => (m.count > monthly[best].count ? i : best), 0);
        this.columnChart(
          monthly.map((m) => ({ label: MONTHS_SHORT[m.month - 1] ?? `M${m.month}`, value: m.count })),
          { caption: 'Offenses by month', height: 38, highlight: peakMonth }
        );

        this.note(
          `Highest monthly volume: ${MONTHS_SHORT[monthly[peakMonth].month - 1] ?? '—'} with ${monthly[peakMonth].count} offenses.`
        );
      }
    }
  }

  private temporalAnalysis(data: ReportData, opts: SectionOptions) {
    if (!opts.includeText && !opts.includeCharts && !opts.includeTables) return;

    this.section('Temporal Analysis');

    const { timePatterns } = data.analyticsData;
    const hours = Array.from({ length: 24 }, (_, hour) => timePatterns.hourlyDistribution?.[hour] ?? 0);
    const total = hours.reduce((a, b) => a + b, 0);

    if (!total) {
      if (opts.includeText) {
        this.paragraph('Distribution of offenses across the 24-hour cycle, derived from the recorded time of commission.');
      }
      this.emptyNotice('time-of-day data');
      return;
    }

    if (opts.includeText) {
      this.paragraph(
        `Distribution of offenses across the 24-hour cycle, derived from the recorded time of commission. ` +
          `Peak activity falls in the ${hourBand(timePatterns.peakHour)} band with ${hours[timePatterns.peakHour]} offenses.`
      );
      this.gap(5);
    }

    if (opts.includeCharts) {
      this.columnChart(
        hours.map((count, hour) => ({ label: String(hour).padStart(2, '0'), value: count })),
        { caption: 'Offenses by hour of day (00-23)', height: 38, highlight: timePatterns.peakHour }
      );
      this.gap(8);
    }

    if (opts.includeTables) {
      const bands: Array<[string, string, number]> = [
        ['Late night', '12 AM – 6 AM', hours.slice(0, 6).reduce((a, b) => a + b, 0)],
        ['Morning', '6 AM – 12 PM', hours.slice(6, 12).reduce((a, b) => a + b, 0)],
        ['Afternoon', '12 PM – 6 PM', hours.slice(12, 18).reduce((a, b) => a + b, 0)],
        ['Evening', '6 PM – 12 AM', hours.slice(18, 24).reduce((a, b) => a + b, 0)],
      ];

      this.table({
        head: ['Day part', 'Window', 'Offenses', 'Share', ''],
        body: bands.map(([name, window, count]) => [name, window, count.toLocaleString(), this.share(count, total), '']),
        columnStyles: {
          1: { cellWidth: 34, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
          2: { halign: 'right', cellWidth: 24 },
          3: { halign: 'right', cellWidth: 20 },
          4: { cellWidth: 40, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
        },
        shareColumn: { index: 4, values: bands.map(([, , count]) => (total ? count / total : 0)) },
      });
    }
  }

  private crimeClassification(data: ReportData, opts: SectionOptions) {
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const hasData = byType.length > 0;
    if (hasData && !opts.includeText && !opts.includeTables) return;

    this.section('Offense Classification');

    if (opts.includeText) {
      this.paragraph(
        'Recorded offenses grouped by offense and stage of felony.'
      );
      this.gap(4);
    }

    if (!byType.length) {
      this.emptyNotice('offense data');
      return;
    }

    if (opts.includeTables) {
      this.table({
        head: ['#', 'Offense and stage', 'Offenses', 'Share', ''],
        body: byType.map((crime, i) => [
          String(i + 1).padStart(2, '0'),
          crime.type,
          crime.count.toLocaleString(),
          this.share(crime.count, data.totalOffenses),
          '',
        ]),
        columnStyles: {
          0: { cellWidth: 11, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
          2: { halign: 'right', cellWidth: 20 },
          3: { halign: 'right', cellWidth: 20 },
          4: { cellWidth: 36, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
        },
        shareColumn: {
          index: 4,
          values: byType.map((crime) => (data.totalOffenses ? crime.count / data.totalOffenses : 0)),
        },
      });
    }
  }

  private comparativeAnalysis(data: ReportData, opts: SectionOptions) {
    const byBarangay = sortDesc(data.analyticsData.crimesByBarangay, 'count');
    const hasData = byBarangay.length > 0;
    if (hasData && !opts.includeText && !opts.includeCharts && !opts.includeTables) return;

    this.section('Comparative Analysis');

    const scoped = data.barangayName !== 'All Barangays' && data.barangayName !== 'General Dashboard';
    const universe = byBarangay.reduce((sum, b) => sum + b.count, 0);

    if (opts.includeText) {
      this.paragraph(
        scoped
          ? `Offense volume for Barangay ${data.barangayName} set against the other barangays of Tanza, Cavite.`
          : 'Offense volume across the barangays of Tanza, Cavite, ranked by recorded cases.'
      );
      this.gap(4);
    }

    if (!byBarangay.length) {
      this.emptyNotice('barangay-level data');
      return;
    }

    if (opts.includeCharts) {
      this.horizontalBars(
        byBarangay.slice(0, 8).map((item) => ({
          label: item.barangay,
          value: item.count,
        })),
        { caption: 'Highest-volume barangays' }
      );
      this.gap(2);

      this.tanzaChoropleth(byBarangay, { highlight: scoped ? data.barangayName : undefined });
    }

    if (opts.includeTables) {
      this.table({
        head: ['Rank', 'Barangay', 'Cases', 'Share', ''],
        body: byBarangay.map((item, i) => [
          String(i + 1).padStart(2, '0'),
          item.barangay,
          item.count.toLocaleString(),
          this.share(item.count, universe),
          '',
        ]),
        columnStyles: {
          0: { cellWidth: 16, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
          2: { halign: 'right', cellWidth: 20 },
          3: { halign: 'right', cellWidth: 20 },
          4: { cellWidth: 36, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
        },
        shareColumn: {
          index: 4,
          values: byBarangay.map((item) => (universe ? item.count / universe : 0)),
        },
      });
    }
  }

  private geographicHighlights(data: ReportData, opts: SectionOptions) {
    if (!opts.includeText && !opts.includeCharts) return;
    if (!this.geoFeatures?.length) return; // no boundary data to draw from

    const scoped = data.barangayName !== 'All Barangays' && data.barangayName !== 'General Dashboard';
    const counts: Record<string, number> = {};
    data.analyticsData.crimesByBarangay.forEach((b) => {
      counts[b.barangay.toUpperCase()] = b.count;
    });
    const allCounts = this.geoFeatures.map((f) => counts[f.name.toUpperCase()] ?? 0);
    const thresholds = calculateDynamicThresholds(allCounts);

    if (scoped) {
      const feature = this.geoFeatures.find((f) => f.name.toUpperCase() === data.barangayName.toUpperCase());
      if (!feature) return; // this barangay isn't in the boundary file — nothing to draw

      this.section('Geographic Highlights');
      const count = counts[feature.name.toUpperCase()] ?? 0;
      const level = threatLevelOf(count, thresholds);
      const avgPerBarangay = allCounts.length ? allCounts.reduce((a, b) => a + b, 0) / allCounts.length : 0;

      if (opts.includeText) {
        this.paragraph(
          `Barangay ${data.barangayName} recorded ${count.toLocaleString()}${data.crimeType ? ` ${data.crimeType}` : ''} offense${count === 1 ? '' : 's'} in ${data.timeRange}, ` +
            `placing it in the ${level} risk band relative to other barangays this period.`,
          { width: MEASURE }
        );
        if (avgPerBarangay > 0) {
          // A ratio-to-average summary — distinct from the rank/share figures
          // Comparative Analysis already reports, so it's new information here.
          this.gap(2);
          this.note(
            `That is ${(count / avgPerBarangay).toFixed(1)}× the townwide average of ${avgPerBarangay.toFixed(1)} offenses per barangay this period.`
          );
        } else {
          this.gap(4);
        }
      }

      if (opts.includeCharts) {
        const size = 72;
        this.ensure(size + 16);
        const top = this.y;
        this.miniMapCard(feature, level, count, { x: MARGIN_X, y: top, size });
        this.y = top + size + 8;
      }
      return;
    }

    // Town-wide: surface whichever barangays are currently flagged high or critical.
    const hotspots = this.geoFeatures
      .map((feature) => ({ feature, count: counts[feature.name.toUpperCase()] ?? 0 }))
      .filter(({ count }) => {
        const level = threatLevelOf(count, thresholds);
        return level === 'high' || level === 'critical';
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    if (!hotspots.length && !opts.includeText) return; // nothing to say and no map to draw

    this.section('Geographic Highlights');

    if (opts.includeText) {
      this.paragraph(
        hotspots.length
          ? `${hotspots.length} barangay${hotspots.length === 1 ? ' falls' : 's fall'} in this report's high or critical risk band: ${hotspots
              .map((h) => h.feature.name)
              .join(', ')}.`
          : "No barangay falls in this report's high or critical risk band.",
        { width: MEASURE }
      );
      if (hotspots.length && data.totalOffenses > 0) {
        // A concentration figure — how much of the town's total these flagged
        // barangays carry — which isn't stated anywhere else in the report.
        const hotspotTotal = hotspots.reduce((sum, h) => sum + h.count, 0);
        const share = (hotspotTotal / data.totalOffenses) * 100;
        this.gap(2);
        this.note(
          `${hotspots.length === 1 ? 'This barangay accounts' : 'Together, these barangays account'} for ${hotspotTotal.toLocaleString()} of ${data.totalOffenses.toLocaleString()} offenses recorded across Tanza this period (${share.toFixed(1)}%).`
        );
      } else {
        this.gap(4);
      }
    }

    if (opts.includeCharts && hotspots.length) {
      const cardSize = 48;
      const gap = 8;
      const cols = Math.min(hotspots.length, 3);
      const rows = Math.ceil(hotspots.length / cols);
      this.ensure(rows * (cardSize + 18));
      const top = this.y;

      hotspots.forEach((hotspot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        this.miniMapCard(hotspot.feature, threatLevelOf(hotspot.count, thresholds), hotspot.count, {
          x: MARGIN_X + col * (cardSize + gap),
          y: top + row * (cardSize + 18),
          size: cardSize,
        });
      });

      this.y = top + rows * (cardSize + 18);
    }
  }

  private incidenceMatrix(data: ReportData, opts: SectionOptions) {
    const matrix = data.analyticsData.crimeMatrix ?? [];
    const hasData = matrix.length > 0;
    if (hasData && !opts.includeText && !opts.includeCharts) return;

    this.section('Offense Matrix', 108);

    if (opts.includeText) {
      this.paragraph(
        'Monthly offense counts by category and stage of felony; a dash marks a month with no recorded offenses.'
      );
      this.gap(5);
    }

    if (!matrix.length) {
      this.emptyNotice('matrix data');
      return;
    }

    if (opts.includeCharts) {
      this.matrixGrid(matrix.slice(0, 12));
    }
  }

  private strategicRecommendations(data: ReportData, opts: SectionOptions) {
    if (!opts.includeText) return;

    this.section('Strategic Recommendations');

    const { trends } = data.analyticsData;
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const topType = byType[0];

    // Recommendations is purely text-based
    if (opts.includeText) {
      this.paragraph(
        'The following actions follow directly from the findings above. Each is tied to the measurement that prompted it.'
      );

      this.subhead('1 · Respond to the trend');
      if (trends.trendDirection === 'worsened') {
        this.paragraph('Offenses are trending upward against last quarter, per Trend Analysis. Treat this as an active escalation.');
        this.listItem('Raise patrol frequency and visibility in the highest-volume barangays identified in the comparative analysis.');
        this.listItem('Stand up community watch coordination with barangay officials in those areas.');
        this.listItem('Run a prevention awareness campaign targeted at the leading offence category.');
      } else if (trends.trendDirection === 'improved') {
        this.paragraph('Offenses are trending downward against last quarter, per Trend Analysis. Protect what is working.');
        this.listItem('Hold current patrol schedules and community engagement cadence rather than reallocating away from them.');
        this.listItem('Document the interventions in force this quarter so they can be replicated in lagging barangays.');
        this.listItem('Watch neighbouring areas for displacement rather than genuine reduction.');
      } else {
        this.paragraph(`Volume is flat against ${trends.previousQuarterLabel}. Shift the emphasis from response to prevention.`);
        this.listItem('Maintain patrol coverage and reinvest the margin into prevention programmes.');
        this.listItem('Review whether flat volume reflects stable conditions or under-reporting.');
      }

      this.subhead('2 · Target the leading offence');
      if (topType) {
        this.paragraph(`${topType.type} remains the leading offence category this period, as detailed in Offense Classification.`);
        this.listItem('Assign officers with specific experience in this offence category to the affected areas.');
        this.listItem('Direct awareness messaging at the population most exposed to it.');
        this.listItem('Confirm that reporting and response channels for this offence are published and staffed.');
      } else {
        this.paragraph('No offence category was recorded in this period, so no targeted strategy can be derived.');
      }

      this.subhead('3 · Match deployment to the clock');
      this.paragraph('Deployment should track the peak window identified in Temporal Analysis rather than spreading coverage evenly across the day.');
      this.listItem('Weight shift strength toward the peak band instead of distributing it evenly across the day.');
      this.listItem('Keep mobile units on standby through the peak band for rapid response.');
      this.listItem('Align barangay tanod schedules to the same window.');

      this.subhead('4 · Close more cases');
      this.paragraph('Clearance and safety-index figures from the Overview point to where investigative capacity should go next.');
      if (trends.resolutionRate < 50) {
        this.listItem('Audit where cases stall between filing and clearance, and staff that step first.');
        this.listItem('Tighten evidence collection and documentation standards at the point of first response.');
        this.listItem('Raise the cadence of coordination with the prosecution service on open cases.');
      } else {
        this.listItem('Hold the current investigative standard and record the practices behind it.');
        this.listItem('Circulate those practices to units with lower clearance rates.');
      }

      this.subhead('5 · Sustain community partnership');
      this.listItem('Hold a standing barangay forum on offense trends using this report as the shared reference.');
      this.listItem('Run youth engagement programmes in the barangays carrying the largest share of cases.');
      this.listItem('Bring local businesses into area security arrangements where commercial premises are affected.');
    }
  }

  private closingNotes(data: ReportData) {
    this.ensure(60);
    this.gap(12);
    this.rule(this.y, INK, 0.5);
    this.y += 7;

    this.type(this.T.sub, 'bold');
    this.ink(INK);
    this.doc.text('Method and definitions', MARGIN_X, this.y);
    this.y += this.T.sub.lead + 1;

    this.note(
      `Figures are drawn from offense records held in the Secure Tanza system for ${data.timeRange}, filtered to the reporting scope stated on the cover${data.crimeType ? `, and limited to the crime type ${data.crimeType}. Quarterly threat ratings still use the thresholds set for all crime types combined, so they read lower for a single type or group` : ''}. Counts reflect records present at the time of generation and will move as cases are updated.`
    );

    const definitions: Array<[string, string]> = [
      ['Cleared rate', 'Cases whose status contains "cleared", as a share of all cases in scope.'],
      ['Safety index', 'Cases whose status contains "cleared" or "solved", as a share of all cases in scope.'],
      ['Quarterly threat rating', 'The report scope\'s quarterly case count banded as secure (0), low (1-2), moderate (3-5), high (6-10), critical (11 or more). Fixed bands — used in Executive Summary and Trend Analysis.'],
      ['Barangay risk band', 'A different scale from the quarterly threat rating above: each barangay\'s case count for this report, banded against the other barangays using this report\'s own data (quartiles recalculated each time, not the fixed bands used for the quarterly rating). Used on the map in Comparative Analysis and in Geographic Highlights.'],
      ['Change', 'Quarter-on-quarter movement in case count, capped at plus or minus 90%.'],
      ['Time of day', 'Taken from the recorded time of commission; records without a time are excluded from temporal analysis.'],
    ];

    // Term on its own bold line, meaning wrapped beneath it at the full
    // measure — the two-column layout this replaced left the right third of
    // the page blank and clipped the longer terms into the meaning column.
    const bulletIndent = 6;
    const signatureBlockHeight = 10 + 26; // the gap() + ensure() the sign-off block below needs

    definitions.forEach(([term, meaning], i) => {
      this.type(this.T.caption);
      const lines = this.doc.splitTextToSize(meaning, MEASURE - bulletIndent) as string[];
      const entryHeight = this.T.caption.lead + lines.length * this.T.caption.lead + 2;
      const isLast = i === definitions.length - 1;
      // Reserve room for the sign-off block too when drawing the last entry,
      // so a break (if one is needed) happens before it — keeping "Prepared
      // by / Reviewed by" on the same page as the definition above it
      // instead of stranding it alone at the top of an otherwise-blank page.
      this.ensure(isLast ? entryHeight + signatureBlockHeight : entryHeight);

      this.fill(ACCENT);
      this.doc.rect(MARGIN_X, this.y - 1.4, 2.4, 0.5, 'F');
      this.type(this.T.caption, 'bold');
      this.ink(INK);
      this.doc.text(term, MARGIN_X + bulletIndent, this.y);
      this.y += this.T.caption.lead;

      this.type(this.T.caption, 'normal');
      this.ink(INK_SOFT);
      lines.forEach((line) => {
        this.ensure(this.T.caption.lead);
        this.doc.text(line, MARGIN_X + bulletIndent, this.y);
        this.y += this.T.caption.lead;
      });
      this.y += 2;
    });

    this.gap(10);
    this.ensure(26);
    const colW = (MEASURE - 10) / 2;
    [
      ['Prepared by', 'Name and designation'],
      ['Reviewed by', 'Name and designation'],
    ].forEach(([label, hint], i) => {
      const x = MARGIN_X + i * (colW + 10);
      this.rule(this.y + 10, RULE, 0.3, x, colW);
      this.capsLabel(label, x, this.y + 14.5);
      this.type(this.T.micro);
      this.ink(INK_SOFT);
      this.doc.text(hint, x, this.y + 18.6);
    });
    this.y += 26;
  }

  /* ── Chrome: running head + footer, stamped once at the end ─────────────── */

  private stampChrome(totalPages: number, contentsInserted: boolean, data: ReportData, stamp: Date) {
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1) continue; // cover carries its own furniture
      this.doc.setPage(page);

      this.type(this.T.micro);
      this.ink(INK_SOFT);
      this.doc.setCharSpace(0.2);
      this.doc.text(this.runningHead.toUpperCase(), MARGIN_X, 15.2);
      this.doc.text(this.runningPeriod.toUpperCase(), MARGIN_X + MEASURE, 15.2, { align: 'right' });
      this.doc.setCharSpace(0);
      this.rule(18, HAIR, 0.15);

      this.rule(PAGE_H - 16, HAIR, 0.15);
      this.type(this.T.micro);
      this.ink(INK_SOFT);
      this.doc.text(this.reference, MARGIN_X, PAGE_H - 11.5);
      
      const label = contentsInserted && page === 2 ? 'Contents' : `Page ${page} of ${totalPages}`;
      const referenceW = this.doc.getTextWidth(this.reference);
      this.type(this.T.micro, contentsInserted && page === 2 ? 'normal' : 'bold');
      const labelW = this.doc.getTextWidth(label);
      const generationLeft = MARGIN_X + referenceW + 3;
      const generationRight = MARGIN_X + MEASURE - labelW - 3;
      const generationText = `Generated by ${data.generatedBy || 'System'} on ${stamp.toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })}`;
      this.type(this.T.micro, 'normal');
      const generationWidth = this.doc.getTextWidth(generationText);
      const generationRoom = generationRight - generationLeft;
      if (generationWidth > generationRoom) this.doc.setFontSize(this.T.micro.size * generationRoom / generationWidth);
      this.doc.text(generationText, (generationLeft + generationRight) / 2, PAGE_H - 11.5, { align: 'center' });

      this.type(this.T.micro, contentsInserted && page === 2 ? 'normal' : 'bold');
      this.ink(contentsInserted && page === 2 ? INK_SOFT : INK_MID);
      this.doc.text(label, MARGIN_X + MEASURE, PAGE_H - 11.5, { align: 'right' });
    }
  }

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  private share(value: number, total: number): string {
    if (!total) return '—';
    return `${((value / total) * 100).toFixed(1)}%`;
  }

  private titleCase(value: string): string {
    if (!value) return '—';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  /* ── Entry point ────────────────────────────────────────────────────────── */

  async generateReport(config: ReportConfig, data: ReportData): Promise<Blob> {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    this.y = CONTENT_TOP;
    this.sectionNo = 0;
    this.contents = [];
    this.editableBlocks = [];
    this.editableRegions = [];
    this.contentsInserted = false;
    this.blockOrdinals.clear();
    this.blockSection = 'Report';
    const sectionCount = Object.values(config).filter((opts) => opts.enabled).length;
    const stamp = new Date();
    const slug =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'TNZ'
        : data.barangayName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'BRG';
    this.reference = `ST-${slug}-${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, '0')}${String(
      stamp.getDate()
    ).padStart(2, '0')}-${String(stamp.getHours()).padStart(2, '0')}${String(stamp.getMinutes()).padStart(2, '0')}`;
    this.runningHead =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'Crime analytics · Tanza, Cavite'
        : `Crime analytics · Brgy. ${data.barangayName}`;
    this.runningPeriod = data.timeRange;

    this.doc.setProperties({
      title: `${this.edits.title} — ${data.barangayName}`,
      subject: `Crime analytics case study · ${data.timeRange}${data.crimeType ? ` · ${data.crimeType}` : ''}`,
      author: 'Secure Tanza',
      creator: 'Secure Tanza crime analytics system',
      keywords: ['crime analytics', 'Tanza', 'Cavite', data.barangayName, ...(data.crimeType ? [data.crimeType] : [])].join(', '),
    });

    // Needed by the choropleth in Comparative Analysis and by Geographic
    // Highlights; fetched once up front regardless of which sections are on.
    await this.loadGeography();

    this.coverPage(data, sectionCount);

    this.doc.addPage();
    this.y = CONTENT_TOP;

    if (config.includeExecutiveSummary.enabled) this.executiveSummary(data, config.includeExecutiveSummary);
    if (config.includeOverview.enabled) this.situationalOverview(data, config.includeOverview);
    if (config.includeTrends.enabled) this.trendAnalysis(data, config.includeTrends);
    if (config.includeTimePatterns.enabled) this.temporalAnalysis(data, config.includeTimePatterns);
    if (config.includeCrimeTypes.enabled) this.crimeClassification(data, config.includeCrimeTypes);
    if (config.includeBarangayComparison.enabled) this.comparativeAnalysis(data, config.includeBarangayComparison);
    if (config.includeGeographicHighlights.enabled) this.geographicHighlights(data, config.includeGeographicHighlights);
    if (config.includeCrimeMatrix.enabled) this.incidenceMatrix(data, config.includeCrimeMatrix);
    if (config.includeRecommendations.enabled) this.strategicRecommendations(data, config.includeRecommendations);

    this.closingNotes(data);

    const contentsInserted = this.contents.length >= 3;
    this.contentsInserted = contentsInserted;
    if (contentsInserted) this.contentsPage();

    this.stampChrome(this.doc.getNumberOfPages(), contentsInserted, data, stamp);

    return this.doc.output('blob');
  }
}
