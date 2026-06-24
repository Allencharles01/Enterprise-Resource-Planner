"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  LogOut,
  Megaphone,
  Moon,
  Search,
  Sun,
  Users
} from "lucide-react";
import { apiGet, API_URL, currency } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import ModuleButton from "@/components/ModuleButton";
import DataModal from "@/components/DataModal";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import RecentActivity from "@/components/RecentActivity";

const modalConfig = {
  advertising: {
    title: "Advertising",
    endpoint: "/api/advertising",
    searchField: "search",
    filterKey: "platform",
    optionKey: "advertisingPlatforms",
    columns: [
      { key: "platform", label: "Platform" },
      { key: "campaignName", label: "Campaign" },
      { key: "amountSpent", label: "Spent", type: "money" },
      { key: "profitGenerated", label: "Profit", type: "money" },
      { key: "reach", label: "Reach", type: "number" },
      { key: "roi", label: "ROI" },
      { key: "status", label: "Status" }
    ]
  },
  creators: {
    title: "Content Creators",
    endpoint: "/api/creators",
    searchField: "search",
    filterKey: "platform",
    optionKey: "creatorPlatforms",
    tabsKey: "creatorTypes",
    tabParam: "creatorType",
    columns: [
      { key: "creatorName", label: "Creator" },
      { key: "platform", label: "Platform" },
      { key: "creatorType", label: "Type" },
      { key: "amountSpent", label: "Spent", type: "money" },
      { key: "revenueShare", label: "Revenue Share" },
      { key: "profitGenerated", label: "Profit", type: "money" },
      { key: "reach", label: "Reach", type: "number" },
      { key: "status", label: "Status" }
    ]
  },
  heavyAds: {
    title: "Heavy Advertisement",
    endpoint: "/api/heavy-ads",
    searchField: "search",
    filterKey: "campaignType",
    optionKey: "campaignTypes",
    columns: [
      { key: "campaignName", label: "Campaign" },
      { key: "campaignType", label: "Type" },
      { key: "location", label: "Location" },
      { key: "amountSpent", label: "Spent", type: "money" },
      { key: "profitGenerated", label: "Profit", type: "money" },
      { key: "reach", label: "Reach", type: "number" },
      { key: "roi", label: "ROI" },
      { key: "status", label: "Status" }
    ]
  },
  documents: {
    title: "Invoices & Documents",
    endpoint: "/api/documents",
    searchField: "search",
    tabsKey: "documentTypes",
    tabParam: "documentType",
    columns: [
      { key: "documentName", label: "Document" },
      { key: "documentType", label: "Type" },
      { key: "relatedTo", label: "Related To" },
      { key: "date", label: "Date", type: "date" },
      { key: "status", label: "Status" },
      { key: "fileUrl", label: "Actions", type: "link" }
    ]
  }
};

const modules = [
  { key: "advertising", title: "Advertising", description: "Live paid media campaigns, spend, reach, and ROI.", icon: Megaphone },
  { key: "creators", title: "Content Creators", description: "One-time and partnership creator performance.", icon: Users },
  { key: "heavyAds", title: "Heavy Advertisement", description: "Billboards, sponsorships, outdoor campaigns, and events.", icon: Building2 },
  { key: "documents", title: "Invoices & Documents", description: "Invoices, contracts, payment records, and agreements.", icon: FileText }
];

