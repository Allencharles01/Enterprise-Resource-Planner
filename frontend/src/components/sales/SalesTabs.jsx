"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const tabs = ["Client Projects", "Internships", "Training"];

export default function SalesTabs({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Dropdown View */}
      <div className="relative md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-border text-sm font-semibold text-foreground shadow-sm hover:bg-muted/50 transition-all cursor-pointer"
        >
          <span>{activeTab}</span>
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
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Tabs View */}
      <div className="hidden md:block w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
        <div className="sales-tabs-wrapper inline-flex rounded-full p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-8 py-3 text-sm font-medium transition-all cursor-pointer ${
                  isActive ? "sales-tab-active" : "sales-tab"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}