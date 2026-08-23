"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, BookOpen, ChevronDown } from "lucide-react";

const tabIcons = {
  "Client Projects": Briefcase,
  Internships: GraduationCap,
  Training: BookOpen,
};

export default function SalesEmployeeTabs({ activeTab, setActiveTab, tabs }) {
  const [isOpen, setIsOpen] = useState(false);
  const ActiveIcon = tabIcons[activeTab] || Briefcase;

  return (
    <div className="w-full">
      {/* Mobile Dropdown View */}
      <div className="relative md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-border text-sm font-semibold text-foreground shadow-sm hover:bg-muted/50 transition-all cursor-pointer animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <ActiveIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
            <span>{activeTab}</span>
          </div>
          <ChevronDown
            size={18}
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 right-0 mt-2 z-40 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {tabs.map((tab) => {
                const Icon = tabIcons[tab] || Briefcase;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Desktop Tabs View */}
      <div className="hidden md:block w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
        <div className="inline-flex p-1 rounded-full bg-gray-100 dark:bg-muted">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab];

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white dark:bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}