"use client";

const tabs = [
  "Client Projects",
  "Internships",
  "Training",
];

export default function SalesTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="inline-flex p-1 rounded-full bg-gray-100 dark:bg-muted">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === tab
              ? "bg-white dark:bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}