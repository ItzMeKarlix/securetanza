"use client";

import React from "react";
import { Map, BarChart3 } from "lucide-react";
import { DocsCta } from "./docs-cta";
import { UserRoleType, getUserRole } from "./docs-permissions";
import { useTour } from "@/context/TourContext";
import { useAuth } from "@/context/AuthContext";
import {
  isAdminUser,
  hasMapAccess,
  hasCasesAccess,
  hasAnalyticsAccess,
} from "@/lib/auth-routes";

interface WalkthroughConfig {
  role: UserRoleType;
  title: string;
  badge: string;
  description: string;
}

const ROLE_WALKTHROUGHS: Partial<Record<UserRoleType, WalkthroughConfig>> = {
  operational_officer: {
    role: "operational_officer",
    title: "Operational Officer Walkthrough",
    badge: "Operational Officer",
    description:
      "Tactical workflows including GIS mapping, dual-period map comparison, overview KPIs, blotter dossiers, PDF reporting, and account preferences with accessibility controls.",
  },
  privileged_user: {
    role: "privileged_user",
    title: "Privileged Analyst / Viewer Walkthrough",
    badge: "Analyst / Viewer",
    description:
      "Analytical tools including side-by-side map comparison, 24-hour radar time patterns, crime matrix heatmaps, case dossiers, and display accessibility settings.",
  },
  admin: {
    role: "admin",
    title: "System Administrator Walkthrough",
    badge: "System Administrator",
    description:
      "Full platform administration covering GIS mapping, map comparison, blotter dossiers, RBAC user provisioning, upload audit logs, and account preferences with accessibility scaling.",
  },
};

interface DocsIntroProps {
  onReplayTour?: (role?: UserRoleType) => void;
  role?: UserRoleType;
  permissions?: string[];
}

export function DocsIntro({ onReplayTour, role, permissions: propPerms }: DocsIntroProps) {
  const { activeRole, replayTour } = useTour();
  const { user, loading } = useAuth();

  const userRole = getUserRole(user);
  const effectiveRole = role ?? activeRole ?? userRole;

  let effectivePerms = propPerms || user?.permissions || [];
  if (role && role !== userRole) {
    if (role === "admin") {
      effectivePerms = ["admin_operational_officer", "admin"];
    } else if (role === "operational_officer") {
      effectivePerms = ["operational_officer", "privileged_map_view", "privileged_cases_view", "privileged_analytics_view"];
    } else {
      effectivePerms = ["privileged_user", "privileged_map_view"];
    }
  }

  const isAdmin = effectiveRole === "admin" || isAdminUser(effectivePerms);
  const canMap = isAdmin || hasMapAccess(effectivePerms);
  const canCases = isAdmin || hasCasesAccess(effectivePerms);
  const canAnalytics = isAdmin || hasAnalyticsAccess(effectivePerms);

  const currentWalkthrough = effectiveRole ? ROLE_WALKTHROUGHS[effectiveRole] : null;

  const handleLaunchTour = () => {
    if (!currentWalkthrough) return;
    if (onReplayTour) {
      onReplayTour(currentWalkthrough.role);
    } else {
      replayTour(currentWalkthrough.role);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Introduction
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          SecureTanza is a Geographic Information System (GIS) and crime analytics platform built specifically for the Municipality of <strong>Tanza, Cavite</strong>. It provides law enforcement commanders, crime analysts, and municipal officials with real-time spatial intelligence, temporal-spatial hotspot detection, and data-driven reporting.
        </p>
      </div>

      {/* Role-Based Guided Walkthrough */}
      <section id="walkthroughs" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Interactive Walkthrough
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A guided interactive tour tailored to your authorized role:
        </p>

        {loading ? (
          <div className="py-3 animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3"></div>
          </div>
        ) : currentWalkthrough ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-900 dark:text-white">
                    {currentWalkthrough.title}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {currentWalkthrough.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentWalkthrough.description}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLaunchTour}
                className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 self-start sm:self-auto cursor-pointer flex-shrink-0"
              >
                Launch Walkthrough →
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Core Modules (Filtered by User Clearance) */}
      <section id="core-modules" className="space-y-4 scroll-mt-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Core Modules
          </h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Relevant to your authorized clearance
          </span>
        </div>

        <div className="space-y-6">
          {canMap && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Interactive GIS Crime Map
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Visualizes multi-layer geospatial incident pins, 41 barangay polygon boundaries, threat level risk heatmaps, and timeline playback scrubbers for spatial analysis.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Map Comparison Tool
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Provides dual-pane side-by-side crime maps with synchronized pan and zoom controls, shared threat color thresholds, and a live change ledger calculating net deltas and barangay shifts.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Executive Dashboard
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Provides executive KPI metric summaries, monthly volume trajectories, offense type breakdowns, and recent blotter activity for high-level monitoring.
                </p>
              </div>
            </>
          )}

          {canAnalytics && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Historical Crime Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Offers mathematical indicators (Resolution Rate, Safety Index), 24-hour polar time distribution plots, modus operandi patterns, and crime matrix heatmaps.
              </p>
            </div>
          )}

          {canCases && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Incident Blotter & Case Dossiers
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Enables searching and inspecting detailed incident blotter records, clearance statuses, heinous/sensational crime flags, and investigator assignments.
              </p>
            </div>
          )}

          {canAnalytics && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Institutional PDF Reports
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Compiles standardized PDF reports with embedded high-resolution chart captures, analytical observations, and tactical recommendations for official briefings.
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              System Settings & Accessibility
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Manages personnel RBAC clearances, scheduled exports, upload audit logs, and account preferences including themes, reduced motion, high contrast, and dynamic text sizing.
            </p>
          </div>
          {isAdmin ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                System Administration & RBAC
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Manages personnel RBAC clearances, upload audit logs, and account preferences including themes, reduced motion, high contrast, and dynamic text sizing.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Account Preferences & Accessibility
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Configure your account credentials and personalize accessibility features including themes (Light/Dark), reduced motion, high-contrast borders, and dynamic text scaling.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Ready to get started?"
        suggestion={
          canMap
            ? "Explore the GIS Crime Map for spatial incidents, or review key statistics on the Overview Dashboard."
            : canCases
            ? "Search incident blotter records and inspect case dossiers."
            : "Review analytical trends and indicators on your dashboard."
        }
        actions={
          canMap
            ? [
                {
                  label: "Open Crime Map",
                  href: "/",
                  icon: Map,
                  variant: "primary",
                },
                {
                  label: "Overview Dashboard",
                  href: "/dashboard/overview",
                  icon: BarChart3,
                  variant: "secondary",
                },
              ]
            : canCases
            ? [
                {
                  label: "Case Blotter",
                  href: "/dashboard/cases",
                  icon: BarChart3,
                  variant: "primary",
                },
              ]
            : [
                {
                  label: "Account Preferences",
                  href: "/dashboard/config/preferences",
                  icon: BarChart3,
                  variant: "primary",
                },
              ]
        }
      />
    </div>
  );
}
