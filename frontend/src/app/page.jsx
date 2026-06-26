"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  FolderOpen,
  FolderCheck,
  CalendarClock,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projects");
        setProjects(response.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const isOngoing = (p) => {
    const st = (p.status || "Ongoing").toLowerCase();
    return (
      st === "ongoing" ||
      st === "active" ||
      st === "in progress" ||
      !["closed", "completed", "cancelled", "on hold"].includes(st)
    );
  };

  const openProjectsCount = projects.filter(isOngoing).length;
  const closedProjectsCount = projects.filter(
    (p) => p.status === "Closed" || p.status === "Completed",
  ).length;
  const deadlinesCount = 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Tiled Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-amber-500/30 rounded-2xl p-6 shadow-lg shadow-amber-500/10 flex flex-col cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                <FolderOpen size={24} />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {openProjectsCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Open Projects
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Currently active and ongoing
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 rounded-2xl p-6 shadow-lg shadow-emerald-500/10 flex flex-col cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <FolderCheck size={24} />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {closedProjectsCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Closed Projects
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Successfully completed
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card bg-gradient-to-br from-rose-500/20 to-rose-600/5 border-rose-500/30 rounded-2xl p-6 shadow-lg shadow-rose-500/10 flex flex-col cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
                <CalendarClock size={24} />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {deadlinesCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Today's Deadlines
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tasks requiring immediate attention
            </p>
          </motion.div>
        </div>

        {/* Ongoing Projects List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Ongoing Projects
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/projects/new")}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                New Project
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center text-muted-foreground">
              No ongoing projects found.
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(isOngoing)
                .map((project, idx) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                          {project.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mt-2">
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">Assigned to:</span>{" "}
                          {project.manager}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">Deadline:</span>{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        {project.remainingTasks !== undefined && (
                          <span className="flex items-center gap-1.5 text-amber-500">
                            <span className="font-medium">
                              Remaining Tasks:
                            </span>{" "}
                            {project.remainingTasks}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex p-2 rounded-full bg-background group-hover:bg-primary group-hover:text-white transition-colors text-muted-foreground">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
