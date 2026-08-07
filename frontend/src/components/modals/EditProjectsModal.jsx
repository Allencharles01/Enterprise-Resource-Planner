"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Edit3, Trash2, FolderKanban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { ProjectEditorModal } from "./ProjectEditorModal";

export function EditProjectsModal({ isOpen, onClose }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Ongoing Projects");
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = () => {
    setIsLoading(true);
    api
      .get("/api/projects")
      .then((res) => setProjects(res.data || []))
      .catch((err) => console.error("Failed to fetch projects:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}" and all its tasks?`)) {
      return;
    }
    setDeletingId(project.id || project._id);
    try {
      await api.delete(`/api/projects/${project.id || project._id}`);
      setProjects((prev) => prev.filter((p) => (p.id || p._id) !== (project.id || project._id)));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const tabs = ["Active Projects", "Ongoing Projects", "Closed Projects"];

  const filteredProjects = projects.filter((p) => {
    const st = (p.status || "Ongoing").toLowerCase();
    if (activeTab === "Closed Projects") {
      return st === "completed" || st === "closed";
    }
    if (activeTab === "Active Projects") {
      return st === "active" || st === "on hold";
    }
    // Ongoing Projects tab (default)
    return st === "ongoing" || (!["completed", "closed", "active", "on hold"].includes(st));
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[85vh] bg-background border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20">
                <FolderKanban size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Manage Enterprise Projects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Review deliverables across lifecycle stages
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* 3 Tabs */}
          <div className="flex border-b border-border bg-muted/30 px-6 pt-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all rounded-t-xl ${
                  activeTab === tab
                    ? "border-primary text-primary bg-background shadow-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FolderKanban size={48} className="mx-auto mb-3 opacity-20" />
                No projects found under {activeTab}.
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const pid = proj.id || proj._id;
                const isDel = deletingId === pid;

                return (
                  <div
                    key={pid}
                    className="p-5 rounded-2xl border border-border/80 bg-muted/10 hover:bg-muted/30 flex items-center justify-between gap-4 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-extrabold text-foreground text-base truncate">
                          {proj.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          {proj.status || "Ongoing"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-4">
                        <span>Client: <strong className="text-foreground">{proj.client}</strong></span>
                        {proj.budget && <span>Budget: <strong className="text-emerald-500 font-mono">{proj.currency || "$"} {proj.budget}</strong></span>}
                        <span>Lead: <strong>{proj.manager}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProjectForEdit(proj)}
                        title="Edit Project"
                        className="p-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(proj)}
                        disabled={isDel}
                        title="Delete Project"
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                      >
                        {isDel ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      <ProjectEditorModal
        isOpen={!!selectedProjectForEdit}
        project={selectedProjectForEdit}
        onClose={() => setSelectedProjectForEdit(null)}
        onUpdated={() => {
          fetchProjects();
          setSelectedProjectForEdit(null);
        }}
      />
    </AnimatePresence>
  );
}
