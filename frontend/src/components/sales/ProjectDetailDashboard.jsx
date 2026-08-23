"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  UserRound,
  LayoutDashboard,
  Server,
  Shield,
  Database,
  TestTube,
  Users,
  X,
  ChevronRight,
  CalendarDays,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronDown,
} from "lucide-react";

const formatProjectAmount = (value) => {
  if (value === null || value === undefined || value === "") return "₹0";

  const textValue = String(value).trim();
  const numberMatch = textValue.match(/-?\d[\d,]*(?:\.\d+)?/);

  if (!numberMatch) return textValue;

  const numericValue = Number(numberMatch[0].replace(/,/g, ""));

  if (Number.isNaN(numericValue)) return textValue;

  return `₹${Math.abs(numericValue).toLocaleString("en-IN")}`;
};

const getProjectBudgetValue = (project) => {
  return project?.budget || project?.agreed || 0;
};


const staticTaskGroups = [
  {
    name: "Frontend",
    icon: LayoutDashboard,
    color: "amber",
    count: "4/10",
    progress: 40,
    lead: "Maria Garcia",
    tasks: [
      {
        title: "Create Login Page",
        manager: "Maria Garcia",
        team: 4,
        status: "In Progress",
      },
      {
        title: "Build Dashboard UI",
        manager: "Maria Garcia",
        team: 3,
        status: "In Progress",
      },
      {
        title: "Responsive Layout",
        manager: "John Lee",
        team: 2,
        status: "Completed",
      },
      {
        title: "User Profile UI",
        manager: "Maria Garcia",
        team: 3,
        status: "In Progress",
      },
    ],
  },
  {
    name: "Backend",
    icon: Server,
    color: "cyan",
    count: "3/10",
    progress: 30,
    lead: "Alex Thompson",
    tasks: [
      {
        title: "Database Schema Design",
        manager: "James Wilson",
        team: 3,
        status: "Completed",
      },
      {
        title: "API Development",
        manager: "Alex Thompson",
        team: 3,
        status: "In Progress",
      },
      {
        title: "Authentication Module",
        manager: "Alex Thompson",
        team: 2,
        status: "Completed",
      },
    ],
  },
  {
    name: "Network & Security",
    icon: Shield,
    color: "orange",
    count: "5/7",
    progress: 70,
    lead: "James Wilson",
    tasks: [
      {
        title: "Security Rules Setup",
        manager: "James Wilson",
        team: 2,
        status: "In Progress",
      },
      {
        title: "SSL Configuration",
        manager: "James Wilson",
        team: 2,
        status: "Completed",
      },
    ],
  },
  {
    name: "Database (DBMS)",
    icon: Database,
    color: "violet",
    count: "5/8",
    progress: 62,
    lead: "James Wilson",
    tasks: [
      {
        title: "Design User Schema",
        manager: "Javier Abbas",
        team: 3,
        status: "In Progress",
      },
      {
        title: "Optimize Database Queries",
        manager: "Jasmine Brooks",
        team: 2,
        status: "Completed",
      },
    ],
  },
  {
    name: "Testing & QA",
    icon: TestTube,
    color: "emerald",
    count: "6/8",
    progress: 75,
    lead: "Emily Chen",
    tasks: [
      {
        title: "Testing & QA",
        manager: "Emily Chen",
        team: 2,
        status: "Pending",
      },
      {
        title: "Final QA Report",
        manager: "Emily Chen",
        team: 2,
        status: "Completed",
      },
    ],
  },
];

const staticMilestones = [
  {
    name: "Requirements Gathering",
    date: "Jan 15, 2026",
    status: "Completed",
    completion: 100,
  },
  {
    name: "Design Phase",
    date: "Mar 1, 2026",
    status: "Completed",
    completion: 100,
  },
  {
    name: "Development Phase 1",
    date: "May 15, 2026",
    status: "Completed",
    completion: 100,
  },
  {
    name: "Development Phase 2",
    date: "Jul 1, 2026",
    status: "In Progress",
    completion: 75,
  },
  {
    name: "Testing & UAT",
    date: "Aug 1, 2026",
    status: "Upcoming",
    completion: 0,
  },
  {
    name: "Deployment",
    date: "Aug 15, 2026",
    status: "Upcoming",
    completion: 0,
  },
];

