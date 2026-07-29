"use client";

import { useState, useEffect, useMemo } from "react";
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
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/digitaldashboard/Navbar";
import MetricCard from "@/components/digitaldashboard/MetricCard";
import FeatureCard from "@/components/digitaldashboard/FeatureCard";
import AssignedProjectsTable from "@/components/digitaldashboard/AssignedProjectsTable";
import { TrendLineChart } from "@/components/digitaldashboard/Charts";
import FilterDropdown from "@/components/digitaldashboard/ui/FilterDropdown";
import CallingWorkspace from "@/components/digitaldashboard/crm/CallingWorkspace";
import ActivityHistoryModal from "@/components/digitaldashboard/modals/ActivityHistoryModal";
import {
  NewLeadModal,
  AdvertisingModal,
  CreatorsModal,
  HeavyAdsModal,
  InvoicesModal,
} from "@/components/digitaldashboard/modals";
import { statusColors } from "@/components/digitaldashboard/data/mockData";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/digitaldashboard/context/ThemeContext";

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
  const [showCallingWorkspace, setShowCallingWorkspace] = useState(false);
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState("");
  const [chartFilter, setChartFilter] = useState("This Year");

  // Fetch all projects from database
  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      const token = localStorage.getItem("token");
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

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
        // Verify token/me
        if (token) {
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
        }

        // Fetch projects
        const projRes = await fetch(`${apiUrl}/api/projects`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (projRes.ok) {
          const data = await projRes.json();
          // Map backend projects to dashboard-expected format
          const mapped = data.map((p) => {
            const rawBdg = parseInt((p.budget || "0").replace(/\D/g, ""), 10) || 0;
            return {
              id: p.id || p._id,
              client: p.client,
              projectType: p.name,
              assignedBy: p.manager || "Unassigned",
              status: p.status || "Active",
              budget: rawBdg,
              deadline: p.deadline ? new Date(p.deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }) : "31 Jul 2026",
              files: p.files || []
            };
          });
          const filtered = mapped.filter(
            (p) => !(p.client === "NovaNectar Pvt Ltd" && p.projectType === "Enterprise Resource Planner")
          );
          setProjects(filtered);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndProjects();
  }, [clientProject]);

  // Compute companies dynamically
  const projectCompanies = useMemo(() => {
    if (projects.length === 0) return [];
    const clientMap = new Map();
    projects.forEach((p) => {
      if (!clientMap.has(p.client)) {
        clientMap.set(p.client, {
          id: p.client.toLowerCase().replace(/\s+/g, "-"),
          name: p.client,
          revenue: 0,
          spent: 0,
          roi: 2.1,
          campaigns: 0,
        });
      }
      const entry = clientMap.get(p.client);
      entry.revenue += p.budget;
      entry.spent += Math.round(p.budget * 0.5);
      entry.campaigns += 1;
    });
    return Array.from(clientMap.values());
  }, [projects]);

  // Set default companyId
  useEffect(() => {
    if (projectCompanies.length > 0 && !companyId) {
      if (clientProject) {
        const matched = projectCompanies.find((c) => c.name === clientProject.client);
        setCompanyId(matched ? matched.id : projectCompanies[0].id);
      } else {
        setCompanyId(projectCompanies[0].id);
      }
    }
  }, [projectCompanies, clientProject, companyId]);

  const company = useMemo(() => {
    return projectCompanies.find((c) => c.id === companyId) || projectCompanies[0] || {
      id: "loading",
      name: "No Companies",
      revenue: 0,
      spent: 0,
      roi: 0,
      campaigns: 0
    };
  }, [projectCompanies, companyId]);

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

  // Compute metrics dynamically
  const displayMetrics = useMemo(() => {
    if (clientProject) {
      const rawBudget = typeof clientProject.budget === "number"
        ? clientProject.budget
        : (parseInt((clientProject.budget || "0").replace(/\D/g, ""), 10) || 0);
      return {
        allocatedBudget: { value: "₹" + rawBudget.toLocaleString("en-IN"), growth: "+0%" },
        spendAmount: { value: "₹" + Math.round(rawBudget * 0.5).toLocaleString("en-IN"), growth: "+0%" }
      };
    }
    const totalAllocated = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.budget * 0.5, 0);
    return {
      allocatedBudget: { value: "₹" + totalAllocated.toLocaleString("en-IN"), growth: "+14.6%" },
      spendAmount: { value: "₹" + totalSpent.toLocaleString("en-IN"), growth: "+8.5%" }
    };
  }, [projects, clientProject]);

  // Compute feature stats dynamically
  const featureStats = useMemo(() => {
    if (clientProject) {
      const rawBudget = typeof clientProject.budget === "number"
        ? clientProject.budget
        : (parseInt((clientProject.budget || "0").replace(/\D/g, ""), 10) || 0);
      return {
        advertising: "₹" + Math.round(rawBudget * 0.5).toLocaleString("en-IN"),
        creators: "₹" + Math.round(rawBudget * 0.15).toLocaleString("en-IN"),
        heavyAds: "₹" + Math.round(rawBudget * 0.35).toLocaleString("en-IN"),
        documents: `${clientProject.files?.length || 0} Files`
      };
    }
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalFiles = projects.reduce((sum, p) => sum + (p.files?.length || 0), 0);
    return {
      advertising: "₹" + Math.round(totalBudget * 0.5).toLocaleString("en-IN"),
      creators: "₹" + Math.round(totalBudget * 0.15).toLocaleString("en-IN"),
      heavyAds: "₹" + Math.round(totalBudget * 0.35).toLocaleString("en-IN"),
      documents: `${totalFiles} Files`
    };
  }, [projects, clientProject]);

  // Spend trend chart data
  const spendTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    months.forEach((m) => { monthlyMap[m] = 0; });

    if (projects.length === 0) {
      return [
        { month: "Jan", value: 120000 },
        { month: "Feb", value: 145000 },
        { month: "Mar", value: 132000 },
        { month: "Apr", value: 168000 },
        { month: "May", value: 190000 },
        { month: "Jun", value: 210000 },
        { month: "Jul", value: 225000 }
      ];
    }

    projects.forEach((p) => {
      const parts = p.deadline ? p.deadline.split(" ") : [];
      const monthStr = parts[1];
      if (months.includes(monthStr)) {
        monthlyMap[monthStr] += Math.round(p.budget * 0.5);
      }
    });

    return months.map((m) => ({
      month: m,
      value: monthlyMap[m] || Math.round(projects.reduce((sum, p) => sum + p.budget, 0) / 12)
    }));
  }, [projects]);

  // Recent activity list
  const dynamicActivities = useMemo(() => {
    if (projects.length === 0) {
      return [
        { id: 1, title: "No campaigns registered yet", detail: "Active projects list is empty", time: "Just now", type: "advertising" }
      ];
    }
    return projects.slice(0, 4).map((p, index) => {
      const types = ["advertising", "creators", "heavyAds", "invoices"];
      const type = types[index % types.length];
      const title = type === "advertising" ? `${p.projectType} campaign launched`
        : type === "creators" ? `New creator partnership for ${p.client}`
        : type === "heavyAds" ? `Offline marketing scheduled for ${p.client}`
        : `New invoices and contracts uploaded`;
      const detail = type === "advertising" ? "Digital Marketing Campaign"
        : type === "creators" ? "Collaboration - Revenue Share Model"
        : type === "heavyAds" ? `${p.client} - Outdoor Advertising`
        : `Invoice files attached to project`;
      return {
        id: p.id,
        title,
        detail,
        time: `${index + 1}d ago`,
        type
      };
    });
  }, [projects]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="text-sm font-medium">Loading Digital Marketing Dashboard...</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#FAF7FF] text-gray-900 dark:bg-[#050816] dark:text-white">
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
            <div className="flex items-center gap-3">

  <button
    onClick={() => setModal("newLead")}
    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-500/20"
  >
    <Plus size={16} />
    New Lead
  </button>

  <button
    onClick={() => setShowCallingWorkspace(true)}
    className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 cursor-pointer shadow-md shadow-violet-500/20"
  >
    <PhoneCall size={16} />
    Calling
  </button>

</div>
          </div>
        </div>

        {/* Top metric cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard
            label="Total Allocated Budget"
            value={displayMetrics.allocatedBudget.value}
            growth={displayMetrics.allocatedBudget.growth}
            chartType="line"
            chartData={[8, 10, 9, 12, 11, 14, 16]}
            color="#3B82F6"
            accentFrom="#3B82F6"
            accentTo="#6366F1"
            icon={<Wallet size={20} />}
          />
          <MetricCard
            label="Spend Amount"
            value={displayMetrics.spendAmount.value}
            growth={displayMetrics.spendAmount.growth}
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
              {projectCompanies.length > 0 ? (
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  disabled={!!clientProject}
                  className={`mt-3 w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200 ${
                    clientProject ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {projectCompanies.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-white text-gray-900"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">No active companies.</p>
              )}
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
            stat={featureStats.advertising}
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
            stat={featureStats.creators}
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
            stat={featureStats.heavyAds}
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
            stat={featureStats.documents}
            disabled={invoicesAccess.disabled}
            readOnly={invoicesAccess.readOnly}
            onOpen={invoicesAccess.disabled ? undefined : () => setModal("invoices")}
          />
        </div>

        {!clientProject && (
          <div className="mb-6">
            <AssignedProjectsTable projects={projects} />
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
              <TrendLineChart data={spendTrend} color="#8B5CF6" />
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
              {dynamicActivities.map((a) => {
                const Icon = activityIcon[a.type] || Megaphone;
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

      {showCallingWorkspace && (
  <CallingWorkspace
    open={showCallingWorkspace}
    onClose={() => setShowCallingWorkspace(false)}
  />
)}

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
  );
}
