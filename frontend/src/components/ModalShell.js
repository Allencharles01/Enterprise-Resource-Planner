"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function ModalShell({ open, title, icon: Icon, color = "#6366f1", glow = "glow-blue", onClose, children }) {
  const displayTitle = title
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("And", "&");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-5 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className={`glass ${glow} max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[20px]`}
          >
            <header className="flex min-h-[100px] items-center justify-between border-b px-7" style={{ borderColor: "rgba(30, 41, 59, 0.68)" }}>
              <div className="flex items-center gap-5">
                {Icon ? (
                  <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[13px]" style={{ background: `linear-gradient(145deg, ${color}55, ${color}1f)`, color, boxShadow: `0 0 24px ${color}33, inset 0 0 20px rgba(255,255,255,0.08)` }}>
                    <Icon size={30} />
                  </span>
                ) : null}
                <div>
                  <h2 className="text-[25px] font-bold tracking-[-0.03em]">{displayTitle}</h2>
                  <p className="mt-2 text-[14px] text-slate-300">Manage and analyze digital marketing activity in one place.</p>
                </div>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-[10px] text-slate-100 transition hover:bg-white/5" onClick={onClose} type="button" aria-label="Close modal">
                <X size={24} />
              </button>
            </header>
            <div className="max-h-[calc(88vh-100px)] overflow-auto p-6">{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
