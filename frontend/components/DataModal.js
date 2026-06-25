"use client";

import { X, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { compact, currency } from "@/lib/api";

function CellValue({ value, type }) {
  if (type === "money") return currency(value);
  if (type === "number") return compact(value);
  if (type === "date") return new Date(value).toLocaleDateString();
  if (type === "link") {
    return (
      <span className="flex gap-2">
        <a className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border" href={value} target="_blank" rel="noreferrer" title="View">
          <Eye size={16} />
        </a>
        <a className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border" href={value} download title="Download">
          <Download size={16} />
        </a>
      </span>
    );
  }
  return value;
}

export default function DataModal({
  open,
  title,
  onClose,
  rows,
  columns,
  filters,
  search,
  setSearch,
  activeTab,
  setActiveTab,
  tabs,
  sortBy,
  setSortBy,
  loading
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            className="glass max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[8px]"
          >
            <header className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border" onClick={onClose} title="Close" type="button">
                <X size={18} />
              </button>
            </header>

            <div className="space-y-4 p-5">
              {tabs?.length ? (
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="rounded-[8px] border px-3 py-2 text-sm"
                      style={{
                        borderColor: activeTab === tab ? "var(--primary)" : "var(--border)",
                        background: activeTab === tab ? "var(--primary)" : "transparent",
                        color: activeTab === tab ? "var(--primary-foreground)" : "var(--foreground)"
                      }}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input className="field px-3 py-2" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search database records" />
                {filters}
                <select className="field px-3 py-2" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort records">
                  {columns.map((column) => (
                    <option key={column.key} value={column.key}>
                      Sort by {column.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="max-h-[52vh] overflow-auto rounded-[8px] border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full min-w-[820px] border-collapse text-sm">
                  <thead style={{ background: "var(--muted)" }}>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key} className="px-4 py-3 text-left font-semibold">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                          Loading database records...
                        </td>
                      </tr>
                    ) : rows.length ? (
                      rows.map((row) => (
                        <tr key={row._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                          {columns.map((column) => (
                            <td key={column.key} className="px-4 py-3">
                              <CellValue value={row[column.key]} type={column.type} />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                          No database records match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
