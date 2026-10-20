import {
  BookOpen,
  Map,
  BarChart3,
  TrendingUp,
  FolderOpen,
  FileText,
  ShieldCheck,
  Upload,
  AlertCircle,
} from "lucide-react";
import { DocsSectionItem, DocsCategoryItem } from "./docs-types";
import { DocsIntro } from "./docs-intro";
import { DocsMap } from "./docs-map";
import { DocsDashboard } from "./docs-dashboard";
import { DocsAnalytics } from "./docs-analytics";
import { DocsCases } from "./docs-cases";
import { DocsReports } from "./docs-reports";
import { DocsSettings } from "./docs-settings";
import { DocsUpload } from "./docs-upload";
import { DocsTroubleshooting } from "./docs-troubleshooting";

export const DOCS_SECTIONS: DocsSectionItem[] = [
  {
    id: "intro",
    title: "Introduction",
    icon: BookOpen,
    tags: ["welcome", "overview", "system", "architecture", "tanza", "gis", "compare", "accessibility"],
    subsections: [
      { id: "walkthroughs", title: "Interactive Walkthrough", tags: ["tour", "roles", "officer", "analyst", "admin", "compare", "accessibility"] },
      { id: "core-modules", title: "Core Modules", tags: ["gis", "compare", "dashboard", "analytics", "cases", "reports", "accessibility"] },
    ],
    component: DocsIntro,
  },
  {
    id: "map",
    title: "GIS Crime Map",
    icon: Map,
    requiredPermission: "privileged_map_view",
    tags: ["gis", "map", "barangay", "filters", "time", "playback", "threat", "legend", "export", "compare"],
    subsections: [
      { id: "threat-levels", title: "Barangay Threat Levels", tags: ["threat", "quartiles", "thresholds", "critical", "moderate", "low"] },
      { id: "map-controls", title: "Map Controls & Spatial Tools", tags: ["filters", "playback", "scrubber", "drawer", "export", "compare"] },
    ],
    component: DocsMap,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    requiredPermission: "privileged_map_view",
    tags: ["overview", "dashboard", "kpi", "trends", "distribution", "blotter"],
    subsections: [
      { id: "kpi-metrics", title: "Key Performance Indicators", tags: ["total crimes", "offense", "hotspot", "kpi"] },
      { id: "charts-blotter", title: "Charts & Blotter Activity", tags: ["trajectory", "distribution", "blotter", "activity"] },
    ],
    component: DocsDashboard,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: TrendingUp,
    requiredPermission: "privileged_analytics_view",
    tags: ["analytics", "radar", "peak", "hours", "modus", "location", "heatmap", "matrix", "safety"],
    subsections: [
      { id: "math-metrics", title: "Mathematical Metrics & Indicators", tags: ["resolution rate", "safety index", "formula"] },
      { id: "visualizations", title: "Analytical Visualizations", tags: ["24-hour radar", "modus operandi", "heatmap", "matrix"] },
    ],
    component: DocsAnalytics,
  },
  {
    id: "cases",
    title: "Case Blotter",
    icon: FolderOpen,
    requiredPermission: "privileged_cases_view",
    tags: ["cases", "blotter", "investigation", "dossier", "heinous", "sensational", "ego", "suspect"],
    subsections: [
      { id: "clearance-status", title: "Clearance Classifications", tags: ["cleared", "investigation", "court", "closed"] },
      { id: "dossier-fields", title: "Dossier Fields & Classifications", tags: ["heinous", "sensational", "ego", "investigator"] },
    ],
    component: DocsCases,
  },
  {
    id: "reports",
    title: "PDF Reports",
    icon: FileText,
    requiredPermission: "privileged_analytics_view",
    tags: ["reports", "pdf", "export", "download", "executive", "summary", "print"],
    subsections: [
      { id: "report-sections", title: "Configurable Report Sections", tags: ["executive", "briefing", "matrix", "recommendations"] },
      { id: "exporting-reports", title: "Generating & Exporting Reports", tags: ["pdf", "download", "steps"] },
    ],
    component: DocsReports,
  },
  {
    id: "settings",
    title: "Settings & RBAC",
    icon: ShieldCheck,
    tags: ["settings", "rbac", "permissions", "roles", "admin", "clearance", "audit", "security", "accessibility", "preferences"],
    subsections: [
      { id: "rbac-matrix", title: "Permissions Matrix (RBAC)", tags: ["admin", "officer", "privileged", "clearance"], adminOnly: true },
      { id: "config-sections", title: "Configuration Sections", tags: ["profile", "security", "audit logs", "preferences", "accessibility", "contrast", "motion"] },
    ],
    component: DocsSettings,
  },
  {
    id: "upload",
    title: "Data Ingestion",
    icon: Upload,
    allowedRoles: ["admin", "operational_officer"],
    tags: ["upload", "excel", "xlsx", "schema", "columns", "import", "data", "pipeline"],
    subsections: [
      { id: "excel-schema", title: "Excel Column Schema", tags: ["headers", "xlsx", "format", "mandatory"] },
      { id: "validation-handling", title: "Validation & Error Handling", tags: ["centroid", "fallback", "duplicates", "audit"] },
    ],
    component: DocsUpload,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: AlertCircle,
    tags: ["troubleshooting", "faq", "error", "map", "charts", "browser"],
    subsections: [
      { id: "troubleshooting-issues", title: "Diagnostic Resolutions", tags: ["map tiles", "clearance", "download", "schema error"] },
    ],
    component: DocsTroubleshooting,
  },
];

export const DOCS_CATEGORIES: DocsCategoryItem[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "System overview, municipal context, and interactive tours",
    sectionIds: ["intro"],
  },
  {
    id: "spatial-intelligence",
    title: "Spatial Intelligence",
    description: "GIS crime map, barangay polygons, and timeline scrubber",
    sectionIds: ["map"],
  },
  {
    id: "operations-analytics",
    title: "Operations & Analytics",
    description: "KPI executive dashboard, temporal radar, and patterns",
    sectionIds: ["dashboard", "analytics"],
  },
  {
    id: "records-reports",
    title: "Records & Reports",
    description: "Police blotter case dossiers, flags, and PDF exports",
    sectionIds: ["cases", "reports"],
  },
  {
    id: "system-administration",
    title: "System Administration",
    description: "Batch ingestion, RBAC, and diagnostics",
    sectionIds: ["upload", "settings", "troubleshooting"],
  },
];
