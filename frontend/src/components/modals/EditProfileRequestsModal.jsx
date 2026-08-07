"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Briefcase,
  Building2,
  Mail,
  Check,
  X as RejectIcon,
  Loader2,
  AlertCircle,
  FileText,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function EditProfileRequestsModal({ isOpen, onClose, onUpdated }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRequests = () => {
    setIsLoading(true);
    api
      .get("/api/profileChangeRequests?status=pending")
      .then((res) => {
        const list = res.data || [];
        setRequests(list);
        if (selectedReq) {
          const stillThere = list.find((r) => r._id === selectedReq._id);
          if (!stillThere) setSelectedReq(list[0] || null);
          else setSelectedReq(stillThere);
        } else if (list.length > 0) {
          setSelectedReq(list[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile change requests:", err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
      setAdminRemarks("");
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!selectedReq) return;
    if (!window.confirm(`Approve profile changes for ${selectedReq.name}?`)) return;

    setActionLoading(true);
    setErrorMsg("");
    try {
      await api.post(`/api/profileChangeRequests/${selectedReq._id}/approve`, {
        adminRemarks,
      });
      setAdminRemarks("");
      fetchRequests();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Failed to approve:", err);
      setErrorMsg(err.response?.data?.error || "Failed to approve request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!selectedReq) return;
    if (!window.confirm(`Deny profile changes for ${selectedReq.name}?`)) return;

    setActionLoading(true);
    setErrorMsg("");
    try {
      await api.post(`/api/profileChangeRequests/${selectedReq._id}/reject`, {
        adminRemarks,
      });
      setAdminRemarks("");
      fetchRequests();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Failed to reject:", err);
      setErrorMsg(err.response?.data?.error || "Failed to deny request.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to format field differences nicely
  const getFieldChanges = (req) => {
    if (!req) return [];
    const changes = [];
    const current = req.currentData || {};
    const requested = req.requestedData || {};

    // Check Name
    const currFirstName = current.firstName || req.name?.split(" ")[0] || "";
    const currLastName = current.lastName || req.name?.split(" ").slice(1).join(" ") || "";
    const currFullName = `${currFirstName} ${currLastName}`.trim() || req.name;

    const reqFirstName = requested.firstName !== undefined ? requested.firstName : currFirstName;
    const reqLastName = requested.lastName !== undefined ? requested.lastName : currLastName;
    const reqFullName = `${reqFirstName} ${reqLastName}`.trim();

    if ((requested.firstName !== undefined || requested.lastName !== undefined) && reqFullName !== currFullName) {
      changes.push({
        label: "Employee Name",
        current: currFullName,
        requested: reqFullName,
      });
    }

    // Check Designation
    if (requested.designation !== undefined && requested.designation !== current.designation) {
      changes.push({
        label: "Designation",
        current: current.designation || "N/A",
        requested: requested.designation || "N/A",
      });
    }

    // Check Department
    if (requested.department !== undefined && requested.department !== current.department) {
      changes.push({
        label: "Department",
        current: current.department || "N/A",
        requested: requested.department || "N/A",
      });
    }

    // Check Contact Email
    if (requested.contactEmail !== undefined && requested.contactEmail !== (current.contactEmail || req.email)) {
      changes.push({
        label: "Contact Email",
        current: current.contactEmail || req.email || "N/A",
        requested: requested.contactEmail || "N/A",
      });
    }

    // Check Company Email
    if (requested.companyEmail !== undefined && requested.companyEmail !== current.companyEmail) {
      changes.push({
        label: "Company Email",
        current: current.companyEmail || "N/A",
        requested: requested.companyEmail || "N/A",
      });
    }

    return changes;
  };

  const currentChanges = getFieldChanges(selectedReq);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden text-slate-100 relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Section 4: Accounts — Edit Profile Requests</span>
                  {requests.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                      {requests.length} Pending
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review employee profile update requests, inspect field modifications, and approve or deny changes.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Sidebar: Request List */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 overflow-y-auto max-h-[35vh] md:max-h-none flex flex-col">
              <div className="p-4 border-b border-slate-800/80 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/40 sticky top-0 z-10">
                Pending Requests ({requests.length})
              </div>

              {isLoading ? (
                <div className="flex-1 flex justify-center items-center p-8">
                  <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
              ) : requests.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs gap-2">
                  <ShieldCheck size={36} className="text-emerald-500/50" />
                  <p className="font-semibold">All clear!</p>
                  <p>No pending profile change requests.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60">
                  {requests.map((req) => (
                    <button
                      key={req._id}
                      onClick={() => {
                        setSelectedReq(req);
                        setAdminRemarks("");
                        setErrorMsg("");
                      }}
                      className={`w-full p-4 text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                        selectedReq?._id === req._id
                          ? "bg-purple-600/15 border-l-4 border-purple-500 text-white"
                          : "hover:bg-slate-800/60 text-slate-300 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm truncate text-white">
                          {req.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                          {req.employeeCode || "EMP"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 truncate">
                        {req.currentData?.designation || "Employee"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Requested: {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Main Area: Detailed Comparison & Action Buttons */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30 flex flex-col justify-between">
              {!selectedReq ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                  <FileText size={48} className="text-slate-600" />
                  <p className="font-medium">Select a profile request from the list to review details.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Section 1: Employee Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <User size={15} /> Section 1: Employee Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Employee Name</span>
                        <span className="text-sm font-extrabold text-white">{selectedReq.name}</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Employee ID</span>
                        <span className="text-sm font-mono font-extrabold text-blue-400">{selectedReq.employeeCode || selectedReq.employeeId || "EMP"}</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Contact Email</span>
                        <span className="text-sm font-semibold text-slate-200 truncate block">{selectedReq.email}</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Current Designation</span>
                        <span className="text-xs font-bold text-slate-200">{selectedReq.currentData?.designation || "N/A"}</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Current Department</span>
                        <span className="text-xs font-bold text-slate-200">{selectedReq.currentData?.department || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Request */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Briefcase size={15} /> Section 2: Request
                    </h4>

                    {/* Comparison Box */}
                    <div className="space-y-3">
                      {currentChanges.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 font-medium">
                          No distinct text field changes detected. The employee may have submitted a general review request.
                        </div>
                      ) : (
                        currentChanges.map((change, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2 shadow-inner"
                          >
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300">
                              Requested Change for {change.label}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                                <span className="text-[10px] text-red-400/80 uppercase font-bold block mb-0.5">Current {change.label}:</span>
                                <span className="font-bold text-sm text-red-200">{change.current}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                <span className="text-[10px] text-emerald-400/80 uppercase font-bold block mb-0.5">Requested {change.label}:</span>
                                <span className="font-bold text-sm text-emerald-200">{change.requested}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Remarks from Employee */}
                      {selectedReq.reason && (
                        <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/30 space-y-1.5">
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <MessageSquare size={14} /> Remarks from Employee:
                          </span>
                          <p className="text-xs text-slate-200 italic leading-relaxed pl-5 border-l-2 border-purple-400/60 py-0.5 font-medium">
                            &quot;{selectedReq.reason}&quot;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Admin Remarks Input */}
                    <div className="pt-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Remarks (Optional):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add optional notes or remarks when approving or denying..."
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Two Buttons Underneath: Approve and Deny */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeny}
                        disabled={actionLoading}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <RejectIcon size={18} />
                        )}
                        <span>Deny</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
