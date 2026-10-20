import { LucideIcon } from "lucide-react";
import React from "react";
import { UserRoleType } from "@/lib/tour/steps";

export interface DocsComponentProps {
  onReplayTour?: () => void;
  role?: UserRoleType;
  permissions?: string[];
}

export interface DocsSubSectionItem {
  id: string;
  title: string;
  tags?: string[];
  adminOnly?: boolean;
  allowedRoles?: UserRoleType[];
  hasAccess?: (permissions: string[], role: UserRoleType) => boolean;
}

export interface DocsSectionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  badge?: string;
  tags?: string[];
  adminOnly?: boolean;
  allowedRoles?: UserRoleType[];
  requiredPermission?: string;
  hasAccess?: (permissions: string[], role: UserRoleType) => boolean;
  subsections?: DocsSubSectionItem[];
  component: React.ComponentType<DocsComponentProps>;
}

export interface DocsCategoryItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  description?: string;
  sectionIds: string[];
}
