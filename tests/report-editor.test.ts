import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import { DEFAULT_REPORT_EDITS, normalizeReportEdits } from '../lib/report-editor';
import { PDFReportGenerator, type ReportConfig, type ReportData } from '../lib/pdf-generator';

const all = { enabled: true, includeText: true, includeCharts: true, includeTables: true };
const off = { ...all, enabled: false };
const config: ReportConfig = {
  includeExecutiveSummary: all, includeOverview: all, includeTrends: all,
  includeTimePatterns: all, includeCrimeTypes: all, includeBarangayComparison: off,
  includeGeographicHighlights: off, includeCrimeMatrix: all, includeRecommendations: all,
};
const data: ReportData = {
  barangayName: 'All Barangays', timeRange: 'January - December 2026', totalCrimes: 48, totalOffenses: 52,
  generatedBy: 'Sample reviewer',
  analyticsData: {
    crimesByType: [{ type: 'Theft', count: 28 }, { type: 'Physical Injury', count: 24 }],
    crimesByMonth: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: i % 4 === 0 ? 0 : i + 1 })),
    crimesByBarangay: [{ barangay: 'Amaya I', count: 30 }, { barangay: 'Daang Amaya I', count: 18 }],
    crimeMatrix: [{ crimeType: 'Theft', monthlyData: [0, 2, 3, 0, 4, 2, 3, 1, 2, 4, 3, 4] }],
    timePatterns: { hourlyDistribution: Array.from({ length: 24 }, (_, i) => i % 5 === 0 ? 0 : i % 7 + 1), peakHour: 6 },
    trends: { monthlyChange: 20, resolutionRate: 65, safetyIndex: 70, trendLevel: 'moderate', trendDirection: 'increasing',
      currentThreatLevel: 'critical', previousThreatLevel: 'high', currentQuarterCrimes: 12, previousQuarterCrimes: 10,
      currentQuarterLabel: 'Q4 2026', previousQuarterLabel: 'Q3 2026' },
  },
};

// Suppress browser-only boundary fetching; these fixtures exercise local text,
// charts and tables without a server, a database or a network dependency.
function generator(edits: ConstructorParameters<typeof PDFReportGenerator>[0] = {}) {
  const instance = new PDFReportGenerator(edits);
  Object.assign(instance, { loadGeography: async () => undefined });
  return instance;
}
function streams(buffer: Uint8Array): string {
  const source = Buffer.from(buffer).toString('latin1');
  return [...source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)].map(match => {
    const bytes = Buffer.from(match[1], 'latin1');
    try { return inflateSync(bytes).toString('latin1'); } catch { return bytes.toString('latin1'); }
  }).join('\n');
}
async function fixture(name: string, blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (process.env.REPORT_FIXTURE_DIR) {
    await mkdir(process.env.REPORT_FIXTURE_DIR, { recursive: true });
    await writeFile(`${process.env.REPORT_FIXTURE_DIR}/${name}.pdf`, bytes);
  }
  return streams(bytes);
}

test('report typography defaults and bounds are deterministic', () => {
  assert.equal(DEFAULT_REPORT_EDITS.title, 'Incident Pattern and Trend Report');
  assert.equal(DEFAULT_REPORT_EDITS.subtitle, '');
  assert.equal(DEFAULT_REPORT_EDITS.fontSize, 9.5);
  assert.equal(normalizeReportEdits({ fontSize: Infinity, lineSpacing: NaN }).fontSize, 9.5);
  assert.equal(normalizeReportEdits({ fontSize: 99, lineSpacing: 2 }).fontSize, 14);
  assert.equal(normalizeReportEdits({ fontSize: 1, lineSpacing: 0 }).lineSpacing, 0.9);
});

test('paragraph IDs remain attached to their section when preceding sections are disabled', async () => {
  const full = generator();
  const initial = await fixture('default-report', await full.generateReport(config, data));
  assert.ok(initial.includes('(00) Tj') && initial.includes('(23) Tj'), 'complete hourly axis is in the PDF');
  const original = full.getEditableBlocks();
  assert.ok(original.length > 15);
  assert.ok(new Set(original.map(b => b.id)).size === original.length);
  const chosen = original.find(b => b.id.startsWith('temporal-analysis:paragraph:'))!;
  const edited = generator({ fontFamily: 'times', title: 'Editable command briefing', subtitle: 'Planning notes', paragraphOverrides: { [chosen.id]: 'A reviewed paragraph with local deployment guidance.' } });
  const text = await fixture('edited-report', await edited.generateReport({ ...config, includeExecutiveSummary: off, includeOverview: off }, data));
  assert.ok(text.includes('Editable command briefing'));
  assert.ok(text.includes('Planning notes'));
  assert.ok(text.includes('Reporting period: January - December 2026'));
  assert.ok(text.includes('A reviewed paragraph with local deployment guidance.'));
  assert.deepEqual(edited.getEditableBlocks().find(b => b.id === chosen.id), chosen, 'editor retains original generated wording');
  assert.ok(!text.includes(chosen.text), 'the original paragraph is replaced for rendering');
});

