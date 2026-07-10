"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  Wallet,
  BarChart3,
  Megaphone,
  Users,
  Tv,
  FolderOpen,
  Activity,
  LineChart,
} from "lucide-react";
import Navbar from "@/components/digitaldashboard/Navbar";
import MetricCard from "@/components/digitaldashboard/MetricCard";
import FeatureCard from "@/components/digitaldashboard/FeatureCard";
import AssignedProjectsTable from "@/components/digitaldashboard/AssignedProjectsTable";
import { TrendLineChart } from "@/components/digitaldashboard/Charts";
import FilterDropdown from "@/components/digitaldashboard/ui/FilterDropdown";
import ActivityHistoryModal from "@/components/digitaldashboard/modals/ActivityHistoryModal";
import {
  NewLeadModal,
  AdvertisingModal,
  CreatorsModal,
  HeavyAdsModal,
  InvoicesModal,
} from "@/components/digitaldashboard/modals";
import {
  metrics,
  companies,
  assignedProjects,
  monthlySpend,
  recentActivity,
} from "@/components/digitaldashboard/data/mockData";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/digitaldashboard/context/ThemeContext";

const projectCompanies = [
  ...new Map(
    assignedProjects.map((project) => [
      project.client,
      {
        id: project.client,
        name: project.client,
      },
    ])
  ).values(),
];

const activityIcon = {
  advertising: Megaphone,
  creators: Users,
  heavyAds: Tv,
  invoices: FolderOpen,
};

const MODULE_FOR_CARD = {
  advertising: "Advertising",
  creators: "Creators",
  heavyAds: "Heavy Ads",
};

