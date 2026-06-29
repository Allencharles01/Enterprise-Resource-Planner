"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Filter,
  Megaphone,
  MonitorPlay,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import TopStatCard from "@/components/digital-marketing/TopStatCard";
import AnalyticsCard from "@/components/digital-marketing/AnalyticsCard";
import ModuleCard from "@/components/digital-marketing/ModuleCard";
import RecentActivity from "@/components/digital-marketing/RecentActivity";
import ModalShell from "@/components/digital-marketing/ModalShell";
import {
  activitiesJson,
  advertisingJson,
  analyticsJson,
  compact,
  creatorsJson,
  documentsJson,
  heavyadsJson,
  inr,
  summaryJson,
} from "@/components/digital-marketing/digitalMarketingData";

const moduleIcons = {
  advertising: Megaphone,
  creators: Users,
  heavyads: MonitorPlay,
  documents: FileText,
};

const modalGlow = {
  advertising: "glow-blue",
  creators: "glow-purple",
  heavyads: "glow-orange",
  documents: "glow-cyan",
};

const modalColor = {
  advertising: "#3b82f6",
  creators: "#a855f7",
  heavyads: "#f97316",
  documents: "#22d3ee",
};

function Status({ value }) {
  const isPos = value === "Active" || value === "Approved";
  const isWarn = value === "Paused" || value === "Pending";
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
        isPos
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
          : isWarn
          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
          : "border-border text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}

function StatStrip({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[16px] border border-border p-4 bg-muted/30"
        >
          <p className="text-[12px] font-medium text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-[22px] font-bold text-foreground">
            {typeof stat.value === "number"
              ? stat.value > 999
                ? inr(stat.value)
                : compact(stat.value)
              : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <button
        className="rounded-[10px] border border-border px-3 py-1.5 text-[12px] hover:bg-muted transition text-foreground cursor-pointer"
        type="button"
      >
        Edit
      </button>
      <button
        className="rounded-[10px] bg-indigo-500 hover:bg-indigo-600 transition px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer shadow-sm shadow-indigo-500/30"
        type="button"
      >
        View
      </button>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-[16px] border border-border">
      <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row, index) => (
            <tr
              key={`${row.platform || row.campaignName || row.creator || row.documentName}-${index}`}
              className="hover:bg-muted/20 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-foreground font-medium">
                  {column.key === "actions" ? (
                    <ActionButtons />
                  ) : column.money ? (
                    <span className="font-mono text-emerald-500 font-bold">{inr(row[column.key])}</span>
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
  const rows =
    filter === "All Platforms"
      ? data.rows
      : data.rows.filter((row) => row.platform === filter);

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {data.filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition cursor-pointer ${
                filter === item
                  ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "border-border hover:bg-muted text-foreground"
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <input className="bg-muted/40 border border-border rounded-xl px-3 h-10 text-sm outline-none focus:border-indigo-500 text-foreground" type="date" />
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
          { key: "actions", label: "Actions" },
        ]}
      />
      <div className="rounded-[16px] border border-border p-5 bg-indigo-500/5">
        <p className="text-[13px] text-muted-foreground uppercase font-bold tracking-wider">
          Best Performing Platform
        </p>
        <h3 className="mt-1 text-[22px] font-bold text-indigo-400">
          {data.bestPlatform.name}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
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
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap gap-2">
        {data.platforms.map((item) => (
          <button
            key={item}
            onClick={() => setPlatform(item)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition cursor-pointer ${
              platform === item
                ? "bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/20"
                : "border-border hover:bg-muted text-foreground"
            }`}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <section>
        <h3 className="mb-3 text-[18px] font-bold text-foreground">One-Time Payment Creators</h3>
        <DataTable rows={data.oneTime} columns={creatorColumns} />
      </section>
      <section>
        <h3 className="mb-3 text-[18px] font-bold text-foreground">Partnership Creators</h3>
        <DataTable rows={data.partnership} columns={creatorColumns} />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {data.bottomStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[16px] border border-border p-5 bg-purple-500/5"
          >
            <p className="text-[13px] text-muted-foreground uppercase font-bold tracking-wider">
              {stat.label}
            </p>
            <p className="mt-1 text-[24px] font-bold text-purple-400">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeavyAdsModal({ data }) {
  const [filter, setFilter] = useState(data.filters[0]);
  const rows = data.rows.filter((row) => row.type === filter || filter === "All");

  return (
    <div className="space-y-5">
      <StatStrip stats={data.stats} />
      <div className="flex flex-wrap gap-2">
        {data.filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition cursor-pointer ${
              filter === item
                ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                : "border-border hover:bg-muted text-foreground"
            }`}
            type="button"
          >
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
          { key: "actions", label: "Actions" },
        ]}
      />
      <div className="rounded-[16px] border border-border p-5 bg-orange-500/5">
        <p className="text-[13px] text-muted-foreground uppercase font-bold tracking-wider">
          Best Performing Campaign
        </p>
        <h3 className="mt-1 text-[22px] font-bold text-orange-400">
          {data.bestCampaign.name}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {data.bestCampaign.description}
        </p>
      </div>
    </div>
  );
}

function DocumentsModal({ data }) {
  const [tab, setTab] = useState(data.tabs[0]);
  const [query, setQuery] = useState("");
  const rows = data.rows.filter(
    (row) =>
      (tab === "All Documents" || row.type === tab) &&
      row.documentName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {data.tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition cursor-pointer ${
              tab === item
                ? "bg-cyan-500 border-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                : "border-border hover:bg-muted text-foreground"
            }`}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_150px_auto]">
        <label className="flex h-11 items-center gap-2 rounded-xl px-3 bg-muted/40 border border-border">
          <Search size={17} className="text-muted-foreground" />
          <input
            className="min-w-0 flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search documents"
          />
        </label>
        <select className="rounded-xl px-3 bg-muted/40 border border-border text-sm text-foreground outline-none">
          {data.types.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="rounded-xl px-3 bg-muted/40 border border-border text-sm text-foreground outline-none">
          {data.statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input className="rounded-xl px-3 bg-muted/40 border border-border text-sm text-foreground outline-none" type="date" />
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition px-4 text-sm font-bold text-slate-950 cursor-pointer shadow-md shadow-cyan-400/20"
          type="button"
        >
          <Filter size={16} /> Filter
        </button>
      </div>
      <div className="overflow-x-auto rounded-[16px] border border-border">
        <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Document Name</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Type</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Related To</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((row) => (
              <tr key={row.documentName} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{row.documentName}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono">{row.relatedTo}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                <td className="px-4 py-3">
                  <Status value={row.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="flex h-8 items-center gap-1 rounded-[10px] border border-border px-3 text-[12px] hover:bg-muted transition text-foreground cursor-pointer"
                      type="button"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="flex h-8 items-center gap-1 rounded-[10px] bg-cyan-400 hover:bg-cyan-300 transition px-3 text-[12px] font-bold text-slate-950 cursor-pointer shadow-sm shadow-cyan-400/20"
                      type="button"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-[16px] border border-border p-5 bg-muted/20 space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-foreground">Storage Allocated</span>
          <span className="text-muted-foreground">{data.storage.label}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${data.storage.used}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DigitalMarketingPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [search, setSearch] = useState("");

  const modalTitle = useMemo(() => {
    if (!activeModal) return "";
    return (
      summaryJson.modules?.find((item) => item.id === activeModal)?.title || ""
    );
  }, [activeModal]);

  const visibleModules = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return summaryJson.modules || [];
    return (summaryJson.modules || []).filter((module) =>
      [
        module.title,
        module.metricLabel,
        module.metricText,
        module.button,
        ...(module.labels || []),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [search]);

  return (
    <DashboardLayout adminName="Allen Charles">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-12"
      >
        <header className="mx-auto max-w-[760px] text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Megaphone size={14} /> Marketing Department
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Digital Marketing Dashboard
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Track, manage and optimize all campaigns, creator spend, heavy ads, and media documents in one place.
          </p>
          <label className="mx-auto mt-6 flex h-12 max-w-[560px] items-center gap-3 rounded-full px-5 transition bg-muted/40 border border-border focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
            <Search size={19} className="text-muted-foreground shrink-0" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search campaigns, creators, invoices..."
            />
          </label>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <TopStatCard
            icon={Wallet}
            title="Total Allocated Budget"
            amount={summaryJson.budget?.totalAllocated || 0}
            change={summaryJson.budget?.allocatedChange || 0}
            chartData={analyticsJson.monthly || []}
            variant="blue"
          />
          <TopStatCard
            icon={BarChart3}
            title="Spend Amount"
            amount={summaryJson.budget?.spent || 0}
            change={summaryJson.budget?.spentChange || 0}
            chartData={analyticsJson.monthly || []}
            variant="pink"
          />
        </div>

        <div className="grid gap-5">
          {visibleModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              icon={moduleIcons[module.id]}
              onOpen={setActiveModal}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <AnalyticsCard
            data={analyticsJson.monthly || []}
            range={analyticsJson.range || "Monthly"}
          />
          <RecentActivity activities={activitiesJson.items || []} />
        </div>
      </motion.div>

      <ModalShell
        open={Boolean(activeModal)}
        title={modalTitle}
        icon={moduleIcons[activeModal]}
        color={modalColor[activeModal]}
        glow={modalGlow[activeModal]}
        onClose={() => setActiveModal(null)}
      >
        {activeModal === "advertising" ? (
          <AdvertisingModal data={advertisingJson} />
        ) : null}
        {activeModal === "creators" ? (
          <CreatorsModal data={creatorsJson} />
        ) : null}
        {activeModal === "heavyads" ? (
          <HeavyAdsModal data={heavyadsJson} />
        ) : null}
        {activeModal === "documents" ? (
          <DocumentsModal data={documentsJson} />
        ) : null}
      </ModalShell>
    </DashboardLayout>
  );
}