test('column charts print every count including zeros with all 24 hours', () => {
  const instance = generator();
  // Inspect actual rendered jsPDF output for this isolated chart, so repeated
  // numbers elsewhere in a report cannot mask a missing count or axis label.
  const chart = instance as unknown as {
    columnChart(items: Array<{ label: string; value: number }>): void;
    doc: { output(type: 'arraybuffer'): ArrayBuffer };
  };
  chart.columnChart(Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: i === 0 ? 0 : i + 100 })));
  const content = streams(new Uint8Array(chart.doc.output('arraybuffer')));
  for (let hour = 0; hour < 24; hour++) {
    assert.ok(content.includes(`(${String(hour).padStart(2, '0')}) Tj`), `hour ${hour} label`);
    assert.ok(content.includes(`(${hour === 0 ? 0 : hour + 100}) Tj`), `hour ${hour} count`);
  }
});

test('long edited narratives paginate with the selected font and preserve every word', async () => {
  const base = generator();
  await base.generateReport(config, data);
  const item = base.getEditableBlocks().find(b => b.id.includes(':list-item:'))!;
  const paragraph = base.getEditableBlocks().find(b => b.id.includes(':paragraph:'))!;
  const longText = 'Reviewed deployment guidance with measured staffing and documented case follow up. '.repeat(120) + 'END_REVIEWED_PARAGRAPH';
  const edited = generator({ fontFamily: 'courier', fontSize: 14, lineSpacing: 1.6,
    title: 'Command review of recorded incidents, geographic patterns and operational priorities for the reporting period',
    subtitle: 'Sample edited report for typography and pagination checks',
    paragraphOverrides: { [paragraph.id]: longText, [item.id]: 'Reviewed list item for the command briefing.' },
  });
  const content = await fixture('large-text-report', await edited.generateReport(config, data));
  assert.ok(content.includes('END_REVIEWED_PARAGRAPH'));
  assert.ok(content.includes('Reviewed list item for'));
  assert.ok(content.includes('14 Tf'), 'narrative uses the selected 14-point font');
  assert.ok(content.includes('Incident Pattern') === false, 'custom title replaces the default');
  const again = await edited.generateReport(config, data);
  assert.equal(edited.getEditableBlocks().length, base.getEditableBlocks().length, 'reusing the generator resets editor blocks');
  assert.ok(again.size > 1000);
});

test('paragraph edits preserve explicit newlines and allow an intentionally blank paragraph', async () => {
  const enabled = { ...all, includeCharts: false, includeTables: false };
  const onlyOverview = Object.fromEntries(Object.keys(config).map(key => [key, key === 'includeOverview' ? enabled : off])) as unknown as ReportConfig;
  const original = generator();
  await original.generateReport(onlyOverview, data);
  const block = original.getEditableBlocks()[0];
  const edited = generator({ paragraphOverrides: { [block.id]: 'FIRST_REVIEW_LINE\nSECOND_REVIEW_LINE' } });
  const content = await fixture('multiline-report', await edited.generateReport(onlyOverview, data));
  assert.ok(content.includes('(FIRST_REVIEW_LINE) Tj'));
  assert.ok(content.includes('(SECOND_REVIEW_LINE) Tj'));
  const blank = generator({ paragraphOverrides: { [block.id]: '' } });
  const blankContent = streams(new Uint8Array(await (await blank.generateReport(onlyOverview, data)).arrayBuffer()));
  assert.ok(!blankContent.includes('incidents were recorded across the reporting period'));
  assert.equal(blank.getEditableBlocks()[0].text, block.text);
});