export default function DigitalDashboardPage({ clientProject = null }) {
  const [modal, setModal] = useState(null);
  const router = useRouter();

  const [companyId, setCompanyId] = useState(() => {
    if (clientProject) {
      const matched = companies.find((c) => c.name === clientProject.client);
      return matched ? matched.id : companies[0].id;
    }
    return companies[0].id;
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedDept = (localStorage.getItem("userDepartment") || "").toLowerCase();
    const storedName = (localStorage.getItem("userName") || "").toLowerCase();

    if (storedRole && storedRole !== "employee") {
      window.location.href = "/";
      return;
    }

    if (storedRole === "employee") {
      const isDigital = storedDept.includes("digital") || storedName.includes("digital");
      if (!isDigital) {
        if (storedDept.includes("sales") || storedName.includes("sales")) {
          window.location.href = "/employee/sales";
        } else {
          window.location.href = "/login";
        }
        return;
      }
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            const uDept = (data.user.department || "").toLowerCase();
            const uName = (data.user.name || "").toLowerCase();
            if (data.user.role && data.user.role !== "employee") {
              window.location.href = "/";
              return;
            }
            if (data.user.role === "employee") {
              const isDigital = uDept.includes("digital") || uName.includes("digital");
              if (!isDigital) {
                if (uDept.includes("sales") || uName.includes("sales")) {
                  window.location.href = "/employee/sales";
                } else {
                  window.location.href = "/login";
                }
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();

    if (clientProject) {
      const matched = companies.find((c) => c.name === clientProject.client);
      if (matched) setCompanyId(matched.id);
    }
  }, [clientProject]);

  const company = companies.find((c) => c.id === companyId) || companies[0];

  const close = () => setModal(null);

  const getFeatureAccess = (cardKey) => {
    if (!clientProject) return { disabled: false, readOnly: false };
    if (cardKey === "invoices") return { disabled: false, readOnly: false };
    const isActiveModule = clientProject.module === MODULE_FOR_CARD[cardKey];
    return { disabled: !isActiveModule, readOnly: !isActiveModule };
  };

  const advertisingAccess = getFeatureAccess("advertising");
  const creatorsAccess = getFeatureAccess("creators");
  const heavyAdsAccess = getFeatureAccess("heavyAds");
  const invoicesAccess = getFeatureAccess("invoices");

  const dashboardTitle = clientProject
    ? `${clientProject.client} Dashboard`
    : "Digital Marketing Dashboard";

  const dashboardSubtitle = clientProject
    ? `${clientProject.projectType} Management Dashboard`
    : "Track, manage and optimize all campaigns, creator spend, heavy ads, and media documents in one place.";

  const [timeFilter, setTimeFilter] = useState("This Month");
  const [chartFilter, setChartFilter] = useState("This Year");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#050816] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {clientProject && (
              <button
                onClick={() => router.push("/employee/digitaldashboard")}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 cursor-pointer"
              >
                ← Back to Dashboard
              </button>
            )}

            <h1 className="text-2xl font-bold sm:text-3xl">
              {dashboardTitle}
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              {dashboardSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <FilterDropdown
                value={chartFilter}
                onChange={setChartFilter}
              />
            </div>
            <button
              onClick={() => setModal("newLead")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus size={16} /> New Lead
            </button>
          </div>
        </div>

        {/* Top metric cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard
            label="Total Allocated Budget"
            value={metrics.allocatedBudget.value}
            growth={metrics.allocatedBudget.growth}
            chartType="line"
            chartData={[8, 10, 9, 12, 11, 14, 16]}
            color="#3B82F6"
            accentFrom="#3B82F6"
            accentTo="#6366F1"
            icon={<Wallet size={20} />}
          />
          <MetricCard
            label="Spend Amount"
            value={metrics.spendAmount.value}
            growth={metrics.spendAmount.growth}
            chartType="bar"
            chartData={[4, 5, 4, 6, 7, 6, 8]}
            color="#EC4899"
            accentFrom="#EC4899"
            accentTo="#F97316"
            icon={<BarChart3 size={20} />}
          />
        </div>

        {/* Company revenue filter */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0B1224]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-base font-semibold">Company Revenue Filter</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {clientProject
                  ? `Showing revenue and performance details for ${company.name}`
                  : "Select a company to view revenue and performance details"}
              </p>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                disabled={!!clientProject}
                className={`mt-3 w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200 ${
                  clientProject ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {companies.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="bg-white text-gray-900"
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Revenue Generated</p>
                <p className="mt-1 text-lg font-bold text-emerald-500">₹{company.revenue.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Total Spent</p>
                <p className="mt-1 text-lg font-bold">₹{company.spent.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">ROI</p>
                <p className="mt-1 text-lg font-bold text-blue-500">{company.roi}x</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Active Campaigns</p>
                <p className="mt-1 text-lg font-bold">{company.campaigns}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 feature cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Megaphone size={20} />}
            iconBg="bg-blue-500"
            title="Advertising"
            description="Google, Meta, LinkedIn & Twitter ad performance."
            statLabel="Total Spend"
            stat="₹1,25,000"
            disabled={advertisingAccess.disabled}
            readOnly={advertisingAccess.readOnly}
            onOpen={advertisingAccess.disabled ? undefined : () => setModal("advertising")}
          />
          <FeatureCard
            icon={<Users size={20} />}
            iconBg="bg-purple-500"
            title="Creators"
            description="One-time and partnership creator collaborations."
            statLabel="Total Paid"
            stat="₹48,000"
            disabled={creatorsAccess.disabled}
            readOnly={creatorsAccess.readOnly}
            onOpen={creatorsAccess.disabled ? undefined : () => setModal("creators")}
          />
          <FeatureCard
            icon={<Tv size={20} />}
            iconBg="bg-orange-500"
            title="Heavy Ads"
            description="Billboards, sponsorships and offline campaigns."
            statLabel="Total Spend"
            stat="₹2,10,000"
            disabled={heavyAdsAccess.disabled}
            readOnly={heavyAdsAccess.readOnly}
            onOpen={heavyAdsAccess.disabled ? undefined : () => setModal("heavyAds")}
          />
          <FeatureCard
            icon={<FolderOpen size={20} />}
            iconBg="bg-teal-500"
            title="Invoices & Documents"
            description="Contracts, invoices and partnership agreements."
            statLabel="Documents"
            stat="28 Files"
            disabled={invoicesAccess.disabled}
            readOnly={invoicesAccess.readOnly}
            onOpen={invoicesAccess.disabled ? undefined : () => setModal("invoices")}
          />
        </div>

        {!clientProject && (
          <div className="mb-6">
            <AssignedProjectsTable />
          </div>
        )}

        {/* Bottom section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:col-span-2 dark:border-white/10 dark:bg-[#0B1224]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 dark:text-violet-400">
                  <LineChart size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Monthly Marketing Spend Trend</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Track your marketing spend over the months</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
                This Year <ChevronDown size={14} />
              </button>
            </div>
            <div className="h-56">
              <TrendLineChart data={monthlySpend} color="#8B5CF6" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0B1224]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500 dark:text-blue-400">
                <Activity size={18} />
              </div>
              <h3 className="text-base font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((a) => {
                const Icon = activityIcon[a.type];
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{a.detail}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">{a.time}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setModal("activity")}
              className="mt-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              View All Activity
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <NewLeadModal open={modal === "newLead"} onClose={close} />
      <AdvertisingModal open={modal === "advertising"} onClose={close} project={clientProject} />
      <CreatorsModal open={modal === "creators"} onClose={close} project={clientProject} />
      <HeavyAdsModal open={modal === "heavyAds"} onClose={close} project={clientProject} />
      <InvoicesModal open={modal === "invoices"} onClose={close} project={clientProject} />
      <ActivityHistoryModal
        open={modal === "activity"}
        onClose={close}
      />
      </div>
    </ThemeProvider>
  );
}
