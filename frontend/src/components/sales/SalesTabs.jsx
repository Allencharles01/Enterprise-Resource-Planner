"use client";

const tabs = ["Client Projects", "Internships", "Training"];

export default function SalesTabs({ activeTab, setActiveTab }) {
  return (
    <div className="sales-tabs-wrapper inline-flex rounded-full p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all ${
              isActive ? "sales-tab-active" : "sales-tab"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}