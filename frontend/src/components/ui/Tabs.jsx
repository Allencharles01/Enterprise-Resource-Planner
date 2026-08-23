"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Tabs({ tabs, activeTab, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <>
      {/* Mobile Dropdown View */}
      <div className="relative md:hidden w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-violet-100 dark:border-border bg-violet-50/30 dark:bg-background/60 text-sm font-semibold text-slate-900 dark:text-foreground shadow-sm hover:bg-muted/50 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {activeItem.icon}
            {activeItem.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 dark:text-muted-foreground transition-transform duration-200 ${
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
            <div className="absolute left-0 right-0 mt-2 z-40 rounded-2xl border border-violet-100 dark:border-border bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onChange(tab.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === tab.id
                      ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold"
                      : "text-slate-600 dark:text-muted-foreground hover:bg-muted/50 hover:text-slate-900 dark:hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Tabs View */}
      <div className="hidden md:flex space-x-1 bg-muted/50 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar border border-border/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
