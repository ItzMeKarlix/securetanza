"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTour } from "@/context/TourContext";
import {
  DOCS_SECTIONS,
  DocsHeader,
  DocsSidebar,
  getUserRole,
  filterDocsSectionsForUser,
  UserRoleType,
} from "@/components/docs";

export default function DocsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { replayTour } = useTour();

  // Role and preview state
  const actualRole = useMemo(() => getUserRole(user), [user]);
  const isAdmin = useMemo(() => {
    if (!user || !user.permissions) return false;
    return (
      user.permissions.includes("admin") ||
      user.permissions.includes("admin_operational_officer")
    );
  }, [user]);

  const [previewRole, setPreviewRole] = useState<UserRoleType | undefined>(undefined);
  const effectiveRole = isAdmin && previewRole ? previewRole : actualRole;

  // Filter sections dynamically based on user permissions and effective role
  const visibleSections = useMemo(() => {
    return filterDocsSectionsForUser(DOCS_SECTIONS, user, previewRole);
  }, [user, previewRole]);

  const [selectedSection, setSelectedSection] = useState("intro");
  const [selectedSubSection, setSelectedSubSection] = useState<string | undefined>();

  // Derive effective active section: if selectedSection is not permitted for this role, fall back cleanly
  const activeSection = useMemo(() => {
    if (visibleSections.length === 0) return "intro";
    if (visibleSections.some((s) => s.id === selectedSection)) {
      return selectedSection;
    }
    return visibleSections[0].id;
  }, [visibleSections, selectedSection]);

  const activeSubSection = selectedSection === activeSection ? selectedSubSection : undefined;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const currentSection = useMemo(() => {
    return (
      visibleSections.find((s) => s.id === activeSection) ||
      visibleSections[0] ||
      DOCS_SECTIONS[0]
    );
  }, [visibleSections, activeSection]);

  const ActiveComponent = currentSection.component;

  const handleSelectSection = useCallback((sectionId: string, subSectionId?: string) => {
    setSelectedSection(sectionId);
    setSelectedSubSection(subSectionId);


    if (subSectionId) {
      setTimeout(() => {
        const el = document.getElementById(subSectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
    } else {
      const mainEl = document.querySelector('[data-tour="docs-content"]');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      {/* Top Header */}
      <DocsHeader
        onReplayTour={() => replayTour(effectiveRole)}
        role={effectiveRole}
        actualRole={actualRole}
        isAdmin={isAdmin}
        previewRole={previewRole}
        onSelectPreviewRole={setPreviewRole}
      />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tree View Navigation */}
        <DocsSidebar
          sections={visibleSections}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          onSelectSection={handleSelectSection}
          role={effectiveRole}
        />

        {/* Right Content Area */}
        <main
          data-tour="docs-content"
          className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 custom-scrollbar p-6 lg:p-10 scroll-smooth"
        >
          <div className="max-w-3xl mx-auto pb-20">
            <ActiveComponent
              onReplayTour={() => replayTour(effectiveRole)}
              role={effectiveRole}
              permissions={user.permissions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
