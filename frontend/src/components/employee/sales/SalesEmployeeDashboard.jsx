"use client";

import { useState, useEffect } from "react";
import SalesEmployeeNavbar from "./SalesEmployeeNavbar";
import SalesEmployeeTabs from "./SalesEmployeeTabs";
import SalesEmployeeStatsCards from "./SalesEmployeeStatsCards";
import SalesEmployeeMonthlyAccordion from "./SalesEmployeeMonthlyAccordion";
import ContactCallingWorkspace from "./ContactCallingWorkspace";

import NewLeadModal from "./NewLeadModal";
import { api } from "@/lib/api";
import { Target, IndianRupee, TrendingUp, PhoneCall } from "lucide-react";

import { employeeInfo, tabs } from "./salesEmployeeData";

export default function SalesEmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("Client Projects");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isContactCallingOpen, setIsContactCallingOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: employeeInfo.name,
    initials: employeeInfo.initials,
    role: employeeInfo.role,
    id: employeeInfo.id,
    status: employeeInfo.status,
    month: employeeInfo.month,
  });

  const [stats, setStats] = useState({
    "Client Projects": [
      {
        title: "Total Active Leads",
        value: "0",
        change: "0%",
        subtitle: "No active leads",
        icon: Target,
        color: "rose",
      },
      {
        title: "Revenue Pipeline",
        value: "₹0",
        change: "0%",
        subtitle: "No revenue pipeline",
        icon: IndianRupee,
        color: "purple",
      },
      {
        title: "Conversion Rate",
        value: "0%",
        change: "0%",
        subtitle: "No conversions yet",
        icon: TrendingUp,
        color: "red",
      },
    ],

    Internships: [
      {
        title: "Total Candidates Brought",
        value: "0",
        change: "0",
        subtitle: "No candidates",
        icon: Target,
        color: "cyan",
      },
      {
        title: "Total Fee Collected",
        value: "₹0",
        change: "0%",
        subtitle: "No fees collected",
        icon: IndianRupee,
        color: "blue",
      },
      {
        title: "Placement Rate",
        value: "0%",
        change: "0%",
        subtitle: "No placements",
        icon: TrendingUp,
        color: "indigo",
      },
    ],

    Training: [
      {
        title: "Total Trainings Brought",
        value: "0",
        change: "0",
        subtitle: "No trainings",
        icon: Target,
        color: "amber",
      },
      {
        title: "Training Revenue",
        value: "₹0",
        change: "0%",
        subtitle: "No training revenue",
        icon: IndianRupee,
        color: "orange",
      },
      {
        title: "Completion Rate",
        value: "0%",
        change: "0%",
        subtitle: "No completions yet",
        icon: TrendingUp,
        color: "emerald",
      },
    ],
  });

  const [monthlyRecords, setMonthlyRecords] = useState({
    "Client Projects": [],
    Internships: [],
    Training: [],
  });

  const fetchData = async (currentAgentName) => {
    try {
      const agentName =
        currentAgentName || localStorage.getItem("userName") || userInfo.name;

      if (!agentName) return;

      const [projectsRes, internshipsRes, trainingRes] = await Promise.all([
        api.get("/api/projects"),
        api.get("/api/internships/candidates"),
        api.get("/api/training/candidates"),
      ]);

      const projects = (projectsRes.data || []).filter(
        (p) =>
          String(p.manager).trim().toLowerCase() ===
          agentName.trim().toLowerCase()
      );

      const internships = (internshipsRes.data || []).filter(
        (i) =>
          String(i.salesAgent).trim().toLowerCase() ===
          agentName.trim().toLowerCase()
      );

      const trainings = (trainingRes.data || []).filter(
        (t) =>
          String(t.salesAgent).trim().toLowerCase() ===
          agentName.trim().toLowerCase()
      );

      const parseCurrency = (val) => {
        if (!val) return 0;

        const str = String(val).replace(/[^0-9.]/g, "");
        const parsed = parseFloat(str);

        return isNaN(parsed) ? 0 : parsed;
      };

      const formatCurrency = (amount) => {
        return "₹" + amount.toLocaleString("en-IN");
      };

      const totalProjects = projects.length;

      const approvedProjects = projects.filter(
        (p) =>
          String(p.approvalStatus || p.approval || "")
            .trim()
            .toLowerCase() === "approved"
      ).length;

      const projectRevenue = projects.reduce(
        (sum, p) => sum + parseCurrency(p.budget),
        0
      );

      const conversionRate =
        totalProjects > 0
          ? Math.round((approvedProjects / totalProjects) * 100)
          : 0;

      const totalInterns = internships.length;

      const activeInternsFee = internships
        .filter((i) => String(i.status).trim().toLowerCase() !== "dropped out")
        .reduce((sum, i) => sum + parseCurrency(i.cost), 0);

      const placedInterns = internships.filter(
        (i) => String(i.placement || "").trim().toLowerCase() === "placed"
      ).length;

      const placementRate =
        totalInterns > 0 ? Math.round((placedInterns / totalInterns) * 100) : 0;

      const totalTrainings = trainings.length;

      const trainingRevenue = trainings.reduce(
        (sum, t) => sum + parseCurrency(t.cost),
        0
      );

      const avgTrainingProgress =
        totalTrainings > 0
          ? Math.round(
              trainings.reduce((sum, t) => sum + (t.progress || 0), 0) /
                totalTrainings
            )
          : 0;

      setStats({
        "Client Projects": [
          {
            title: "Total Active Leads",
            value: String(totalProjects),
            change: totalProjects > 0 ? "+100%" : "0%",
            subtitle:
              totalProjects > 0
                ? `${totalProjects} projects recorded`
                : "No projects recorded",
            icon: Target,
            color: "rose",
          },
          {
            title: "Revenue Pipeline",
            value: formatCurrency(projectRevenue),
            change: projectRevenue > 0 ? "+100%" : "0%",
            subtitle:
              projectRevenue > 0
                ? "Total estimated revenue"
                : "No revenue pipeline",
            icon: IndianRupee,
            color: "purple",
          },
          {
            title: "Conversion Rate",
            value: `${conversionRate}%`,
            change: `${conversionRate}%`,
            subtitle: `${approvedProjects} out of ${totalProjects} approved`,
            icon: TrendingUp,
            color: "red",
          },
        ],

        Internships: [
          {
            title: "Total Candidates Brought",
            value: String(totalInterns),
            change: String(totalInterns),
            subtitle:
              totalInterns > 0
                ? `${totalInterns} candidates registered`
                : "No candidates recorded",
            icon: Target,
            color: "cyan",
          },
          {
            title: "Total Fee Collected",
            value: formatCurrency(activeInternsFee),
            change: activeInternsFee > 0 ? "+100%" : "0%",
            subtitle:
              activeInternsFee > 0 ? "Fee from active interns" : "No fees collected",
            icon: IndianRupee,
            color: "blue",
          },
          {
            title: "Placement Rate",
            value: `${placementRate}%`,
            change: `${placementRate}%`,
            subtitle: `${placedInterns} out of ${totalInterns} placed`,
            icon: TrendingUp,
            color: "indigo",
          },
        ],

        Training: [
          {
            title: "Total Trainings Brought",
            value: String(totalTrainings),
            change: String(totalTrainings),
            subtitle:
              totalTrainings > 0
                ? `${totalTrainings} training leads`
                : "No training recorded",
            icon: Target,
            color: "amber",
          },
          {
            title: "Training Revenue",
            value: formatCurrency(trainingRevenue),
            change: trainingRevenue > 0 ? "+100%" : "0%",
            subtitle:
              trainingRevenue > 0
                ? "Sum of all training costs"
                : "No training revenue",
            icon: IndianRupee,
            color: "orange",
          },
          {
            title: "Completion Rate",
            value: `${avgTrainingProgress}%`,
            change: `${avgTrainingProgress}%`,
            subtitle: "Average student progress",
            icon: TrendingUp,
            color: "emerald",
          },
        ],
      });

      const groupRecordsByMonth = (records, type) => {
        const monthsMap = {};

        records.forEach((rec) => {
          const dateVal =
            rec.createdAt ||
            rec.startDate ||
            rec.agreementDate ||
            rec.submitted ||
            new Date();

          const date = new Date(dateVal);
          const monthName = date.toLocaleString("en-US", { month: "long" });
          const year = date.getFullYear();
          const key = `${monthName} ${year}`;

          if (!monthsMap[key]) {
            monthsMap[key] = [];
          }

          const adapted = {
            ...rec,
            approvalStatus: rec.approvalStatus || "Approved",
            approval: rec.approval || "Approved",
          };

          if (type === "Internships") {
            adapted.candidateName = rec.name;
            adapted.program = rec.courseName;
            adapted.courseCost = rec.cost;
            adapted.internStatus = rec.status || "Active";
          } else if (type === "Training") {
            adapted.trainingProgram = rec.courseName;
            adapted.candidateName = rec.name;
            adapted.trainingFee = rec.cost;
            adapted.totalEnrolled = 1;
            adapted.instructor = "Enterprise Mentor";
            adapted.startDate = rec.startDate
              ? new Date(rec.startDate).toLocaleDateString()
              : "N/A";
            adapted.submittedDate = rec.createdAt
              ? new Date(rec.createdAt).toLocaleDateString()
              : "N/A";
          }

          monthsMap[key].push(adapted);
        });

        const sortedKeys = Object.keys(monthsMap).sort((a, b) => {
          return new Date(b) - new Date(a);
        });

        const currentMonthStr =
          new Date().toLocaleString("en-US", { month: "long" }) +
          " " +
          new Date().getFullYear();

        return sortedKeys.map((key) => ({
          month: key,
          badge: key === currentMonthStr ? "Current" : "Previous",
          records: monthsMap[key],
        }));
      };

      setMonthlyRecords({
        "Client Projects": groupRecordsByMonth(projects, "Client Projects"),
        Internships: groupRecordsByMonth(internships, "Internships"),
        Training: groupRecordsByMonth(trainings, "Training"),
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedDept = (
      localStorage.getItem("userDepartment") || ""
    ).toLowerCase();

    const storedName = (localStorage.getItem("userName") || "").toLowerCase();

    if (storedRole && storedRole !== "employee") {
      window.location.href = "/";
      return;
    }

    if (storedRole === "employee") {
      const isSales =
        storedDept.includes("sales") || storedName.includes("sales");

      if (!isSales) {
        if (storedDept.includes("digital") || storedName.includes("digital")) {
          window.location.href = "/employee/digitaldashboard";
        } else {
          window.location.href = "/login";
        }

        return;
      }
    }

    const getInitials = (name) => {
      if (!name) return "RS";

      const parts = name.trim().split(" ");

      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }

      return parts[0].slice(0, 2).toUpperCase();
    };

    const storedNameVal = localStorage.getItem("userName");
    const storedDesignation = localStorage.getItem("userDesignation");
    const storedId = localStorage.getItem("userEmployeeCode");
    const storedStatus = localStorage.getItem("userStatus");
    const storedJoining = localStorage.getItem("userJoiningDate");

    let activeName = storedNameVal || employeeInfo.name;

    if (storedNameVal || storedDesignation || storedId) {
      setUserInfo({
        name: storedNameVal || employeeInfo.name,
        initials: getInitials(storedNameVal || employeeInfo.name),
        role: storedDesignation || employeeInfo.role,
        id: storedId || employeeInfo.id,
        status: storedStatus || employeeInfo.status,
        month: storedJoining || employeeInfo.month,
      });
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        fetchData(activeName);
        return;
      }

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          if (data?.user) {
            const uName = data.user.name || storedNameVal || employeeInfo.name;

            const uDesig =
              data.user.designation || storedDesignation || employeeInfo.role;

            const uId = data.user.employeeCode || storedId || employeeInfo.id;

            const uStatus =
              data.user.status || storedStatus || employeeInfo.status;

            const uJoining =
              data.user.joiningDate || storedJoining || employeeInfo.month;

            const uDept = (data.user.department || "").toLowerCase();

            if (data.user.role && data.user.role !== "employee") {
              window.location.href = "/";
              return;
            }

            if (data.user.role === "employee") {
              const isSales =
                uDept.includes("sales") || uName.toLowerCase().includes("sales");

              if (!isSales) {
                if (
                  uDept.includes("digital") ||
                  uName.toLowerCase().includes("digital")
                ) {
                  window.location.href = "/employee/digitaldashboard";
                } else {
                  window.location.href = "/login";
                }

                return;
              }
            }

            setUserInfo({
              name: uName,
              initials: getInitials(uName),
              role: uDesig,
              id: uId,
              status: uStatus,
              month: uJoining,
            });

            localStorage.setItem("userName", uName);
            localStorage.setItem("userDesignation", uDesig);
            localStorage.setItem("userEmployeeCode", uId);
            localStorage.setItem("userStatus", uStatus);
            localStorage.setItem("userJoiningDate", uJoining);

            fetchData(uName);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      fetchData(activeName);
    };

    fetchUserData();

    const handleLeadCreated = () => {
      fetchData();
    };

    window.addEventListener("leadCreated", handleLeadCreated);

    return () => {
      window.removeEventListener("leadCreated", handleLeadCreated);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full relative overflow-hidden">
      <div className="flex flex-col w-full min-h-screen z-10">
        <SalesEmployeeNavbar />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {isContactCallingOpen ? (
            <ContactCallingWorkspace
              onBack={() => setIsContactCallingOpen(false)}
              onNewLead={() => setIsNewLeadOpen(true)}
            />
          ) : (
            <div className="px-6 py-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Sales Employee Dashboard
                  </h1>

                  <p className="text-muted-foreground mt-2">
                    Monitor your leads, revenue, and personal sales performance.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsContactCallingOpen(true)}
                    title="Open Contact Calling Workspace"
                    className="
                      h-12 w-12
                      rounded-xl
                      border border-violet-200
                      bg-white
                      text-primary
                      shadow-lg shadow-primary/10
                      hover:scale-105
                      hover:bg-violet-50
                      hover:shadow-primary/20
                      transition
                      flex items-center justify-center

                      dark:border-primary/30
                      dark:bg-primary/10
                      dark:text-primary
                      dark:shadow-primary/20
                      dark:hover:bg-primary/20
                    "
                  >
                    <PhoneCall size={20} />
                  </button>

                  <button
                    onClick={() => setIsNewLeadOpen(true)}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition"
                  >
                    + New Lead
                  </button>
                </div>
              </div>

              {/* Employee Profile Card */}
              <div className="glass-card w-full max-w-lg rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
                    {userInfo.initials}
                  </div>

                  <div>
                    <h2 className="font-bold text-foreground">
                      {userInfo.name}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {userInfo.role} · {userInfo.id}
                    </p>
                  </div>

                  <div className="ml-auto px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                    {userInfo.status} · {userInfo.month}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <SalesEmployeeTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {/* KPI Cards */}
              <SalesEmployeeStatsCards stats={stats[activeTab]} />

              {/* Month-wise Table */}
              <SalesEmployeeMonthlyAccordion
                activeTab={activeTab}
                data={monthlyRecords[activeTab]}
              />
            </div>
          )}
        </main>
      </div>

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}