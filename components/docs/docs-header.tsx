"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles, Home, Shield, Eye } from "lucide-react";
import { UserRoleType, getRoleBadge } from "./docs-permissions";

interface DocsHeaderProps {
  onReplayTour?: () => void;
  onBack?: () => void;
  onHome?: () => void;
  role?: UserRoleType;
  actualRole?: UserRoleType;
  isAdmin?: boolean;
  previewRole?: UserRoleType;
  onSelectPreviewRole?: (role: UserRoleType) => void;
}

export function DocsHeader({
  onReplayTour,
  onBack,
  onHome,
  role = "privileged_user",
  actualRole,
  isAdmin = false,
  previewRole,
  onSelectPreviewRole,
}: DocsHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push("/");
    }
  };

  const badgeInfo = getRoleBadge(role);
  const isSimulating = Boolean(actualRole && previewRole && previewRole !== actualRole);

  return (
    <header className="w-full border-b z-50 flex-none bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        {/* Left Side: Navigation & Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="h-4 w-4 text-slate-700 dark:text-slate-300 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                Documentation & User Manual
              </h1>
            </div>
          </div>

          {/* Role Clearance Badge */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeInfo.badgeClass}`}
              title={badgeInfo.description}
            >
              <Shield className="h-3 w-3" />
              <span>{badgeInfo.label}</span>
              {isSimulating && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider">
                  Preview
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Right Side: Admin Preview Switcher & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Administrator Role Preview Switcher */}
          {isAdmin && onSelectPreviewRole && (
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-xs">
              <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">View as:</span>
              <select
                aria-label="Preview documentation for role"
                value={previewRole || "admin"}
                onChange={(e) => onSelectPreviewRole(e.target.value as UserRoleType)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="admin">Administrator (Full)</option>
                <option value="operational_officer">Operational Officer</option>
                <option value="privileged_user">Privileged Analyst</option>
              </select>
            </div>
          )}

          {onReplayTour && (
            <button
              onClick={onReplayTour}
              data-tour="docs-tour-btn"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Start Tour</span>
            </button>
          )}

          <button
            onClick={handleHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-medium text-xs transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home Map</span>
          </button>
        </div>
      </div>
    </header>
  );
}

