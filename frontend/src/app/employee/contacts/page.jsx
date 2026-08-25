"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  CheckCircle2,
  Database,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  Mail,
  Tag,
  MessageSquare,
  Sparkles,
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

const normalize = (s) => String(s || "").trim().toLowerCase();

const getFieldValue = (record, possibleKeys) => {
  if (!record) return "";
  if (Array.isArray(record)) {
    return record.join(" ") || "";
  }
  if (typeof record === "object") {
    const keys = Object.keys(record);
    const exactKey = keys.find((k) =>
      possibleKeys.some((pk) => normalize(k) === normalize(pk))
    );
    if (exactKey && record[exactKey] !== undefined) return record[exactKey];

    const partialKey = keys.find((k) =>
      possibleKeys.some((pk) => normalize(k).includes(normalize(pk)))
    );
    if (partialKey && record[partialKey] !== undefined) return record[partialKey];
  }
  return "";
};

const getName = (r) =>
  getFieldValue(r, ["name", "full name", "client name", "candidate name", "student name", "first name"]) ||
  r?.Name ||
  r?.name ||
  "N/A";

const getEmail = (r) =>
  getFieldValue(r, ["email", "email id", "email address", "mail", "e-mail"]) ||
  r?.Email ||
  r?.email ||
  "N/A";

const getPhone = (r) =>
  getFieldValue(r, [
    "contact",
    "phone",
    "phone number",
    "mobile",
    "mobile number font",
    "contact number",
    "number",
    "tel",
  ]) ||
  r?.Phone ||
  r?.phone ||
  r?.Contact ||
  r?.contact ||
  "N/A";

export default function EmployeeContactsSyncPage() {
  const router = useRouter();
  const [assignedLists, setAssignedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState({});

  const employeeCode =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmployeeCode") || "EMP001"
      : "EMP001";

  const fetchAssignedContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/contact-lists/assigned?employeeCode=${employeeCode}`);
      const lists = res.data || [];
      setAssignedLists(lists);
      
      // Auto-expand all months
      const initialExpanded = {};
      lists.forEach((item) => {
        initialExpanded[item.monthYear] = true;
      });
      setExpandedMonths(initialExpanded);
    } catch (err) {
      console.error("Failed to fetch assigned contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedContacts();
  }, []);

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const handleSyncList = async (listId) => {
    setSyncingId(listId);
    try {
      const res = await api.post(`/api/contact-lists/sync/${listId}`, {
        employeeCode,
      });

      if (res.data?.success) {
        setToastMessage("Contacts successfully synced to your Sales Calling Workspace!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchAssignedContacts();
      }
    } catch (err) {
      console.error("Failed to sync contact list:", err);
      setToastMessage("Failed to sync contacts. Please try again.");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    const pendingLists = assignedLists.flatMap((g) =>
      g.lists.filter((l) => l.status === "pending")
    );

    if (pendingLists.length === 0) {
      setToastMessage("All lists are already synced!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setSyncingId("ALL");
    try {
      for (const list of pendingLists) {
        await api.post(`/api/contact-lists/sync/${list._id}`, {
          employeeCode,
        });
      }
      setToastMessage("All newly assigned contacts successfully synced!");
      setTimeout(() => setToastMessage(null), 4000);
      fetchAssignedContacts();
    } catch (err) {
      console.error("Failed to sync all contacts:", err);
      setToastMessage("Error syncing some lists.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b1a] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Contact Synchronization
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white mt-1">
                Newly Sent Customer Contacts
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={syncingId === "ALL"}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {syncingId === "ALL" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              <span>Sync All Pending Contacts</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800 rounded-2xl gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={36} />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Fetching freshly assigned contact lists...
            </p>
          </div>
        ) : assignedLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FileSpreadsheet size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Assigned Contact Lists Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              There are currently no new contact lists assigned to your employee code ({employeeCode}). When administrators assign new CSV contact lists, they will appear here in SQL format for syncing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedLists.map((group) => {
              const isExpanded = expandedMonths[group.monthYear];
              const pendingCount = group.lists.filter((l) => l.status === "pending").length;

              return (
                <div
                  key={group.monthYear}
                  className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  {/* Month Accordion Header */}
                  <button
                    onClick={() => toggleMonth(group.monthYear)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors text-left border-b border-slate-200/60 dark:border-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          {group.monthYear}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {group.lists.length} document(s) assigned • {group.totalRows} total records
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {pendingCount > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-500/20">
                          {pendingCount} Pending Sync
                        </span>
                      )}
                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 sm:p-6 space-y-6"
                      >
                        {group.lists.map((list) => {
                          const isSynced = list.status === "synced";
                          const isSyncing = syncingId === list._id;

                          return (
                            <div
                              key={list._id}
                              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
                            >
                              {/* List Sub-Header */}
                              <div className="p-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                    <Database size={16} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                      {list.fileName}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                      Assigned by Admin: <span className="font-semibold text-slate-700 dark:text-slate-300">{list.assignedByName || "Admin"}</span> • {list.rows?.length || 0} customer entry(s)
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isSynced ? (
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                                      <CheckCircle2 size={14} /> Synced
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSyncList(list._id)}
                                      disabled={isSyncing}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      {isSyncing ? (
                                        <Loader2 size={13} className="animate-spin" />
                                      ) : (
                                        <RefreshCw size={13} />
                                      )}
                                      <span>Sync Contacts Now</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Desktop SQL Format Table View */}
                              <div className="hidden md:block overflow-x-auto p-4">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-100/50 dark:bg-slate-800/40">
                                      <th className="py-2.5 px-3 rounded-l-lg">S.No</th>
                                      <th className="py-2.5 px-3">Name</th>
                                      <th className="py-2.5 px-3">Phone</th>
                                      <th className="py-2.5 px-3">Email</th>
                                      <th className="py-2.5 px-3">Status</th>
                                      <th className="py-2.5 px-3 rounded-r-lg">Remarks / File Source</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                                    {list.rows.map((row, idx) => (
                                      <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                          {getName(row)}
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                          {getPhone(row)}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                                          {getEmail(row)}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                                            Not Connected
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 italic">
                                          Assigned via {list.fileName}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Mobile Tile View */}
                              <div className="block md:hidden p-4 space-y-2.5">
                                {list.rows.map((row, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-sm"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold text-slate-400">
                                        #{idx + 1}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                                        Not Connected
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                                      <User size={13} className="text-emerald-500" />
                                      {getName(row)}
                                    </h5>
                                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                                      <p className="flex items-center gap-1.5 font-mono">
                                        <Phone size={12} className="text-blue-500" />
                                        {getPhone(row)}
                                      </p>
                                      <p className="flex items-center gap-1.5">
                                        <Mail size={12} className="text-violet-500" />
                                        {getEmail(row)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm z-[100] flex items-center gap-3 border border-emerald-500/30"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
