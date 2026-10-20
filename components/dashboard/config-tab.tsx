"use client";

import React, { useState } from "react";
import {
  Sun,
  Moon,
  Accessibility,
  Shield,
  User,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function ConfigTab() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("accessibility");

  const subTabs = [
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Profile", icon: User },
  ];
  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Sub-navigation Sidebar */}
      <div className="w-full lg:w-56 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
        <h3
          className={`text-xs font-black uppercase tracking-[0.3em] mb-3 hidden lg:block ${
            theme === "dark" ? "text-slate-500" : "text-slate-400"
          }`}
        >
          System Config
        </h3>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? theme === "dark"
                  ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 shadow-md shadow-sky-500/10"
                  : "bg-sky-50 text-[#0284C7] border border-sky-200 shadow-sm"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div
        className={`flex-1 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-700 overflow-hidden ${
          theme === "dark"
            ? "bg-white/[0.03] border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            : "bg-white shadow-xl shadow-slate-200/50 border-slate-200"
        }`}
      >
        {/* ========================================= */}
        {/* TAB 1: ACCESSIBILITY & THEME */}
        {/* ========================================= */}
        {activeSubTab === "accessibility" && (
          <div className="space-y-8">
            <div>
              <h2
                className={`text-xl font-black mb-2 transition-colors ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                Visual Interface & Theme
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Customize the appearance of SecureTanza. Toggle between high-contrast light and stealth dark themes to optimize situational readability.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  theme === "dark"
                    ? "bg-slate-900/50 border-white/[0.06]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center">
                    {theme === "light" ? (
                      <Sun className="h-5 w-5 text-[#0EA5E9]" />
                    ) : (
                      <Moon className="h-5 w-5 text-[#0EA5E9]" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Interface Theme
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Toggle high-contrast daylight mode or night operational dark mode.
                    </p>
                  </div>
                </div>

                <div
                  className={`flex p-1 rounded-xl border transition-colors shrink-0 ${
                    theme === "dark"
                      ? "bg-slate-950/60 border-white/5"
                      : "bg-slate-200/50 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: SECURITY & PROFILE (Informational) */}
        {/* ========================================= */}
        {activeSubTab === "security" && (
          <div className="space-y-6">
            <h2
              className={`text-xl font-black mb-2 transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Security Clearances & Audit
            </h2>
            <div className="p-6 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#0EA5E9]" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Clearance: {user?.fullName || "Operational Officer"}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Account: {user?.accountNumber || "ACC-000001"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {user?.permissions?.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold uppercase tracking-wider bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
                  >
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "account" && (
          <div className="space-y-6">
            <h2
              className={`text-xl font-black mb-2 transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Officer Account Profile
            </h2>
            <div className="p-6 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Authenticated Personnel
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {user?.fullName || "Operational Officer"}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Identifier ID: {user?.accountNumber || "ACC-000001"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
