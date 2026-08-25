"use client";

import { useState, useEffect } from "react";
import {
  X,
  Radiation,
  AlertTriangle,
  Loader2,
  Users,
  FolderKanban,
  Database,
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Megaphone,
  MessageSquare,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function MasterDeleteModal({ isOpen, onClose, onSuccess }) {
  const [target, setTarget] = useState(null); // 'all' | 'employees' | 'projects' | 'marketing' | null
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTarget(null);
      setPassword("");
      setErrorMsg("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!target) return;
    if (!password) {
      setErrorMsg("Password is required to authenticate this request.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/api/admins/master-delete", {
        target,
        password,
      });

      if (response.data?.success) {
        if (target === "marketing" || target === "all" || target === "projects") {
          localStorage.setItem("marketing_deleted", "true");
          window.dispatchEvent(new Event("marketingDeleted"));
        }
        if (target === "messages" || target === "all") {
          window.dispatchEvent(new Event("messagesDeleted"));
        }
        if (target === "emails" || target === "all") {
          window.dispatchEvent(new Event("emailsDeleted"));
        }
        if (onSuccess) {
          onSuccess(target);
        }
        onClose();
      }
    } catch (err) {
      console.error("Master delete request failed:", err);
      setErrorMsg(
        err.response?.data?.error ||
          "Failed to authenticate or perform deletion. Please check your password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-950/95 border border-red-500/30 rounded-3xl shadow-[0_0_60px_rgba(239,68,68,0.2)] w-full max-w-lg overflow-hidden text-slate-100 relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 relative group overflow-hidden">
                <Radiation size={24} className="animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Master Delete Utility</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dangerous Operations & Factory Reset
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {!target ? (
              // Step 1: Select Deletion Target
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-200">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-extrabold uppercase tracking-wide block mb-1">
                      Critical System Security Warning
                    </span>
                    These actions are permanent. Deletion requested here is instantly executed on MongoDB Atlas and cannot be undone. Select a configuration to remove.
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setTarget("all")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl group-hover:bg-red-500/25 group-hover:text-red-300 transition-colors">
                      <Database size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        All (Factory Reset)
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all users, employees, projects, tickets, chats, and logs. Preserves only your admin access credentials.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setTarget("employees")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-orange-950/20 border border-slate-800 hover:border-orange-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl group-hover:bg-orange-500/25 group-hover:text-orange-300 transition-colors">
                      <Users size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        Employees
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all employee records and user credentials (except yours). Clears related chats, tickets, and notifications.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-orange-400 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setTarget("projects")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-amber-950/20 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/25 group-hover:text-amber-300 transition-colors">
                      <FolderKanban size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        Projects
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all enterprise deliverables, ongoing client contracts, and corresponding task boards.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setTarget("marketing")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-indigo-950/20 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/25 group-hover:text-indigo-300 transition-colors">
                      <Megaphone size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        Digital Marketing
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all digital marketing campaigns, platforms, creator collaborations, and documents.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setTarget("messages")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-teal-950/20 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl group-hover:bg-teal-500/25 group-hover:text-teal-300 transition-colors">
                      <MessageSquare size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        Messages
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all internal chat logs and conversations between users.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => setTarget("emails")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-cyan-950/20 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500/25 group-hover:text-cyan-300 transition-colors">
                      <Mail size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-white block">
                        Emails
                      </span>
                      <span className="text-xs text-slate-400 leading-normal block mt-0.5">
                        Deletes all outbound and inbound email communications and logs.
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel and Go Back
                </button>
              </div>
            ) : (
              // Step 2: Confirm with Password
              <form onSubmit={handleConfirm} className="space-y-5">
                <button
                  type="button"
                  onClick={() => {
                    setTarget(null);
                    setErrorMsg("");
                    setPassword("");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
                >
                  <ChevronLeft size={16} /> Back to options
                </button>

                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-white">
                    Confirm Deletion of:{" "}
                    <span className="text-red-500 font-black uppercase">
                      {target === "all" ? "All (Factory Reset)" : target === "marketing" ? "Digital Marketing" : target === "messages" ? "Messages" : target === "emails" ? "Emails" : target}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You are executing a permanent deletion of database records on MongoDB Atlas. Enter your Admin Password to authorize this operation.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Admin Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTarget(null);
                      setErrorMsg("");
                      setPassword("");
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer border border-slate-800"
                    disabled={isLoading}
                  >
                    Go Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Radiation size={16} className="animate-[spin_3s_linear_infinite]" />
                    )}
                    <span>Authorize Deletion</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