const staticTeamMembers = [
  {
    initials: "AC",
    name: "Allen Charles",
    role: "Project Lead",
    department: "Management",
    tasksDone: 12,
    hours: "148h",
  },
  {
    initials: "EC",
    name: "Ekta Chaudhary",
    role: "Frontend Lead",
    department: "Frontend",
    tasksDone: 18,
    hours: "210h",
  },
  {
    initials: "KM",
    name: "Kanak Mehta",
    role: "UI/UX Designer",
    department: "Frontend",
    tasksDone: 15,
    hours: "176h",
  },
  {
    initials: "LS",
    name: "Liam Smith",
    role: "Backend Developer",
    department: "Backend",
    tasksDone: 20,
    hours: "224h",
  },
  {
    initials: "OJ",
    name: "Oliver Johnson",
    role: "QA Engineer",
    department: "Testing",
    tasksDone: 14,
    hours: "162h",
  },
];

const staticDepartmentManagers = [
  {
    title: "Lead Manager",
    name: "Allen Charles",
    department: "Project Management",
    color: "emerald",
  },
  {
    title: "Frontend Manager",
    name: "Ekta Chaudhary",
    department: "Frontend",
    color: "amber",
  },
  {
    title: "Backend Manager",
    name: "Liam Smith",
    department: "Backend",
    color: "cyan",
  },
  {
    title: "Security Manager",
    name: "Noah Williams",
    department: "Network & Security",
    color: "orange",
  },
  {
    title: "Database Manager",
    name: "Emma Brown",
    department: "Database Management",
    color: "violet",
  },
  {
    title: "QA Manager",
    name: "Oliver Johnson",
    department: "Testing & QA",
    color: "emerald",
  },
];

const staticCurrentTasks = [
  {
    title: "Database Schema Design",
    member: "Emma Brown",
    department: "Database Management",
    status: "Completed",
    priority: "High",
  },
  {
    title: "API Development",
    member: "Liam Smith",
    department: "Backend",
    status: "In Progress",
    priority: "High",
  },
  {
    title: "UI Component Library",
    member: "Ekta Chaudhary",
    department: "Frontend",
    status: "In Progress",
    priority: "Medium",
  },
  {
    title: "Authentication Module",
    member: "Liam Smith",
    department: "Backend",
    status: "Completed",
    priority: "High",
  },
  {
    title: "Testing & QA",
    member: "Oliver Johnson",
    department: "Testing & QA",
    status: "Pending",
    priority: "Medium",
  },
];

