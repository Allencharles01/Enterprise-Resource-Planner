"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

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
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
<div
  className="
    group relative overflow-hidden rounded-2xl border border-border p-7
    bg-background transition-all duration-300
    hover:-translate-y-1
    hover:border-primary/40
    hover:shadow-2xl hover:shadow-primary/20
  "
>
  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.20),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.12),transparent_35%)]" />

  <div className="relative z-10">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </button>

    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {project.project}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mt-5 text-muted-foreground">
          <span className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <strong className="text-foreground">Client:</strong>
            {project.client}
          </span>

          <span className="flex items-center gap-2">
            <UserRound size={16} className="text-pink-500" />
            <strong className="text-foreground">Managed by:</strong>
            {project.manager}
          </span>
        </div>
      </div>

      <div className="px-5 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold">
        Status: {project.status === "On Track" ? "Ongoing" : project.status}
      </div>
    </div>
  </div>
</div>

{/* Project Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {/* Project Budget */}
  <div
    className="
      group relative overflow-hidden rounded-2xl border border-border p-6
      bg-background transition-all duration-300
      hover:-translate-y-1
      hover:border-orange-500/30
      hover:shadow-2xl hover:shadow-orange-500/20
    "
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_38%)]" />

    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <p className="text-muted-foreground font-medium">
          Project Budget
        </p>

        <DollarSign size={22} className="text-orange-500" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-10">
        {project.budget || project.agreed}
      </h2>

      <p className="text-sm text-muted-foreground mt-2">
        Total allocated budget
      </p>
    </div>
  </div>

  {/* Budget Utilization */}
  <div
    className="
      group relative overflow-hidden rounded-2xl border border-border p-6
      bg-background transition-all duration-300
      hover:-translate-y-1
      hover:border-emerald-500/30
      hover:shadow-2xl hover:shadow-emerald-500/20
    "
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_38%)]" />

    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <p className="text-muted-foreground font-medium">
          Budget Utilization
        </p>

        <TrendingUp size={22} className="text-emerald-500" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-10">
        {project.received || "—"}
      </h2>

      <p className="text-sm text-muted-foreground mt-2">
        {project.progress}% of budget utilized
      </p>

      <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-foreground dark:bg-primary rounded-full"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  </div>

  {/* Team Members */}
  <div
    className="
      group relative overflow-hidden rounded-2xl border border-border p-6
      bg-background transition-all duration-300
      hover:-translate-y-1
      hover:border-cyan-500/30
      hover:shadow-2xl hover:shadow-cyan-500/20
    "
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_38%)]" />

    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <p className="text-muted-foreground font-medium">
          Team Members
        </p>

        <Users size={22} className="text-cyan-500" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-10">
        {teamMembers.length}
      </h2>

      <p className="text-sm text-muted-foreground mt-2">
        Active contributors
      </p>
    </div>
  </div>

  {/* Tasks Completed */}
  <div
    className="
      group relative overflow-hidden rounded-2xl border border-border p-6
      bg-background transition-all duration-300
      hover:-translate-y-1
      hover:border-amber-500/30
      hover:shadow-2xl hover:shadow-amber-500/20
    "
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_38%)]" />

    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <p className="text-muted-foreground font-medium">
          Tasks Completed
        </p>

        <CheckCircle2 size={22} className="text-amber-500" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-10">
        {completedTasksCount}/{totalTasksCount}
      </h2>

      <p className="text-sm text-muted-foreground mt-2">
        Overall task progress
      </p>
    </div>
  </div>
