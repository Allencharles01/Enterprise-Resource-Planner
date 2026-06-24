"use client";

import { useState } from "react";
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

const taskGroups = [
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

const milestones = [
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

const teamMembers = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Project Manager",
    department: "Management",
    tasksDone: 12,
    hours: "148h",
  },
  {
    initials: "AT",
    name: "Alex Thompson",
    role: "Lead Developer",
    department: "Backend",
    tasksDone: 18,
    hours: "210h",
  },
  {
    initials: "MG",
    name: "Maria Garcia",
    role: "UI/UX Designer",
    department: "Frontend",
    tasksDone: 15,
    hours: "176h",
  },
  {
    initials: "JW",
    name: "James Wilson",
    role: "Backend Developer",
    department: "Backend",
    tasksDone: 20,
    hours: "224h",
  },
  {
    initials: "EC",
    name: "Emily Chen",
    role: "QA Engineer",
    department: "Testing",
    tasksDone: 14,
    hours: "162h",
  },
];

const currentTasks = [
  {
    title: "Database Schema Design",
    member: "James Wilson",
    status: "Completed",
    priority: "High",
  },
  {
    title: "API Development",
    member: "Alex Thompson",
    status: "In Progress",
    priority: "High",
  },
  {
    title: "UI Component Library",
    member: "Maria Garcia",
    status: "In Progress",
    priority: "Medium",
  },
  {
    title: "Authentication Module",
    member: "Alex Thompson",
    status: "Completed",
    priority: "High",
  },
  {
    title: "Testing & QA",
    member: "Emily Chen",
    status: "Pending",
    priority: "Medium",
  },
];

export default function ProjectDetailDashboard({ project, onBack }) {
  const [activeGroup, setActiveGroup] = useState(taskGroups[0]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [viewMode, setViewMode] = useState("departmental");

  const ActiveGroupIcon = activeGroup.icon;

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

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-2xl border border-border p-7">
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

      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl border border-border p-6">
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

        <div className="glass-card rounded-2xl border border-border p-6">
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

        <div className="glass-card rounded-2xl border border-border p-6">
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

        <div className="glass-card rounded-2xl border border-border p-6">
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
                    onClick={() => setActiveGroup(group)}
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
                    {activeGroup.tasks.length} total
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
                {activeGroup.tasks.map((task) => {
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
          onClick={() => setShowTeamModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition"
        >
          <Users size={17} />
          Detailed Team View
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="glass-card rounded-2xl border border-border p-7">
          <h2 className="text-xl font-bold text-foreground">
            Team Members
          </h2>

          <p className="text-muted-foreground mt-1 mb-8">
            Active project contributors
          </p>

          <div className="space-y-7">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                    {member.initials}
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {member.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Tasks */}
        <div className="glass-card rounded-2xl border border-border p-7">
          <h2 className="text-xl font-bold text-foreground">
            Current Tasks
          </h2>

          <p className="text-muted-foreground mt-1 mb-8">
            Active and pending tasks
          </p>

          <div className="space-y-5">
            {currentTasks.map((task) => (
              <div
                key={task.title}
                className="border-b border-border pb-5 last:border-b-0 last:pb-0 flex items-center justify-between gap-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    {task.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    {task.member}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Detailed Team View
                </h2>

                <p className="text-muted-foreground mt-1">
                  Individual contributions and workload breakdown
                </p>
              </div>

              <button
                onClick={() => setShowTeamModal(false)}
                className="p-3 rounded-full bg-red-500 text-white hover:scale-105 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-border p-5 bg-muted/20"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                      {member.initials}
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">
                        {member.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-background p-4 text-center border border-border">
                      <h4 className="text-xl font-bold text-foreground">
                        {member.tasksDone}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Tasks Done
                      </p>
                    </div>

                    <div className="rounded-xl bg-background p-4 text-center border border-border">
                      <h4 className="text-xl font-bold text-foreground">
                        {member.hours}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Hours Logged
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                      {member.department}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}