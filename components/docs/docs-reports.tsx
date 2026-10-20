"use client";

import React from "react";
import { FileText, TrendingUp } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsReports() {
  const reportSections = [
    { title: "Executive Summary", desc: "High-level overview and critical operational takeaways." },
    { title: "Current Statistics", desc: "Total incident volume and clearance rates." },
    { title: "Temporal Trends", desc: "12-month historical crime progression." },
    { title: "Time Patterns", desc: "Hourly incident counts with all 24 hours labeled." },
    { title: "Crime Classification", desc: "Detailed breakdown of offense categories." },
    { title: "Barangay Comparison", desc: "Cross-barangay rankings and comparative metrics." },
    { title: "Crime Heatmap Matrix", desc: "Monthly distribution matrix across crime types." },
    { title: "Tactical Recommendations", desc: "Actionable patrol and security interventions." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          PDF Reports
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Report Generator compiles structured, publication-grade PDF documentation for command briefings, municipal peace and order councils, and official records.
        </p>
      </div>

      {/* Available Sections */}
      <section id="report-sections" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Configurable Report Sections
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Individual modules can be toggled on or off to tailor the report for specific audiences:
        </p>

        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          {reportSections.map((sec, idx) => (
            <li key={idx}>
              <strong className="text-slate-900 dark:text-white">{sec.title}</strong> — {sec.desc}
            </li>
          ))}
        </ol>
      </section>

      {/* Step by Step Generation */}
      <section id="exporting-reports" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Generating and Exporting Reports
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>Navigate to <strong>Dashboard → Reports</strong>.</li>
          <li>Select the desired barangay scope (or General Dashboard for all barangays).</li>
          <li>Toggle sections on or off based on your briefing requirements.</li>
          <li>Open <strong>Preview</strong> to review and edit the PDF.</li>
          <li>Use the top toolbar for font family, font size, line spacing, and zoom. Click the title, subtitle, or narrative text directly on a report page to edit it.</li>
          <li>The actual PDF pages stay visible with their charts and tables while you edit. Open the outline to jump between sections; press <strong>Escape</strong> to finish editing a text block.</li>
          <li>Click <strong>Download PDF</strong> in the preview to save the displayed version. The main download and archive actions also use your edits.</li>
        </ol>
        <p className="text-sm text-slate-600 dark:text-slate-400">Monthly and hourly charts show every numeric value, including zeros, in PDFs and exported PNGs. Narrative edits stay with the current report scope and are cleared when its filters change; formatting stays selected while the Reports page is open.</p>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Report Generation"
        suggestion="Tailor PDF outputs for specific council briefings by selecting sections and editing the preview — for example, an Executive Summary plus hourly incident distribution for shift commanders."
        actions={[
          {
            label: "Open Reports",
            href: "/dashboard/reports",
            icon: FileText,
            variant: "primary",
          },
          {
            label: "View Analytics",
            href: "/dashboard/analytics",
            icon: TrendingUp,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
