import { motion } from "framer-motion";

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex space-x-1 bg-muted/50 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar border border-border/50">
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
  );
}
