"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import {
  Ticket,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Paperclip,
  X,
  Loader2,
  RefreshCw,
  Tag,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("Open Tickets");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/tickets");
      setTickets(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Esc key listener for details modal
  useEffect(() => {
    if (!selectedTicket) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedTicket(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTicket]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await api.patch(`/api/tickets/${ticketId}/status`, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
      );
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filter tickets by active tab and search query
  const tabStatusMap = {
    "Open Tickets": "Open",
    "Ongoing Tickets": "Ongoing",
    "Closed Tickets": "Closed",
  };

  const currentTabStatus = tabStatusMap[activeTab] || "Open";

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = (t.status || "Open") === currentTabStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (t.ticketID && t.ticketID.toLowerCase().includes(q)) ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.employeeName && t.employeeName.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.areaOfInconvenience && t.areaOfInconvenience.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.moduleName && t.moduleName.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const openCount = tickets.filter((t) => (t.status || "Open") === "Open").length;
  const ongoingCount = tickets.filter((t) => t.status === "Ongoing").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Ticket size={22} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Ticketing & Support Module
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-13">
              Review, track, and manage customer and employee support requests in real-time.
            </p>
          </div>

          <button
            onClick={fetchTickets}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/80 hover:bg-muted text-foreground border border-border text-sm font-semibold transition-all shadow-sm w-fit"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* 3 Section Toggle Tabs */}
        <div className="flex bg-muted/60 p-1.5 rounded-2xl border border-border/60 max-w-2xl">
          {[
            { label: "Open Tickets", count: openCount, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Ongoing Tickets", count: ongoingCount, color: "text-amber-500 bg-amber-500/10" },
            { label: "Closed Tickets", count: closedCount, color: "text-slate-500 bg-slate-500/10" },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTab === tab.label
                  ? "bg-background text-foreground shadow-md border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tab.color}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, name, email, issue..."
            className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground transition-all shadow-sm"
          />
        </div>

        {/* Tickets Grid / List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center font-semibold">
            {error}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="glass-card p-16 rounded-3xl text-center text-muted-foreground space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Tickets Found</h3>
            <p className="text-sm max-w-md mx-auto">
              {searchQuery
                ? "No tickets match your search query."
                : `There are currently no tickets in "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedTicket(ticket)}
                className="glass-card rounded-2xl p-6 border border-border/80 hover:border-primary/50 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Top Status & Type Bar */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {ticket.ticketID}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        ticket.type === "Customer"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {ticket.type || "Customer"} Ticket
                    </span>
                  </div>

                  {/* Title / Main Subject */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {ticket.type === "Employee"
                      ? `${ticket.moduleName || 'Module'} - ${ticket.category || 'Category'}`
                      : ticket.areaOfInconvenience || "Customer Inquiry / Issue"}
                  </h3>

                  {/* Subtitle / Subcategory */}
                  {ticket.subCategory && (
                    <p className="text-xs font-semibold text-primary/80 mb-3 flex items-center gap-1">
                      <Tag size={13} />
                      {ticket.subCategory}
                    </p>
                  )}

                  {/* Remarks preview */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {ticket.remarks || "No additional remarks provided."}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-border/50 text-xs space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {ticket.type === "Employee"
                        ? ticket.employeeName || ticket.name || "Employee"
                        : ticket.name || "Customer"}
                    </span>
                    <span className="text-[11px]">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Toggle Quick Actions */}
                  <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                    {ticket.status === "Open" && (
                      <button
                        onClick={() => handleUpdateStatus(ticket._id, "Ongoing")}
                        className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg font-bold text-[11px] transition-all text-center"
                      >
                        Mark Ongoing
                      </button>
                    )}
                    {ticket.status !== "Closed" && (
                      <button
                        onClick={() => handleUpdateStatus(ticket._id, "Closed")}
                        className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[11px] transition-all text-center"
                      >
                        Close Ticket
                      </button>
                    )}
                    {ticket.status === "Closed" && (
                      <button
                        onClick={() => handleUpdateStatus(ticket._id, "Open")}
                        className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-lg font-bold text-[11px] transition-all text-center"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Details Modal Pop up */}
      <AnimatePresence>
        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 md:p-8 text-slate-900 dark:text-slate-100"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-t-3xl" />

              {/* Modal Header & Red Circle X button */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Ticket size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold tracking-tight">
                        Ticket {selectedTicket.ticketID}
                      </h2>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          selectedTicket.status === "Open"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : selectedTicket.status === "Ongoing"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {selectedTicket.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Raised on {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Red Circle X Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md shrink-0 cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} className="stroke-[3]" />
                </motion.button>
              </div>

              {/* Details Content */}
              <div className="space-y-6">
                {/* Raiser Information Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    {selectedTicket.type === "Employee" ? "Employee Details" : "Customer Details"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Name:</span>{" "}
                      <span className="font-bold">
                        {selectedTicket.type === "Employee"
                          ? selectedTicket.employeeName || selectedTicket.name
                          : selectedTicket.name}
                      </span>
                    </div>

                    {selectedTicket.type === "Employee" && (
                      <div>
                        <span className="text-slate-400 font-medium">Emp ID:</span>{" "}
                        <span className="font-mono font-bold text-primary">
                          {selectedTicket.employeeId}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-400 font-medium">Email:</span>{" "}
                      <span className="font-semibold">
                        {selectedTicket.type === "Employee"
                          ? selectedTicket.employeeEmail || selectedTicket.email
                          : selectedTicket.email}
                      </span>
                    </div>

                    {selectedTicket.phoneNumber && (
                      <div>
                        <span className="text-slate-400 font-medium">Phone:</span>{" "}
                        <span className="font-semibold">
                          {selectedTicket.phoneCountryCode} {selectedTicket.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ticket Classification Details */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    Issue & Classification
                  </h3>

                  {selectedTicket.type === "Customer" ? (
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Area of Inconvenience:</span>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        {selectedTicket.areaOfInconvenience || "General Service Request"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Module:</span>
                        <p className="font-bold text-foreground">{selectedTicket.moduleName || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Category:</span>
                        <p className="font-bold text-foreground">{selectedTicket.category || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Sub Category:</span>
                        <p className="font-bold text-primary">{selectedTicket.subCategory || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remarks & Explanation */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Remarks / Issue Description
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.remarks || "No remarks entered."}
                  </div>
                </div>

                {/* Attached File if available */}
                {selectedTicket.fileName && (
                  <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 p-3.5 rounded-2xl text-xs">
                    <Paperclip size={18} className="text-cyan-500 shrink-0" />
                    <div className="flex-1 truncate">
                      <span className="font-bold text-foreground block truncate">
                        {selectedTicket.fileName}
                      </span>
                      <span className="text-slate-400">Attached Document</span>
                    </div>
                  </div>
                )}

                {/* Status Controls inside Modal */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-medium">Change Status:</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isUpdatingStatus || selectedTicket.status === "Open"}
                      onClick={() => handleUpdateStatus(selectedTicket._id, "Open")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-40"
                    >
                      Set Open
                    </button>
                    <button
                      disabled={isUpdatingStatus || selectedTicket.status === "Ongoing"}
                      onClick={() => handleUpdateStatus(selectedTicket._id, "Ongoing")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-40"
                    >
                      Set Ongoing
                    </button>
                    <button
                      disabled={isUpdatingStatus || selectedTicket.status === "Closed"}
                      onClick={() => handleUpdateStatus(selectedTicket._id, "Closed")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-40"
                    >
                      Close Ticket
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