export default function ProjectDetailDashboard({ project, onBack }) {
  const { taskGroups, departmentManagers, currentTasks, teamMembers, milestones } = useMemo(() => {
    if (!project || !project.departments || Object.keys(project.departments).length === 0) {
      return {
        taskGroups: staticTaskGroups,
        departmentManagers: staticDepartmentManagers,
        currentTasks: staticCurrentTasks,
        teamMembers: staticTeamMembers,
        milestones: staticMilestones,
      };
    }

    const DEPT_META = {
      frontend: { name: "Frontend", icon: LayoutDashboard, color: "amber", mgrTitle: "Frontend Manager" },
      backend: { name: "Backend", icon: Server, color: "cyan", mgrTitle: "Backend Manager" },
      networks: { name: "Network & Security", icon: Shield, color: "orange", mgrTitle: "Security Manager" },
      dbms: { name: "Database (DBMS)", icon: Database, color: "violet", mgrTitle: "Database Manager" },
      testing: { name: "Testing & QA", icon: TestTube, color: "emerald", mgrTitle: "QA Manager" },
    };

    const computedGroups = [];
    const computedMgrs = [
      {
        title: "Lead Manager",
        name: project.manager || "Allen Charles",
        department: "Project Management",
        color: "emerald",
      },
    ];
    const allTasks = [];
    const allMembers = [];

    for (const [key, dept] of Object.entries(project.departments)) {
      const meta = DEPT_META[key] || { name: key, icon: LayoutDashboard, color: "amber", mgrTitle: `${key} Manager` };
      const rmName = dept.reportingManager?.personal
        ? `${dept.reportingManager.personal.firstName || ""} ${dept.reportingManager.personal.lastName || ""}`.trim()
        : dept.reportingManager?.name || "Unassigned";

      computedMgrs.push({
        title: meta.mgrTitle,
        name: rmName || "Unassigned",
        department: meta.name,
        color: meta.color,
      });

      const teams = dept.teams || [];
      const compCount = teams.filter((t) => t.isComplete).length;
      const totCount = teams.length || 1;
      const prog = Math.round((compCount / totCount) * 100);

      const tasks = teams.map((t, idx) => {
        const leadName = t.lead?.personal
          ? `${t.lead.personal.firstName || ""} ${t.lead.personal.lastName || ""}`.trim()
          : rmName;
        const memCount = t.members?.length || 5;

        if (t.members) {
          t.members.forEach((m) => {
            const mName = m.employee?.personal
              ? `${m.employee.personal.firstName || ""} ${m.employee.personal.lastName || ""}`.trim()
              : m.name || "Engineer";
            allMembers.push({
              initials: mName.slice(0, 2).toUpperCase(),
              name: mName,
              role: t.name,
              department: meta.name,
              tasksDone: t.isComplete ? 5 : 2,
              hours: `${40 + idx * 10}h`,
            });
          });
        }

        const taskObj = {
          title: t.name,
          manager: leadName || rmName || "Unassigned",
          member: leadName || rmName || "Unassigned",
          team: memCount,
          status: t.isComplete ? "Completed" : "In Progress",
          priority: idx % 2 === 0 ? "High" : "Medium",
          department: meta.name,
        };
        allTasks.push(taskObj);
        return taskObj;
      });

      computedGroups.push({
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        count: `${compCount}/${teams.length}`,
        progress: prog,
        lead: rmName || "Unassigned",
        tasks: tasks,
      });
    }

    const computedMilestones = [
      { name: "Project Initiation", date: "Jan 15, 2026", status: "Completed", completion: 100 },
      { name: "Architecture & Schema Setup", date: "Mar 1, 2026", status: "Completed", completion: 100 },
      { name: "Departmental Sprint 1", date: "May 15, 2026", status: "Completed", completion: 100 },
      { name: "Executive Suite Integration", date: project.deadline || "Jul 31, 2026", status: "In Progress", completion: project.progress || 50 },
      { name: "Testing & QA Verification", date: "Aug 10, 2026", status: "Upcoming", completion: 0 },
    ];

    return {
      taskGroups: computedGroups.length > 0 ? computedGroups : staticTaskGroups,
      departmentManagers: computedMgrs,
      currentTasks: allTasks.length > 0 ? allTasks : staticCurrentTasks,
      teamMembers: allMembers.length > 0 ? allMembers : staticTeamMembers,
      milestones: computedMilestones,
    };
  }, [project]);

  const [selectedGroupName, setSelectedGroupName] = useState(null);
  const activeGroup = taskGroups.find((g) => g.name === selectedGroupName) || taskGroups[0] || {};
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [viewMode, setViewMode] = useState("departmental");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const mainEl = document.querySelector("main") || document.documentElement;
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, []);

  const ActiveGroupIcon = activeGroup.icon || LayoutDashboard;

  const completedTasksCount = currentTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const totalTasksCount = currentTasks.length;

  const getColorClasses = (color) => {
    const colors = {
      amber: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
      orange: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      violet: "bg-violet-500/10 text-violet-500 border-violet-500/30",
      emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    };

    return colors[color] || colors.amber;
  };

  const getProgressColor = (color) => {
    const colors = {
      amber: "bg-amber-500",
      cyan: "bg-cyan-500",
      orange: "bg-orange-500",
      violet: "bg-violet-500",
      emerald: "bg-emerald-500",
    };

    return colors[color] || colors.amber;
  };

  const statusStyle = (status) => {
  const value = status?.trim();

  if (value === "Completed") {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }

  if (value === "In Progress") {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }

  if (value === "Pending") {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }

  if (value === "Upcoming") {
    return `
      bg-slate-200
      text-slate-700
      border-slate-300
      dark:bg-slate-500/15
      dark:text-slate-300
      dark:border-slate-500/30
    `;
  }

  return "bg-muted text-muted-foreground border-border";
};

  const priorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }

    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  const departmentPillStyle = (department) => {
  if (department === "Project Management") {
    return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  }

  if (department === "Frontend") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  if (department === "Backend") {
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  }

  if (department === "Network & Security") {
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  }

  if (department === "Database Management") {
    return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  }

  if (department === "Testing & QA") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }

  return "bg-primary/10 text-primary border-primary/20";
};

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 transition-all duration-300 hover:border-primary/30">
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_40%)]" />

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer mb-5 uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {project.project}
              </h1>
            </div>

            <div className="flex items-center shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(project.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {project.status === "On Track" ? "Ongoing" : project.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Building2 size={15} />
              </div>
              <div className="text-xs">
                <p className="text-slate-400 font-medium">Client</p>
                <p className="font-semibold text-slate-200">{project.client}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20 flex items-center justify-center shrink-0">
                <UserRound size={15} />
              </div>
              <div className="text-xs">
                <p className="text-slate-400 font-medium">Managed by</p>
                <p className="font-semibold text-slate-200">{project.manager}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Project Budget */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/30">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_38%)]" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Project Budget
              </p>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">
                {formatProjectAmount(project.budget || project.agreed)}
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Total allocated budget
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_38%)]" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Budget Utilization
              </p>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">
                {project.received ? formatProjectAmount(project.received) : "—"}
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                {project.progress}% utilized
              </p>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2.5 max-w-[120px]">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_38%)]" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Team Members
              </p>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">
                {teamMembers.length}
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Active contributors
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/30">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_38%)]" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tasks Completed
              </p>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">
                {completedTasksCount}/{totalTasksCount}
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Overall task progress
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Section */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {viewMode === "departmental"
                ? "Departmental Progress"
                : "Project Milestones"}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {viewMode === "departmental"
                ? "Department-wise breakdown of progress"
                : "Key deliverables and timeline"}
            </p>
          </div>

          {/* Modern View Dropdown Selector */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="w-full sm:w-fit flex items-center justify-between gap-2.5 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <span>{viewMode === "departmental" ? "Departmental Progress" : "Project Milestones"}</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isViewDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setIsViewDropdownOpen(false)}
                />
                <div className="absolute right-0 z-30 mt-1.5 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                  <button
                    onClick={() => {
                      setViewMode("departmental");
                      setIsViewDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition hover:bg-slate-700 cursor-pointer ${
                      viewMode === "departmental" ? "text-blue-500 font-bold bg-slate-750" : "text-slate-200"
                    }`}
                  >
                    Departmental Progress
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("milestones");
                      setIsViewDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition hover:bg-slate-700 cursor-pointer ${
                      viewMode === "milestones" ? "text-blue-500 font-bold bg-slate-750" : "text-slate-200"
                    }`}
                  >
                    Project Milestones
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {viewMode === "departmental" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
              {taskGroups.map((group) => {
                const Icon = group.icon;
                const isActive = activeGroup.name === group.name;

                return (
                  <button
                    key={group.name}
                    onClick={() => setSelectedGroupName(group.name)}
                    className={`
                      text-left rounded-2xl border p-5 transition glass-card
                      ${
                        isActive
                          ? "border-foreground dark:border-primary shadow-lg shadow-primary/20"
                          : "border-border"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-11 h-11 rounded-xl flex items-center justify-center mb-5 border
                        ${getColorClasses(group.color)}
                      `}
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="font-bold text-foreground">
                      {group.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      {group.count} Tasks
                    </p>

                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-4">
                      <div
                        className={`h-full rounded-full ${getProgressColor(
                          group.color
                        )}`}
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center border shrink-0
                      ${getColorClasses(activeGroup.color)}
                    `}
                  >
                    <ActiveGroupIcon size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      {activeGroup.name} Tasks
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeGroup.tasks?.length || 0} total tasks
                    </p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 flex-wrap">
                  <span>Lead: <strong className="text-slate-200 font-semibold">{activeGroup.lead}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span className="font-semibold text-slate-200">
                    {activeGroup.progress}% complete
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeGroup.tasks || []).map((task) => {
                  const completed = task.status === "Completed";

                  return (
                    <div
                      key={task.title}
                      className={`
                        p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all duration-300
                        ${
                          completed
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {completed ? (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Circle
                              size={18}
                              className="text-slate-500"
                            />
                          )}
                        </div>

                        <div>
                          <h4
                            className={`font-semibold text-sm leading-snug ${
                              completed
                                ? "line-through text-slate-500"
                                : "text-slate-200"
                            }`}
                          >
                            {task.title}
                          </h4>

                          <p className="text-xs text-slate-400 mt-1">
                            Manager: {task.manager}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-1">
                        <span className="text-[11px] text-slate-400">
                          Team Size: <strong className="text-slate-300 font-semibold">{task.team}</strong>
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {viewMode === "milestones" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between gap-4 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-slate-200 leading-snug">
                      {item.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle(item.status)} shrink-0`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <CalendarDays size={14} className="text-slate-500" />
                    <span>Target: {item.date}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800/60 pt-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Completion</span>
                    <span>{item.completion}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.status === "Upcoming"
                          ? "bg-slate-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      }`}
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team + Current Tasks Section */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (project?._id || project?.id) {
              window.location.href = `/projects/${project._id || project.id}`;
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition cursor-pointer"
        >
          <Users size={17} />
          Detailed Team View
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Department Managers Card Grid */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/20 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-100">
            Department Managers
          </h2>

          <p className="text-sm text-slate-400 mt-1 mb-5">
            Department-wise project leads and managers
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departmentManagers.map((manager) => {
              const initials = manager.name
                ? manager.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                : "M";
              return (
                <div
                  key={manager.title}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 leading-snug">
                        {manager.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {manager.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${departmentPillStyle(
                        manager.department
                      )}`}
                    >
                      {manager.department}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Tasks Card Grid */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/20 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-100">
            Current Tasks
          </h2>

          <p className="text-sm text-slate-400 mt-1 mb-5">
            Active and pending tasks with department details
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentTasks.map((task) => (
              <div
                key={task.title}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between gap-3.5 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Assigned: {task.member || task.manager}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityStyle(
                      task.priority
                    )} shrink-0`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-1">
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${departmentPillStyle(
                      task.department
                    )}`}
                  >
                    {task.department}
                  </span>

                  <span
                    className={`inline-flex items-center justify-center whitespace-nowrap min-w-[70px] px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{/* Detailed Team Modal */}
{showTeamModal && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
    <div className="w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl">
      <div className="sticky top-0 z-10 px-5 py-4 border-b border-border bg-background/95 backdrop-blur-xl flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Detailed Team View
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Individual contributions and workload breakdown
          </p>
        </div>

        <button
          onClick={() => setShowTeamModal(false)}
          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map((member) => {
          const theme =
            member.department === "Frontend"
              ? {
                  avatar: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  glow: "from-amber-500/12 to-transparent border-amber-500/20 hover:shadow-amber-500/20",
                  badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                }
              : member.department === "Backend"
              ? {
                  avatar: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
                  glow: "from-cyan-500/12 to-transparent border-cyan-500/20 hover:shadow-cyan-500/20",
                  badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                }
              : member.department === "Testing"
              ? {
                  avatar: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  glow: "from-emerald-500/12 to-transparent border-emerald-500/20 hover:shadow-emerald-500/20",
                  badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                }
              : {
                  avatar: "bg-primary/10 text-primary border-primary/30",
                  glow: "from-primary/12 to-transparent border-primary/20 hover:shadow-primary/20",
                  badge: "bg-primary/10 text-primary border-primary/20",
                };

          return (
            <div
              key={member.name}
              className={`
                relative overflow-hidden rounded-2xl border p-4
                bg-gradient-to-br ${theme.glow}
                shadow-md transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
              `}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_38%)]" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`
                      w-11 h-11 rounded-xl border flex items-center justify-center
                      text-sm font-bold ${theme.avatar}
                    `}
                  >
                    {member.initials}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {member.name}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-background/60 p-3 text-center border border-border">
                    <h4 className="text-xl font-bold text-foreground">
                      {member.tasksDone}
                    </h4>

                    <p className="text-[11px] text-muted-foreground mt-1">
                      Tasks Done
                    </p>
                  </div>

                  <div className="rounded-xl bg-background/60 p-3 text-center border border-border">
                    <h4 className="text-xl font-bold text-foreground">
                      {member.hours}
                    </h4>

                    <p className="text-[11px] text-muted-foreground mt-1">
                      Hours Logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${theme.badge}`}
                  >
                    {member.department}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
    </div>
  );
}