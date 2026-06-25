"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  Home,
  LogOut,
  Megaphone,
  MonitorPlay,
  Moon,
  Sun,
  Search,
  Users,
  Wallet
} from "lucide-react";
import { compact, fetchJson, inr } from "@/lib/data";
import ModuleCard from "@/components/ModuleCard";
import RecentActivity from "@/components/RecentActivity";
import ModalShell from "@/components/ModalShell";

const TopStatCard = dynamic(() => import("@/components/TopStatCard"), { ssr: false });
const AnalyticsChart = dynamic(() => import("@/components/AnalyticsChart"), { ssr: false });

const moduleIcons = {
  advertising: Megaphone,
  creators: Users,
  heavyads: MonitorPlay,
  documents: FileText
};

const modalGlow = {
  advertising: "glow-blue",
  creators: "glow-purple",
  heavyads: "glow-orange",
  documents: "glow-cyan"
};

const modalColor = {
  advertising: "#3b82f6",
  creators: "#a855f7",
  heavyads: "#f97316",
  documents: "#22d3ee"
};

function Status({ value }) {
  return (
    <span className="rounded-full border px-3 py-1 text-[12px]" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
      {value}
    </span>
  );
}

function StatStrip({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[16px] border p-4" style={{ borderColor: "var(--border)", background: "var(--soft)" }}>
          <p className="text-[12px] font-medium" style={{ color: "var(--muted-foreground)" }}>
            {stat.label}
          </p>
          <p className="mt-2 text-[22px] font-bold">{typeof stat.value === "number" ? (stat.value > 999 ? inr(stat.value) : compact(stat.value)) : stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <button className="rounded-[10px] border px-3 py-1.5 text-[12px]" style={{ borderColor: "var(--border)" }} type="button">
        Edit
      </button>
      <button className="rounded-[10px] bg-indigo-500 px-3 py-1.5 text-[12px] font-semibold text-white" type="button">
        View
      </button>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-auto rounded-[16px] border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
        <thead style={{ background: "var(--muted)" }}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.platform || row.campaignName || row.creator || row.documentName}-${index}`} className="border-t" style={{ borderColor: "var(--border)" }}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.key === "actions" ? (
                    <ActionButtons />
                  ) : column.money ? (
                    inr(row[column.key])
                  ) : column.compact ? (
                    compact(row[column.key])
                  ) : column.status ? (
                    <Status value={row[column.key]} />
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdvertisingModal({ data }) {
  const [filter, setFilter] = useState("All Platforms");
  const rows = filter === "All Platforms" ? data.rows : data.rows.filter((row) => row.platform === filter);

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {data.filters.map((item) => (
            <button key={item} onClick={() => setFilter(item)} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: filter === item ? "#6366f1" : "var(--border)", background: filter === item ? "#6366f1" : "transparent", color: filter === item ? "#ffffff" : "var(--foreground)" }} type="button">
              {item}
            </button>
          ))}
        </div>
        <input className="field h-10 rounded-[12px] px-3 text-[13px]" type="date" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "platform", label: "Platform" },
          { key: "amountSpent", label: "Amount Spent", money: true },
          { key: "profitGenerated", label: "Profit Generated", money: true },
          { key: "reach", label: "Reach", compact: true },
          { key: "roi", label: "ROI" },
          { key: "status", label: "Status", status: true },
          { key: "actions", label: "Actions" }
        ]}
      />
      <div className="rounded-[16px] border p-4" style={{ borderColor: "var(--border)", background: "var(--soft)" }}>
        <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          Best Performing Platform
        </p>
        <h3 className="mt-1 text-[20px] font-bold">{data.bestPlatform.name}</h3>
        <p className="mt-1 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          {data.bestPlatform.description}
        </p>
      </div>
    </div>
  );
}

function CreatorsModal({ data }) {
  const [platform, setPlatform] = useState(data.platforms[0]);
  const creatorColumns = [
    { key: "creator", label: "Creator" },
    { key: "platform", label: "Platform" },
    { key: "amountSpent", label: "Amount Spent", money: true },
    { key: "profitGenerated", label: "Profit Generated", money: true },
    { key: "reach", label: "Reach", compact: true },
    { key: "status", label: "Status", status: true },
    { key: "actions", label: "Actions" }
  ];

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap gap-2">
        {data.platforms.map((item) => (
          <button key={item} onClick={() => setPlatform(item)} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: platform === item ? "#a855f7" : "var(--border)", background: platform === item ? "#a855f7" : "transparent", color: platform === item ? "#ffffff" : "var(--foreground)" }} type="button">
            {item}
          </button>
        ))}
      </div>
      <section>
        <h3 className="mb-3 text-[18px] font-bold">One-Time Payment Creators</h3>
        <DataTable rows={data.oneTime} columns={creatorColumns} />
      </section>
      <section>
        <h3 className="mb-3 text-[18px] font-bold">Partnership Creators</h3>
        <DataTable rows={data.partnership} columns={creatorColumns} />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {data.bottomStats.map((stat) => (
          <div key={stat.label} className="rounded-[16px] border p-4" style={{ borderColor: "var(--border)", background: "var(--soft)" }}>
            <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
              {stat.label}
            </p>
            <p className="mt-1 text-[24px] font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeavyAdsModal({ data }) {
  const [filter, setFilter] = useState(data.filters[0]);
  const rows = data.rows.filter((row) => row.type === filter);

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap gap-2">
        {data.filters.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: filter === item ? "#fb923c" : "var(--border)", background: filter === item ? "#fb923c" : "transparent", color: filter === item ? "#ffffff" : "var(--foreground)" }} type="button">
            {item}
          </button>
        ))}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "campaignName", label: "Campaign Name" },
          { key: "type", label: "Type" },
          { key: "location", label: "Location/Event" },
          { key: "amountSpent", label: "Amount Spent", money: true },
          { key: "profitGenerated", label: "Profit Generated", money: true },
          { key: "reach", label: "Reach", compact: true },
          { key: "roi", label: "ROI" },
          { key: "status", label: "Status", status: true },
          { key: "actions", label: "Actions" }
        ]}
      />
      <div className="rounded-[16px] border p-4" style={{ borderColor: "var(--border)", background: "var(--soft)" }}>
        <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          Best Performing Campaign
        </p>
        <h3 className="mt-1 text-[20px] font-bold">{data.bestCampaign.name}</h3>
        <p className="mt-1 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          {data.bestCampaign.description}
        </p>
      </div>
    </div>
  );
}

function DocumentsModal({ data }) {
  const [tab, setTab] = useState(data.tabs[0]);
  const [query, setQuery] = useState("");
  const rows = data.rows.filter((row) => (tab === "All Documents" || row.type === tab) && row.documentName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {data.tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: tab === item ? "#22d3ee" : "var(--border)", background: tab === item ? "#22d3ee" : "transparent", color: tab === item ? "#020617" : "var(--foreground)" }} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_150px_auto]">
        <label className="field flex h-11 items-center gap-2 rounded-[12px] px-3">
          <Search size={17} />
          <input className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents" />
        </label>
        <select className="field rounded-[12px] px-3 text-[13px]">{data.types.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="field rounded-[12px] px-3 text-[13px]">{data.statuses.map((item) => <option key={item}>{item}</option>)}</select>
        <input className="field rounded-[12px] px-3 text-[13px]" type="date" />
        <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-cyan-400 px-4 text-[13px] font-bold text-slate-950" type="button">
          <Filter size={16} /> Filter
        </button>
      </div>
      <div className="overflow-auto rounded-[16px] border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
          <thead style={{ background: "var(--muted)" }}>
            <tr>
              <th className="px-4 py-3">Document Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Related To</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.documentName} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3">{row.documentName}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.relatedTo}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3"><Status value={row.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="flex h-8 items-center gap-1 rounded-[10px] border px-3 text-[12px]" style={{ borderColor: "var(--border)" }} type="button"><Eye size={14} /> View</button>
                    <button className="flex h-8 items-center gap-1 rounded-[10px] bg-cyan-400 px-3 text-[12px] font-semibold text-slate-950" type="button"><Download size={14} /> Download</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-[16px] border p-4" style={{ borderColor: "var(--border)", background: "var(--soft)" }}>
        <div className="mb-2 flex justify-between text-[13px]">
          <span>Storage</span>
          <span style={{ color: "var(--muted-foreground)" }}>{data.storage.label}</span>
        </div>
        <div className="storage-track h-3 overflow-hidden rounded-full">
          <div className="h-full rounded-full bg-cyan-400" style={{ width: `${data.storage.used}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true;
    }
    return true;
  });
  const [activeModal, setActiveModal] = useState(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    async function load() {
      const [summary, analytics, activities, advertising, creators, heavyads, documents] = await Promise.all([
        fetchJson("/data/summary.json"),
        fetchJson("/data/analytics.json"),
        fetchJson("/data/activities.json"),
        fetchJson("/data/advertising.json"),
        fetchJson("/data/creators.json"),
        fetchJson("/data/heavyads.json"),
        fetchJson("/data/documents.json")
      ]);
      setData({ summary, analytics, activities, advertising, creators, heavyads, documents });
    }
    load();
  }, []);

  const modalTitle = useMemo(() => {
    if (!data || !activeModal) return "";
    return data.summary.modules.find((item) => item.id === activeModal)?.title || "";
  }, [activeModal, data]);

  const visibleModules = useMemo(() => {
    if (!data) return [];
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return data.summary.modules;
    return data.summary.modules.filter((module) =>
      [module.title, module.metricLabel, module.metricText, module.button, ...module.labels]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [data, search]);

  if (!data) {
    return <main className="flex min-h-screen items-center justify-center text-[15px]">Loading dashboard data...</main>;
  }

  return (
    <main className="min-h-screen">
      <nav className="app-nav sticky top-0 z-30 flex min-h-[70px] w-full items-center border-b px-6 backdrop-blur-2xl max-lg:flex-wrap max-lg:gap-4 max-lg:py-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex min-w-[240px] items-center gap-4">
          <span className="brand-mark text-[28px] font-black leading-none tracking-[-0.08em]">
            N
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[21px] font-semibold tracking-[-0.03em]">NovaNectar</span>
            <span className="theme-text-subtle text-[18px] font-medium">ERP</span>
          </div>
        </div>
        <div className="ml-6 border-l pl-6 max-lg:ml-0" style={{ borderColor: "var(--border)" }}>
          <p className="text-[18px] font-semibold tracking-[-0.03em]">Welcome back, {data.summary.user.name}</p>
          <p className="mt-1 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
            {data.summary.user.access}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          <button className="nav-button nav-button-green flex h-10 items-center gap-2 rounded-[8px] px-4 text-[14px] font-medium" type="button">
            <Home size={17} /> Department <ChevronDown size={15} />
          </button>
          <button className="nav-button nav-button-blue flex h-10 items-center gap-2 rounded-[8px] px-4 text-[14px] font-medium" type="button">
            <Users size={16} /> Employees
          </button>
          <button className="nav-button flex h-10 w-10 items-center justify-center rounded-[8px]" type="button" aria-label="Calendar">
            <CalendarDays size={18} />
          </button>
          <button
            className="nav-button flex h-10 w-10 items-center justify-center rounded-[8px]"
            onClick={() => setDark((value) => !value)}
            type="button"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="nav-button nav-button-red flex h-10 items-center gap-2 rounded-[8px] px-4 text-[14px] font-medium" type="button">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-[1440px] px-5 pb-8 pt-5 md:px-8">
        <motion.header className="mx-auto max-w-[760px] text-center" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em] max-md:text-[28px]">Digital Marketing Dashboard</h1>
          <p className="mt-3 text-[16px]" style={{ color: "var(--muted-foreground)" }}>
            Track, manage and optimize all marketing activities in one place.
          </p>
          <label className="search-shell mx-auto mt-6 flex h-12 max-w-[560px] items-center gap-3 rounded-full px-5 transition">
            <Search size={19} className="theme-text-subtle shrink-0" />
            <input
              className="theme-input min-w-0 flex-1 bg-transparent text-[14px] outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search campaigns, creators, invoices..."
            />
          </label>
        </motion.header>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <TopStatCard icon={Wallet} title="Total Allocated Budget" amount={data.summary.budget.totalAllocated} change={data.summary.budget.allocatedChange} chartData={data.analytics.monthly} variant="blue" />
          <TopStatCard icon={BarChart3} title="Spend Amount" amount={data.summary.budget.spent} change={data.summary.budget.spentChange} chartData={data.analytics.monthly} variant="pink" />
        </div>

        <div className="mt-6 grid gap-5">
          {visibleModules.map((module) => (
            <ModuleCard key={module.id} module={module} icon={moduleIcons[module.id]} onOpen={setActiveModal} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_390px]">
          <AnalyticsChart data={data.analytics.monthly} range={data.analytics.range} />
          <RecentActivity activities={data.activities.items} />
        </div>
      </section>

      <ModalShell open={Boolean(activeModal)} title={modalTitle} icon={moduleIcons[activeModal]} color={modalColor[activeModal]} glow={modalGlow[activeModal]} onClose={() => setActiveModal(null)}>
        {activeModal === "advertising" ? <AdvertisingModal data={data.advertising} /> : null}
        {activeModal === "creators" ? <CreatorsModal data={data.creators} /> : null}
        {activeModal === "heavyads" ? <HeavyAdsModal data={data.heavyads} /> : null}
        {activeModal === "documents" ? <DocumentsModal data={data.documents} /> : null}
      </ModalShell>
    </main>
  );
}
