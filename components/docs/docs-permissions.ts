import { DocsSectionItem } from "./docs-types";
import { UserRoleType } from "@/lib/tour/steps";
import {
  isAdminUser,
  canOperate,
  hasMapAccess,
  hasCasesAccess,
  hasAnalyticsAccess,
} from "@/lib/auth-routes";

export { type UserRoleType };

export interface AuthUserLike {
  permissions?: string[] | null;
}

export interface RoleBadgeInfo {
  label: string;
  badge: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
}

/**
 * Determine the user's operational role based on their permissions array.
 */
export function getUserRole(user: AuthUserLike | null | undefined): UserRoleType {
  if (!user || !user.permissions) return "privileged_user";

  const perms: string[] = user.permissions;
  if (perms.includes("admin") || perms.includes("admin_operational_officer")) {
    return "admin";
  }
  if (perms.includes("operational_officer")) {
    return "operational_officer";
  }
  return "privileged_user";
}

/**
 * Returns display metadata and styling for a given user role.
 */
export function getRoleBadge(role: UserRoleType): RoleBadgeInfo {
  switch (role) {
    case "admin":
      return {
        label: "System Administrator",
        badge: "Admin Clearance",
        shortLabel: "Administrator",
        badgeClass:
          "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
        description: "Full system administration, user provisioning, and operational control.",
      };
    case "operational_officer":
      return {
        label: "Member",
        badge: "Operational Clearance",
        shortLabel: "Member",
        badgeClass:
          "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800",
        description: "Day-to-day operations: mapping, cases, analytics, uploads and exports. No audit logs, security or backups.",
      };
    case "privileged_user":
    default:
      return {
        label: "Privileged User",
        badge: "Analyst Clearance",
        shortLabel: "Privileged",
        badgeClass:
          "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
        description: "Granular access to authorized mapping, cases, or analytical dashboards.",
      };
  }
}

/**
 * Checks whether a given role and permission set has authorization for data ingestion (Excel upload).
 */
export function hasUploadAccess(permissions: string[], role: UserRoleType): boolean {
  if (role === "admin") return true;
  return canOperate(permissions);
}

/**
 * Filter the master catalog of documentation sections according to the user's role and permissions.
 * Also filters individual subsections (e.g. hiding admin-only rule configuration or user management).
 */
export function filterDocsSectionsForUser(
  sections: DocsSectionItem[],
  user: AuthUserLike | null | undefined,
  roleOverride?: UserRoleType
): DocsSectionItem[] {

  if (!user) return [];

  const actualRole = getUserRole(user);
  const effectiveRole = roleOverride || actualRole;

  // Derive permissions for the effective role
  let effectivePerms: string[] = user.permissions || [];
  if (roleOverride && roleOverride !== actualRole) {
    if (roleOverride === "admin") {
      effectivePerms = ["admin_operational_officer", "admin"];
    } else if (roleOverride === "operational_officer") {
      effectivePerms = [
        "operational_officer",
        "privileged_map_view",
        "privileged_cases_view",
        "privileged_analytics_view",
      ];
    } else if (roleOverride === "privileged_user") {
      // Simulate standard privileged user with map clearance
      effectivePerms = ["privileged_user", "privileged_map_view"];
    }
  }

  const isAdmin = effectiveRole === "admin" || isAdminUser(effectivePerms);
  const canMap = isAdmin || hasMapAccess(effectivePerms);
  const canCases = isAdmin || hasCasesAccess(effectivePerms);
  const canAnalytics = isAdmin || hasAnalyticsAccess(effectivePerms);
  const canUpload = hasUploadAccess(effectivePerms, effectiveRole);

  return sections
    .filter((section) => {
      // Section-level access verification
      if (section.adminOnly && !isAdmin) return false;
      if (section.allowedRoles && !section.allowedRoles.includes(effectiveRole)) return false;

      // Custom access predicate
      if (section.hasAccess && !section.hasAccess(effectivePerms, effectiveRole)) {
        return false;
      }

      // Feature-specific permission checks
      switch (section.id) {
        case "intro":
        case "troubleshooting":
          return true; // Always visible
        case "map":
        case "dashboard":
          return canMap;
        case "cases":
          return canCases;
        case "analytics":
          return canAnalytics;
        case "reports":
          return canAnalytics || isAdmin;
        case "upload":
          return canUpload;
        case "settings":
          return true; // Profile and preferences are visible to all, but admin parts are filtered below
        default:
          return true;
      }
    })
    .map((section) => {
      // Filter subsections if present
      if (!section.subsections || section.subsections.length === 0) {
        return section;
      }

      const filteredSubsections = section.subsections.filter((sub) => {
        if (sub.adminOnly && !isAdmin) return false;
        if (sub.allowedRoles && !sub.allowedRoles.includes(effectiveRole)) return false;
        if (sub.hasAccess && !sub.hasAccess(effectivePerms, effectiveRole)) return false;

        // Special subsection checks
        if (section.id === "settings" && sub.id === "rbac-matrix") {
          return isAdmin;
        }
        if (section.id === "settings" && sub.id === "config-sections") {
          // If non-admin, the subsection still exists but covers profile & preferences
          return true;
        }
        if (section.id === "troubleshooting" && sub.id === "troubleshooting-issues") {
          return true;
        }

        return true;
      });

      return {
        ...section,
        subsections: filteredSubsections,
      };
    });
}
