"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import ImportDataModal from "@/components/ImportDataModal";
import {
  FolderOpen,
  FolderCheck,
  CalendarClock,
  ChevronRight,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const activeSession = sessionStorage.getItem("active_session");

    if (!token || !activeSession) {
      router.replace("/login");
      return;
    }

    const userRole = localStorage.getItem("userRole");
    const userDepartment = (
      localStorage.getItem("userDepartment") || ""
    ).toLowerCase();
    const userName = (localStorage.getItem("userName") || "").toLowerCase();

    if (userRole === "employee") {
      if (userDepartment.includes("sales") || userName.includes("sales")) {
        router.replace("/employee/sales");
        return;
      }

      if (userDepartment.includes("digital") || userName.includes("digital")) {
        router.replace("/employee/digitaldashboard");
        return;
      }
    }

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
  }, [router]);

  const isOngoing = (project) => {
    const status = (project.status || "Ongoing").toLowerCase();

    return (
      status === "ongoing" ||
      status === "active" ||
      status === "in progress" ||
      !["closed", "completed", "cancelled", "on hold"].includes(status)
    );
  };

  const openProjectsCount = projects.filter(isOngoing).length;

  const closedProjectsCount = projects.filter(
    (project) =>
      project.status === "Closed" || project.status === "Completed"
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
              Today&apos;s Deadlines
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
              >
                <Upload size={16} />
                Import
              </button>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(isOngoing).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="glass-card min-h-[180px] rounded-2xl p-5 border border-border/60 hover:border-primary/60 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-xl relative overflow-hidden bg-gradient-to-b from-slate-900/40 to-slate-900/80"
                >
                  {/* Top Section */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 tracking-wide uppercase">
                        {project.status}
                      </span>

                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white group-hover:scale-105 transition-all flex items-center justify-center shadow-md shadow-violet-300/30">
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {project.name}
                    </h3>
                  </div>

                  {/* Bottom Details Section */}
                  <div className="space-y-3 pt-4 border-t border-border/40 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-semibold text-slate-400">
                        Assigned to:
                      </span>

                      <span className="font-bold text-foreground truncate max-w-[130px]">
                        {project.manager}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-semibold text-slate-400">
                        Deadline:
                      </span>

                      <span className="font-mono font-medium text-slate-300">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {project.remainingTasks !== undefined && (
                      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl text-amber-400 font-bold">
                        <span>Remaining Tasks</span>

                        <span className="text-sm font-black">
                          {project.remainingTasks}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showImportModal && (
        <ImportDataModal onClose={() => setShowImportModal(false)} />
      )}
    </DashboardLayout>
  );
}