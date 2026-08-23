"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Building2 } from "lucide-react";

export function UnbuiltDepartmentErrorModal({ isOpen, onClose, departmentName }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-red-500/30 rounded-3xl shadow-[0_0_50px_-10px_rgba(239,68,68,0.3)] overflow-hidden relative p-6 md:p-8 text-slate-900 dark:text-slate-100"
        >
          {/* Top Red Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 mt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Dashboard Unavailable
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {departmentName || "Selected Department"}
                </p>
              </div>
            </div>

            {/* Red Circle X Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md shrink-0 cursor-pointer"
              title="Close (Esc)"
            >
              <X size={18} className="stroke-[3]" />
            </motion.button>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-500/5">
              <Building2 size={32} />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {departmentName} Dashboard Not Created
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-red-500/5 dark:bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
              The Admin and Employee Dashboard for{" "}
              <span className="font-bold text-red-600 dark:text-red-400">
                &quot;{departmentName}&quot;
              </span>{" "}
              has not been built or configured yet. Please check back later or contact your system administrator.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/25 transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
