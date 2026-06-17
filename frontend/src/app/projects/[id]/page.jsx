"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Building,
  Layout,
  Server,
  Shield,
  Database,
  TestTube,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import axios from "axios";
import { DashboardLayout } from "@/components/DashboardLayout";

const CATEGORIES = [
  {
    id: "FrontEnd",
    label: "FrontEnd",
    icon: Layout,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    id: "BackEnd",
    label: "BackEnd",
    icon: Server,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    id: "Network and Security",
    label: "Network and Security",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    id: "Database Management",
    label: "Database Management",
    icon: Database,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    id: "Testing and QA",
    label: "Testing and QA",
    icon: TestTube,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("FrontEnd");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const [projectRes, tasksRes] = await Promise.all([
          axios.get(`${apiUrl}/api/projects/${projectId}`),
          axios.get(`${apiUrl}/api/projects/${projectId}/tasks`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError("Failed to load project details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const filteredTasks = tasks.filter(
    (task) => task.category === activeCategory,
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-center">
          {error || "Project not found"}
          <button
            onClick={() => router.push("/")}
            className="mt-4 block mx-auto text-sm underline"
          >
            Go back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Top Bar with Back Button and Project Info */}
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-primary relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground mb-4">
                {project.name}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">
                    Client:
                  </span>{" "}
                  {project.client}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={16} className="text-secondary" />
                  <span className="font-semibold text-foreground">
                    Managed by:
                  </span>{" "}
                  {project.manager}
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium flex items-center justify-center w-fit h-fit">
              Status: {project.status}
            </div>
          </div>
        </div>

        {/* Categories Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const tasksInCat = tasks.filter(
              (t) => t.category === cat.id,
            ).length;
            const completedInCat = tasks.filter(
              (t) => t.category === cat.id && t.isComplete,
            ).length;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? `bg-background border-primary shadow-md ring-1 ring-primary/50`
                    : `glass border-border/50 hover:border-foreground/20`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-primary/5 z-0"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color} border ${cat.border}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tasksInCat > 0
                        ? `${completedInCat}/${tasksInCat} Tasks`
                        : "No tasks"}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Task List Section */}
        <div className="glass-card rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              {activeCategory} Tasks
              <span className="text-sm font-normal text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-muted">
                {filteredTasks.length} total
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  No tasks found for this category.
                </motion.div>
              ) : (
                filteredTasks.map((task, idx) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      task.isComplete
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-background border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 flex-shrink-0">
                        {task.isComplete ? (
                          <CheckCircle2 className="text-green-500" size={24} />
                        ) : (
                          <Circle className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-base mb-1 ${task.isComplete ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-4">
                          <span className="flex items-center gap-1">
                            <User size={14} /> Manager: {task.manager}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} /> Team Size: {task.membersCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${
                          task.isComplete
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {task.isComplete ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
