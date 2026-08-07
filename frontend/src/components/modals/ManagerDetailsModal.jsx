"use client";

import { useEffect, useState } from "react";
import { X, UserCheck, Mail, Briefcase, Building2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function ManagerDetailsModal({ managerName, isOpen, onClose }) {
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && managerName && managerName !== "NA" && managerName !== "N/A") {
      setLoading(true);
      api
        .get("/api/employees")
        .then((res) => {
          const all = res.data || [];
          const found = all.find((emp) => {
            const full = `${emp.personal?.firstName || ""} ${emp.personal?.lastName || ""}`.trim().toLowerCase();
            const firstOnly = `${emp.personal?.firstName || ""}`.trim().toLowerCase();
            const target = managerName.trim().toLowerCase();
            return full === target || firstOnly === target || full.includes(target);
          });
          setManagerData(found || null);
        })
        .catch((err) => console.error("Could not fetch manager:", err))
        .finally(() => setLoading(false));
    } else {
      setManagerData(null);
    }
  }, [isOpen, managerName]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-slate-100 relative p-6"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl" />

          {/* Header & Red X button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Manager Details
                </h3>
                <p className="text-xs text-slate-400">Supervisory profile</p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-red-500/15 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Manager Name
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {managerName || "Not Assigned"}
              </p>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 italic">Looking up details...</p>
            ) : managerData ? (
              <div className="space-y-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <Briefcase size={15} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Designation</p>
                    <p className="text-xs font-semibold text-slate-200">
                      {managerData.work?.designation || "Executive"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Building2 size={15} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Department</p>
                    <p className="text-xs font-semibold text-slate-200">
                      {managerData.work?.department || "General"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Contact Email</p>
                    <p className="text-xs font-semibold text-slate-200 break-all">
                      {managerData.work?.companyEmail !== "NA"
                        ? managerData.work?.companyEmail
                        : managerData.personal?.contactEmail || "contact@novanectar.demo"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                <p>Status: Active Leadership Team</p>
                <p className="mt-1">Email: {managerName.toLowerCase().replace(/\s+/g, ".")}@novanectar.demo</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