export default function DashboardPage() {
  const [dark, setDark] = useState(true);
  const [summary, setSummary] = useState(null);
  const [options, setOptions] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [range, setRange] = useState("monthly");
  const [activeModal, setActiveModal] = useState(null);
  const [modalRows, setModalRows] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const loadDashboard = useCallback(async () => {
    const [summaryData, optionData] = await Promise.all([apiGet("/api/dashboard-summary"), apiGet("/api/options")]);
    setSummary(summaryData);
    setOptions(optionData);
    setAnalytics(summaryData.monthlyAnalytics || []);
  }, []);

  const loadAnalytics = useCallback(async (selectedRange) => {
    const data = await apiGet("/api/analytics/monthly-spend", { range: selectedRange });
    setAnalytics(data);
  }, []);

  const config = activeModal ? modalConfig[activeModal] : null;

  const loadModalRows = useCallback(async () => {
    if (!config) return;
    setModalLoading(true);
    try {
      const params = { [config.searchField]: search, sortBy };
      if (filter && config.filterKey) params[config.filterKey] = filter;
      if (activeTab && config.tabParam) params[config.tabParam] = activeTab;
      if (activeModal === "documents") {
        params.from = dateFrom;
        params.to = dateTo;
      }
      setModalRows(await apiGet(config.endpoint, params));
    } finally {
      setModalLoading(false);
    }
  }, [activeModal, activeTab, config, dateFrom, dateTo, filter, search, sortBy]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadAnalytics(range);
  }, [loadAnalytics, range]);

  useEffect(() => {
    const socket = io(API_URL);
    const refresh = () => {
      loadDashboard();
      loadAnalytics(range);
      loadModalRows();
    };
    socket.on("dashboardUpdated", refresh);
    const interval = window.setInterval(refresh, 5000);
    return () => {
      window.clearInterval(interval);
      socket.disconnect();
    };
  }, [loadAnalytics, loadDashboard, loadModalRows, range]);

  useEffect(() => {
    loadModalRows();
  }, [loadModalRows]);

  useEffect(() => {
    if (!config || !options) return;
    const tabs = config.tabsKey ? options[config.tabsKey] || [] : [];
    setActiveTab(tabs[0] || "");
    setFilter("");
    setSearch("");
    setSortBy(config.columns[0]?.key || "createdAt");
    setDateFrom("");
    setDateTo("");
  }, [activeModal, config, options]);

  const filteredActivities = useMemo(() => {
    const activities = summary?.recentActivities || [];
    if (!globalSearch) return activities;
    return activities.filter((item) => item.message.toLowerCase().includes(globalSearch.toLowerCase()));
  }, [globalSearch, summary]);

  const filterOptions = config?.optionKey && options ? options[config.optionKey] || [] : [];
  const tabs = config?.tabsKey && options ? options[config.tabsKey] || [] : [];

  return (
    <main className="min-h-screen px-4 py-5 md:px-8" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <nav className="glass mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[8px] p-3">
        <button className="inline-flex items-center gap-2 rounded-[8px] border px-3 py-2" style={{ borderColor: "var(--border)" }} type="button">
          <Users size={17} /> Employees
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <select className="field px-3 py-2" aria-label="Department">
            <option>Marketing</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>
          <label className="field inline-flex items-center gap-2 px-3 py-2">
            <CalendarDays size={17} />
            <input className="bg-transparent outline-none" type="date" />
          </label>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border" onClick={() => setDark((value) => !value)} title="Toggle theme" type="button">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="inline-flex items-center gap-2 rounded-[8px] border px-3 py-2" style={{ borderColor: "var(--border)" }} type="button">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold tracking-normal md:text-5xl">
              DIGITAL MARKETING DASHBOARD
            </motion.h1>
            <p className="mt-3 text-lg" style={{ color: "var(--muted-foreground)" }}>
              Track, manage and optimize all marketing activities.
            </p>
          </div>
          <label className="field flex items-center gap-2 px-3 py-3">
            <Search size={18} />
            <input className="min-w-0 flex-1 bg-transparent outline-none" value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search recent activities" />
          </label>
        </div>

        <AnimatePresence mode="wait">
          {!summary ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass mt-8 rounded-[8px] p-8 text-center">
              Connecting to dashboard database...
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <MetricCard title="Total Allocated Budget" value={summary.totalBudget} data={summary.monthlyAnalytics} tone="blue" />
                <MetricCard title="Spend Amount" value={summary.totalSpend} data={summary.monthlyAnalytics} tone="pink" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((item) => (
                  <ModuleButton key={item.key} icon={item.icon} title={item.title} description={item.description} onClick={() => setActiveModal(item.key)} />
                ))}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
                <AnalyticsPanel data={analytics} range={range} ranges={options?.chartRanges || []} onRangeChange={setRange} />
                <div className="space-y-5">
                  <section className="glass rounded-[8px] p-5">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign size={19} />
                      <h2 className="text-lg font-semibold">Budget Snapshot</h2>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt style={{ color: "var(--muted-foreground)" }}>Creator Budget</dt>
                        <dd className="font-semibold">{currency(summary.creatorBudget)}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt style={{ color: "var(--muted-foreground)" }}>Heavy Ad Budget</dt>
                        <dd className="font-semibold">{currency(summary.heavyAdBudget)}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt style={{ color: "var(--muted-foreground)" }}>Documents</dt>
                        <dd className="font-semibold">{summary.documentCount}</dd>
                      </div>
                    </dl>
                  </section>
                  <RecentActivity activities={filteredActivities} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <DataModal
        open={Boolean(activeModal)}
        title={config?.title}
        onClose={() => setActiveModal(null)}
        rows={modalRows}
        columns={config?.columns || []}
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={modalLoading}
        filters={
          <div className="flex flex-wrap gap-3">
            {filterOptions.length ? (
              <select className="field px-3 py-2" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="">All filters</option>
                {filterOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : null}
            {activeModal === "documents" ? (
              <>
                <input className="field px-3 py-2" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="From date" />
                <input className="field px-3 py-2" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="To date" />
              </>
            ) : null}
          </div>
        }
      />
    </main>
  );
}
