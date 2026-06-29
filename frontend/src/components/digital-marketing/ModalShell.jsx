"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ModalShell({
  open,
  title,
  icon: Icon,
  color = "#6366f1",
  glow = "glow-blue",
  onClose,
  children,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  const displayTitle = (title || "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("And", "&");

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.section
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`glass ${glow} max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[20px] bg-zinc-900 border border-border text-foreground flex flex-col`}
        >
          <header
            className="flex min-h-[100px] shrink-0 items-center justify-between border-b px-7"
            style={{ borderColor: "rgba(30, 41, 59, 0.68)" }}
          >
            <div className="flex items-center gap-5">
              {Icon ? (
                <span
                  className="flex h-[64px] w-[64px] items-center justify-center rounded-[13px]"
                  style={{
                    background: `linear-gradient(145deg, ${color}55, ${color}1f)`,
                    color,
                    boxShadow: `0 0 24px ${color}33, inset 0 0 20px rgba(255,255,255,0.08)`,
                  }}
                >
                  <Icon size={30} />
                </span>
              ) : null}
              <div>
                <h2 className="text-[25px] font-bold tracking-[-0.03em] text-foreground">
                  {displayTitle}
                </h2>
                <p className="mt-1 text-[14px] text-muted-foreground">
                  Manage and analyze digital marketing activity in one place.
                </p>
              </div>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-[10px] text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
              onClick={onClose}
              type="button"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </header>
          <div className="overflow-y-auto p-6 flex-1">{children}</div>
        </motion.section>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
