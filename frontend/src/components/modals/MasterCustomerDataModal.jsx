"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  User,
  Phone,
  Mail,
  Tag,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";

export default function MasterCustomerDataModal({ isOpen, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/contact-lists/master-customer-data");
      const groups = res.data || [];
      setData(groups);

      // Expand first month by default
      if (groups.length > 0) {
        setExpandedMonths({ [groups[0].monthYear]: true });
      }
    } catch (err) {
      console.error("Failed to fetch master customer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[88vh] flex flex-col bg-background border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl border border-cyan-500/20">
                <Database size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Master Customer Data Book
                </h3>
                <p className="text-xs text-muted-foreground">
                  Complete centralized SQL database of all customer entries grouped monthly
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Controls */}
          <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-b border-border/40">
            <div className="relative w-full max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by name, phone, email, status, assigned employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl outline-none focus:border-cyan-500 transition-all text-foreground"
              />
            </div>
          </div>

          {/* Main Monthly Data List */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                <span className="text-xs text-muted-foreground">
                  Loading Master Customer Database...
                </span>
              </div>
            ) : data.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <p className="text-sm font-bold text-foreground mb-1">
                  No Customer Data Found
                </p>
                <p className="text-xs text-muted-foreground">
                  No customer records have been saved to the database yet.
                </p>
              </div>
            ) : (
              data.map((group) => {
                const isExpanded = Boolean(expandedMonths[group.monthYear]);
                const query = searchQuery.toLowerCase();

                const filteredRecords = group.records.filter((rec) => {
                  if (!query) return true;
                  return (
                    rec.name.toLowerCase().includes(query) ||
                    rec.phone.toLowerCase().includes(query) ||
                    rec.email.toLowerCase().includes(query) ||
                    rec.status.toLowerCase().includes(query) ||
                    rec.assignedTo.toLowerCase().includes(query) ||
                    rec.remarks.toLowerCase().includes(query)
                  );
                });

                if (searchQuery && filteredRecords.length === 0) return null;

                return (
                  <div
                    key={group.monthYear}
                    className="border border-border/60 rounded-2xl overflow-hidden bg-card/60 shadow-sm"
                  >
                    {/* Collapsible Month Header */}
                    <button
                      onClick={() => toggleMonth(group.monthYear)}
                      className="w-full flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/70 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg">
                          {isExpanded ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {group.monthYear}
                        </h4>
                      </div>

                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-extrabold rounded-full">
                        {filteredRecords.length} Entries
                      </span>
                    </button>

                    {/* Expandable Table Content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-border/40">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-muted/40 text-muted-foreground border-b border-border/50">
                                <th className="p-3 w-14 text-center font-bold">S.No.</th>
                                <th className="p-3 font-bold">Name</th>
                                <th className="p-3 font-bold">Phone</th>
                                <th className="p-3 font-bold">Email</th>
                                <th className="p-3 font-bold">Status</th>
                                <th className="p-3 font-bold">Assigned To</th>
                                <th className="p-3 font-bold">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                              {filteredRecords.map((row, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-muted/20 transition-colors"
                                >
                                  <td className="p-3 text-center font-mono text-muted-foreground">
                                    {row.sNo}
                                  </td>
                                  <td className="p-3 font-bold text-foreground">
                                    {row.name}
                                  </td>
                                  <td className="p-3 font-mono text-muted-foreground">
                                    {row.phone}
                                  </td>
                                  <td className="p-3 text-muted-foreground">
                                    {row.email}
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                      {row.status}
                                    </span>
                                  </td>
                                  <td className="p-3 font-semibold text-foreground">
                                    {row.assignedTo}
                                  </td>
                                  <td className="p-3 text-muted-foreground max-w-xs truncate">
                                    {row.remarks}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="md:hidden space-y-3">
                          {filteredRecords.map((row, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                                <span className="font-bold text-foreground">
                                  #{row.sNo} {row.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  {row.status}
                                </span>
                              </div>

                              <div className="space-y-1 text-muted-foreground pt-1">
                                <div className="flex items-center gap-2">
                                  <Phone size={12} className="text-cyan-500" />
                                  <span className="font-mono">{row.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail size={12} className="text-cyan-500" />
                                  <span>{row.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <UserCheck size={12} className="text-cyan-500" />
                                  <span>Assigned: {row.assignedTo}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare size={12} className="text-cyan-500" />
                                  <span>{row.remarks}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