</div>

      {/* Toggle Section */}
      <div className="glass-card rounded-2xl border border-border p-7">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {viewMode === "departmental"
                ? "Departmental Progress"
                : "Project Milestones"}
            </h2>

            <p className="text-muted-foreground mt-1">
              {viewMode === "departmental"
                ? "Department-wise breakdown of progress"
                : "Key deliverables and timeline"}
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-border overflow-hidden bg-background">
            <button
              onClick={() => setViewMode("departmental")}
              className={`px-5 py-2 text-sm font-semibold transition ${
                viewMode === "departmental"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Departmental Progress
            </button>

            <button
              onClick={() => setViewMode("milestones")}
              className={`px-5 py-2 text-sm font-semibold transition ${
                viewMode === "milestones"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Project Milestones
            </button>
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

            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center border
                      ${getColorClasses(activeGroup.color)}
                    `}
                  >
                    <ActiveGroupIcon size={18} />
                  </div>

                  <h3 className="font-bold text-foreground">
                    {activeGroup.name} Tasks
                  </h3>

                  <span className="text-sm text-muted-foreground">
                    {activeGroup.tasks?.length || 0} total
                  </span>
                </div>

                <p className="text-sm text-foreground">
                  Lead:{" "}
                  <span className="font-semibold">{activeGroup.lead}</span>
                  <span className="mx-2">·</span>
                  <span className="font-semibold">
                    {activeGroup.progress}% complete
                  </span>
                </p>
              </div>

              <div>
                {(activeGroup.tasks || []).map((task) => {
                  const completed = task.status === "Completed";

                  return (
                    <div
                      key={task.title}
                      className={`
                        px-5 py-4
                        border-b border-border last:border-b-0
                        flex items-center justify-between
                        transition
                        ${
                          completed
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "hover:bg-muted/20"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {completed ? (
                          <CheckCircle2
                            size={20}
                            className="text-emerald-500 mt-1"
                          />
                        ) : (
                          <Circle
                            size={20}
                            className="text-muted-foreground mt-1"
                          />
                        )}

                        <div>
                          <h4
                            className={`font-semibold ${
                              completed
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </h4>

                          <p className="text-sm text-muted-foreground mt-1">
                            Manager: {task.manager} · Team Size: {task.team}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {viewMode === "milestones" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-4 text-foreground">
                    Milestone
                  </th>
                  <th className="text-left px-4 py-4 text-foreground">
                    Target Date
                  </th>
                  <th className="text-left px-4 py-4 text-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-foreground">
                    Completion
                  </th>
                </tr>
              </thead>

              <tbody>
                {milestones.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-semibold text-foreground">
                      {item.name}
                    </td>

                    <td className="px-4 py-4 text-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-muted-foreground"
                        />
                        {item.date}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground w-12">
                          {item.completion}%
                        </span>

                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
  className={`
    h-full rounded-full
    ${
      item.status === "Upcoming"
        ? "bg-slate-300 dark:bg-slate-600"
        : "bg-foreground dark:bg-primary"
    }
  `}
  style={{ width: `${item.completion}%` }}
/>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  {/* Department Managers Table */}
  <div className="glass-card rounded-2xl border border-border p-5">
    <h2 className="text-lg font-bold text-foreground">
      Department Managers
    </h2>

    <p className="text-sm text-muted-foreground mt-1 mb-5">
      Department-wise project leads and managers
    </p>

    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="w-[34%] text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Role & Manager
</th>
<th className="w-[46%] text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Department
</th>
<th className="w-[20%] text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Status
</th>
          </tr>
        </thead>

        <tbody>
          {departmentManagers.map((manager) => (
            <tr
              key={manager.title}
              className="border-b border-border/60 last:border-b-0 hover:bg-muted/20 transition"
            >
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {manager.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {manager.name}
                </p>
              </td>

              <td className="px-4 py-3">
                <span
  className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium border ${departmentPillStyle(
    manager.department
  )}`}
>
  {manager.department}
</span>
              </td>

              <td className="px-4 py-3 text-right">
                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Current Tasks Table */}
  <div className="glass-card rounded-2xl border border-border p-5">
    <h2 className="text-lg font-bold text-foreground">
      Current Tasks
    </h2>

    <p className="text-sm text-muted-foreground mt-1 mb-5">
      Active and pending tasks with department details
    </p>

    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/30">
<th className="w-[31%] text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Task & Member
</th>
<th className="w-[34%] text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Department
</th>
<th className="w-[18%] text-center px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Status
</th>
<th className="w-[17%] text-center px-2 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
  Priority
</th>
          </tr>
        </thead>

        <tbody>
          {currentTasks.map((task) => (
            <tr
              key={task.title}
              className="border-b border-border/60 last:border-b-0 hover:bg-muted/20 transition"
            >
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {task.member}
                </p>
              </td>

<td className="px-4 py-3">
  <span
    className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium border ${departmentPillStyle(
      task.department
    )}`}
  >
    {task.department}
  </span>
</td>

              <td className="px-3 py-3 text-center">
  <span
    className={`inline-flex items-center justify-center whitespace-nowrap min-w-[84px] px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusStyle(
      task.status
    )}`}
  >
    {task.status}
  </span>
</td>

              <td className="px-2 py-3 text-center">
  <span
    className={`inline-flex items-center justify-center whitespace-nowrap min-w-[64px] px-2.5 py-1 rounded-full text-[11px] font-medium border ${priorityStyle(
      task.priority
    )}`}
  >
    {task.priority}
  </span>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

{/* Detailed Team Modal */}
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