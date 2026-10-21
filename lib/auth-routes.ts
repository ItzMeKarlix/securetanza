/**
 * Client-safe authorization route resolver and permission checks.
 * Does not import any server-side dependencies (such as next/headers, prisma, etc.).
 */

export interface MinimalUserAuth {
  permissions?: string[];
  defaultLandingPage?: string | null;
}

/** The three tiers of access an account can hold. */
export type AccessRole = "admin" | "member" | "privileged";

/** Permission name that marks the Member role. */
export const MEMBER_PERMISSION = "operational_officer";

/** The granular, customizable module privileges a Privileged account picks from. */
export const MODULE_PRIVILEGES = [
  {
    permissionName: "privileged_map_view",
    label: "Map & Overview",
    description: "Interactive map, Compare and the Overview dashboard.",
  },
  {
    permissionName: "privileged_cases_view",
    label: "Cases",
    description: "Search and filter case records.",
  },
  {
    permissionName: "privileged_analytics_view",
    label: "Analytics & Reports",
    description: "Analytics dashboards, trends and reports.",
  },
] as const;

export const ACCESS_ROLES: Record<
  AccessRole,
  { label: string; description: string; badgeClass: string }
> = {
  admin: {
    label: "Administrator",
    description: "Full control, including user access, audit logs and backups.",
    badgeClass:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
  },
  member: {
    label: "Member",
    description:
      "Day-to-day operations: map, cases, analytics, uploads and exports. No audit logs, security or backups.",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  },
  privileged: {
    label: "Privileged",
    description: "Limited access to the modules you choose.",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
};

/**
 * True administrator: user management, audit logs, backups, system monitoring.
 */
export function isAdminUser(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return permissions.includes("admin_operational_officer") || permissions.includes("admin");
}

/** Member role (operational, without the admin-only controls). */
export function isMemberUser(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return permissions.includes(MEMBER_PERMISSION);
}

/**
 * Administrators and Members can do functional work: every dashboard module,
 * data uploads and exports.
 */
export function canOperate(permissions?: string[] | null): boolean {
  return isAdminUser(permissions) || isMemberUser(permissions);
}

/** Resolve the single role an account's permission list represents. */
export function getAccessRole(permissions?: string[] | null): AccessRole {
  if (isAdminUser(permissions)) return "admin";
  if (isMemberUser(permissions)) return "member";
  return "privileged";
}

/**
 * An account holds exactly one role: Administrator, Member, or Privileged
 * (one or more module privileges). Returns an error message when a permission
 * list mixes tiers or is empty, otherwise null.
 */
export function validateRolePermissions(permissionNames: string[]): string | null {
  if (permissionNames.length === 0) return "Select a role for this account.";

  const admin = isAdminUser(permissionNames);
  const member = isMemberUser(permissionNames);
  const privileges = permissionNames.filter((n) => n.startsWith("privileged_"));

  if (admin && member) return "An account can be either an Administrator or a Member, not both.";
  if ((admin || member) && privileges.length > 0) {
    return "Module privileges only apply to Privileged accounts.";
  }
  if (!admin && !member && privileges.length === 0) return "Select at least one module privilege.";
  return null;
}

/**
 * Check if the user is authorized to view interactive map features (Map, Compare, Overview).
 */
export function hasMapAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return canOperate(permissions) || permissions.includes("privileged_map_view");
}

/**
 * Check if the user is authorized to view cases and offenses.
 */
export function hasCasesAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return canOperate(permissions) || permissions.includes("privileged_cases_view");
}

/**
 * Check if the user is authorized to view analytics dashboards and reports.
 */
export function hasAnalyticsAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return canOperate(permissions) || permissions.includes("privileged_analytics_view");
}

/**
 * Determines the best valid landing route for a user based on their granted permissions
 * and saved/stored preferences.
 * 
 * If a preference is set and the user holds permission for it, the preference is respected.
 * Otherwise, falls back to the user's primary permitted module in priority order:
 * 1. Map / Overview (if map access granted)
 * 2. Cases (if cases access granted)
 * 3. Analytics (if analytics access granted)
 * 4. Account Preferences (if no dashboard access granted)
 */
export function getDefaultRouteForUser(
  user: MinimalUserAuth | null | undefined,
  fallbackPref?: string | null
): string {
  if (!user || !user.permissions || user.permissions.length === 0) {
    return "/login";
  }

  const permissions = user.permissions;
  const canMap = hasMapAccess(permissions);
  const canCases = hasCasesAccess(permissions);
  const canAnalytics = hasAnalyticsAccess(permissions);

  const rawPref =
    user.defaultLandingPage ||
    fallbackPref ||
    (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);

  const pref = rawPref === "dashboard" ? "overview" : rawPref;

  // 1. Explicit preference check with permission verification:
  if (pref === "map" && canMap) return "/";
  if (pref === "overview" && canMap) return "/dashboard/overview";
  if (pref === "analytics" && canAnalytics) return "/dashboard/analytics";
  if (pref === "cases" && canCases) return "/dashboard/cases";

  // 2. Permission-based fallback hierarchy:
  if (canMap) return "/dashboard/overview";
  if (canCases) return "/dashboard/cases";
  if (canAnalytics) return "/dashboard/analytics";

  // 3. Fallback for authenticated users with restricted clearances:
  return "/dashboard/config/preferences";
}