test('editable regions follow the actual PDF pages, typography and inserted contents', async () => {
  const instance = generator({ subtitle: 'Reviewed operational report' });
  await instance.generateReport(config, data);
  const regions = instance.getEditableRegions();
  assert.ok(regions.length > 15);
  assert.equal(regions.find(region => region.target === 'title')?.page, 1);
  assert.equal(regions.find(region => region.target === 'subtitle')?.page, 1);
  const summary = regions.find(region => region.id.startsWith('executive-summary:paragraph:'))!;
  assert.equal(summary.page, 3, 'contents insertion shifts the summary from page 2 to page 3');
  assert.equal(summary.fontSize, 11.5);
  assert.equal(summary.fontFamily, 'helvetica');
  for (const region of regions) {
    assert.ok(region.x >= 0 && region.y >= 0 && region.width > 0 && region.height > 0);
    assert.ok(region.x + region.width <= 210.1 && region.y + region.height <= 297.1);
  }
  assert.ok(instance.getDocumentOutline().some(item => item.title === 'Trend Analysis' && item.page > 2));
  const first = instance.getEditableBlocks()[0];
  const expanded = generator({ fontFamily: 'courier', fontSize: 14, lineSpacing: 1.6, paragraphOverrides: { [first.id]: 'Long reviewed text. '.repeat(250) } });
  await expanded.generateReport(config, data);
  const fragments = expanded.getEditableRegions().filter(region => region.id === first.id);
  assert.ok(new Set(fragments.map(region => region.page)).size > 1, 'long paragraphs expose their real page fragments');
  assert.ok(fragments.every(region => region.fontFamily === 'courier' && region.fontSize > 14));
  assert.ok(fragments.every(region => region.originalValue === first.text), 'restoring text never reuses an edited PDF snapshot as its original');
});

test('Courier chart and matrix labels fit their actual columns and long offense tables wrap', async () => {
  const name = 'Physical Injury (Frustrated)';
  const other = 'Violation of Comprehensive Dangerous Drugs Act (Attempted)';
  const instance = generator({ fontFamily: 'courier', fontSize: 14, lineSpacing: 1.6 });
  type Cell = { text: string[]; width: number; styles: { fontSize: number; fontStyle: string }; padding(side: string): number };
  const render = instance as unknown as {
    horizontalBars(items: Array<{ label: string; value: number }>): void;
    matrixGrid(items: Array<{ crimeType: string; monthlyData: number[] }>): void;
    doc: {
      text(...args: unknown[]): unknown;
      getTextWidth(text: string): number;
      setFont(font: string, style: string): unknown;
      setFontSize(size: number): unknown;
      lastAutoTable: { head: Array<{ cells: Record<string, Cell> }>; body: Array<{ cells: Record<string, Cell> }> };
    };
  };
  // This is the actual requested font at the chart's capped dense-text size.
  render.doc.setFont('courier', 'normal');
  render.doc.setFontSize(8 * 1.15);
  assert.ok(render.doc.getTextWidth(name) > 52, 'regression fixture exceeds the old matrix label width');
  const drawn: Array<{ text: string; width: number }> = [];
  const originalText = render.doc.text.bind(render.doc);
  render.doc.text = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[1] === 20 && args[0].startsWith('Physical Injury')) {
      drawn.push({ text: args[0], width: render.doc.getTextWidth(args[0]) });
    }
    return originalText(...args);
  };
  render.horizontalBars([{ label: name, value: 28 }]);
  assert.ok(drawn[0].width <= 41, `horizontal label is ${drawn[0].width}mm wide`);
  assert.ok(drawn[0].text.endsWith('...'));
  render.matrixGrid([{ crimeType: name, monthlyData: Array(12).fill(1) }]);
  assert.ok(drawn[1].width <= 49, `matrix label is ${drawn[1].width}mm wide`);
  assert.ok(drawn[1].text.endsWith('...'));
  const longData: ReportData = { ...data, analyticsData: { ...data.analyticsData,
    crimesByType: [{ type: name, count: 28 }, { type: other, count: 24 }],
    crimeMatrix: [{ crimeType: name, monthlyData: Array(12).fill(1) }, { crimeType: other, monthlyData: Array(12).fill(1) }],
  } };
  await fixture('courier-long-labels-report', await instance.generateReport(config, longData));
  const table = render.doc.lastAutoTable;
  for (const row of [...table.head, ...table.body]) {
    for (const cell of Object.values(row.cells)) {
      render.doc.setFont('courier', cell.styles.fontStyle);
      render.doc.setFontSize(cell.styles.fontSize);
      const available = cell.width - cell.padding('left') - cell.padding('right');
      for (const line of cell.text) assert.ok(render.doc.getTextWidth(line) <= available + 0.2, `table text ${line} exceeds ${available}mm`);
    }
  }
  assert.ok(table.body.some(row => Object.values(row.cells).some(cell => cell.text.length > 1)), 'long offense names wrap within their table cells');
});
