"use client";

import { Briefcase, GraduationCap, BookOpen } from "lucide-react";

const tabIcons = {
  "Client Projects": Briefcase,
  Internships: GraduationCap,
  Training: BookOpen,
};

export default function SalesEmployeeTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="inline-flex p-1 rounded-full bg-gray-100 dark:bg-muted">
      {tabs.map((tab) => {
        const Icon = tabIcons[tab];

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={16} />
            {tab}
          </button>
        );
      })}
    </div>
  );
}