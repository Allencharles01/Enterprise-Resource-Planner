import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  UserPlus,
  Check,
  X as RejectIcon,
  Eye,
  Trash2,
  PhoneCall,
  Mail,
  FileText,
  Briefcase,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { ApproveRequestModal } from "./ApproveRequestModal";
import { GmailComposerModal } from "./GmailComposerModal";
import { formatAmount } from "@/lib/formatAmount";

export function NewRequestsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("inquiries"); // "inquiries" | "accounts" | "profiles"
  const [inquiries, setInquiries] = useState([]);
  const [accountRequests, setAccountRequests] = useState([]);
  const [profileRequests, setProfileRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedAccountReq, setSelectedAccountReq] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Gmail composer states
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerTo, setComposerTo] = useState("");
  const [composerSubject, setComposerSubject] = useState("");
  const [composerInquiryId, setComposerInquiryId] = useState(null);

  const fetchData = () => {
    Promise.resolve().then(() => setIsLoading(true));
    Promise.all([
      api.get("/api/customerInquiries").catch(() => ({ data: [] })),
      api.get("/api/accountRequests").catch(() => ({ data: [] })),
      api.get("/api/profileChangeRequests").catch(() => ({ data: [] })),
    ])
      .then(([inqRes, accRes, profileRes]) => {
        setInquiries(inqRes.data || []);
        setAccountRequests(accRes.data || []);
        setProfileRequests(profileRes.data || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        isOpen &&
        !isApproveOpen &&
        !isViewOpen &&
        !isComposerOpen
      ) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isApproveOpen, isViewOpen, isComposerOpen]);

  // Account Request Actions
  const handleApproveClick = (req) => {
    if (!req.isRead) {
      api.patch(`/api/accountRequests/${req._id}/read`).catch(console.error);
    }
    setSelectedAccountReq(req);
    setIsApproveOpen(true);
  };

  const handleRejectClick = async (req) => {
    if (
      window.confirm(
        `Are you sure you want to reject the account request for ${req.name}?`,
      )
    ) {
      try {
        await api.post(`/api/accountRequests/${req._id}/reject`);
        fetchData();
      } catch (err) {
        console.error("Failed to reject request:", err);
        alert("Failed to reject request.");
      }
    }
  };

  // Profile Change Request Actions
  const handleApproveProfileChange = async (req) => {
    if (window.confirm(`Approve profile changes for ${req.name}?`)) {
      try {
        await api.post(`/api/profileChangeRequests/${req._id}/approve`);
        fetchData();
      } catch (err) {
        console.error("Failed to approve profile changes:", err);
        alert("Failed to approve profile changes.");
      }
    }
  };

  const handleRejectProfileChange = async (req) => {
    if (window.confirm(`Reject profile changes for ${req.name}?`)) {
      try {
        await api.post(`/api/profileChangeRequests/${req._id}/reject`);
        fetchData();
      } catch (err) {
        console.error("Failed to reject profile changes:", err);
        alert("Failed to reject profile changes.");
      }
    }
  };

  // Customer Inquiry Actions
  const handleDeleteInquiry = async (inq) => {
    if (
      window.confirm(
        `Are you sure you want to delete the customer inquiry from ${inq.name}?`,
      )
    ) {
      try {
        await api.delete(`/api/customerInquiries/${inq._id}`);
        if (selectedInquiry?._id === inq._id) {
          setIsViewOpen(false);
          setSelectedInquiry(null);
        }
        fetchData();
      } catch (err) {
        console.error("Failed to delete inquiry:", err);
        alert("Failed to delete customer inquiry.");
      }
    }
  };

  const openInquiryMessage = (inq) => {
    if (!inq.isRead) {
      api.patch(`/api/customerInquiries/${inq._id}/read`).then(() => fetchData()).catch(console.error);
    }
    setComposerTo(inq.email);
    setComposerSubject(`Inquiry Regarding ${inq.projectName || "Your Project"}`);
    setComposerInquiryId(inq._id);
    setIsComposerOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border/50 bg-muted/20 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Active Requests Panel
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review and manage submitted inquiries and account applications
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-muted p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("inquiries")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "inquiries"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Briefcase size={14} />
                  Customer Inquiries
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                    {inquiries.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("accounts")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "accounts"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User size={14} />
                  Account Requests
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px]">
                    {accountRequests.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("profiles")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "profiles"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText size={14} />
                  Profile Change Requests
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px]">
                    {profileRequests.filter((p) => p.status === "pending").length}
                  </span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors absolute top-4 right-4 sm:static"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : activeTab === "inquiries" ? (
                /* Customer Inquiries Table */
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold w-20">S.no</th>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Email ID</th>
                        <th className="px-6 py-4 font-semibold">Project Name</th>
                        <th className="px-6 py-4 font-semibold">Applied Date</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq, idx) => (
                        <tr
                          key={inq._id}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {inq.name}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {inq.email}
                          </td>
                          <td className="px-6 py-4 font-medium text-primary">
                            {inq.projectName}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {new Date(inq.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  if (!inq.isRead) {
                                    api.patch(`/api/customerInquiries/${inq._id}/read`).then(() => fetchData()).catch(console.error);
                                  }
                                  setSelectedInquiry(inq);
                                  setIsViewOpen(true);
                                }}
                                className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20 shadow-sm flex items-center gap-1 text-xs font-semibold px-3 cursor-pointer"
                                title="View details & Call/Message options"
                              >
                                <Eye size={16} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq)}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 shadow-sm cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {inquiries.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-muted-foreground font-medium"
                          >
                            No customer inquiries received at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === "accounts" ? (
                /* Account Requests Table */
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold w-20">S.no</th>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Email ID</th>
                        <th className="px-6 py-4 font-semibold">Applied Date</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountRequests.map((req, idx) => (
                        <tr
                          key={req._id}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {req.name}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {req.email}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApproveClick(req)}
                                className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20 shadow-sm cursor-pointer"
                                title="Approve Request"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectClick(req)}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 shadow-sm cursor-pointer"
                                title="Reject Request"
                              >
                                <RejectIcon size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {accountRequests.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-muted-foreground font-medium"
                          >
                            No pending account requests at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === "profiles" ? (
                /* Profile Change Requests Table */
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold w-20">S.no</th>
                        <th className="px-6 py-4 font-semibold">Employee Name & ID</th>
                        <th className="px-6 py-4 font-semibold">Requested Changes</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileRequests.map((req, idx) => {
                        const changes = Object.entries(req.requestedData || {}).filter(([k, v]) => v && v !== req.currentData?.[k]);
                        return (
                          <tr
                            key={req._id}
                            className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-muted-foreground">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-foreground">{req.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{req.employeeCode || req.employeeId}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1 text-xs">
                                {changes.map(([k, v]) => (
                                  <div key={k} className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-foreground">
                                    <span className="font-semibold text-muted-foreground capitalize">{k}:</span> {v}
                                  </div>
                                ))}
                                {changes.length === 0 && <span className="text-muted-foreground">No field changes</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                req.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                req.status === "approved" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {req.status === "pending" && (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveProfileChange(req)}
                                    className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20 shadow-sm cursor-pointer"
                                    title="Approve Changes"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectProfileChange(req)}
                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 shadow-sm cursor-pointer"
                                    title="Reject Changes"
                                  >
                                    <RejectIcon size={18} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {profileRequests.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-muted-foreground font-medium"
                          >
                            No pending profile change requests right now.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Customer Inquiry Detailed View Modal with Call & Message Icons */}
      <AnimatePresence>
        {isViewOpen && selectedInquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto relative p-6 md:p-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                      {selectedInquiry.projectName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Inquiry submitted on{" "}
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Personal & Contact Section with Phone and 2 Action Icons underneath */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User size={14} /> Contact Information & Client Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Full Name
                    </span>
                    <span className="font-bold text-foreground text-base">
                      {selectedInquiry.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Primary Email ID
                    </span>
                    <span className="font-semibold text-foreground break-all">
                      {selectedInquiry.email}
                    </span>
                  </div>

                  {/* Phone Number with 2 Action Icons Underneath */}
                  <div className="sm:col-span-2 bg-background p-4 rounded-xl border border-border/80 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Registered Phone Number
                        </span>
                        <span className="font-extrabold text-foreground text-lg tracking-wide">
                          {selectedInquiry.phoneCountryCode || "+1"}{" "}
                          {selectedInquiry.phoneNumber}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                        Primary Contact
                      </span>
                    </div>

                    {/* 2 Icons underneath the Phone: Call & Message */}
                    <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground mr-1">
                        Admin Action Buttons:
                      </span>

                      {/* 1. Call Icon Button */}
                      <a
                        href={`tel:${selectedInquiry.phoneCountryCode || "+1"}${selectedInquiry.phoneNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                      >
                        <PhoneCall size={15} className="group-hover:rotate-12 transition-transform" />
                        <span>Call Client</span>
                      </a>

                      {/* 2. Message Icon Button (opens Gmail Composer) */}
                      <button
                        type="button"
                        onClick={() => openInquiryMessage(selectedInquiry)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                      >
                        <Mail size={15} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>Message / Email (Gmail Composer)</span>
                      </button>
                    </div>
                  </div>

                  {selectedInquiry.altPhoneNumber && (
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        Alternate Phone
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedInquiry.altPhoneCountryCode || "+1"}{" "}
                        {selectedInquiry.altPhoneNumber}
                      </span>
                    </div>
                  )}

                  {selectedInquiry.altEmail && (
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        Alternate Email ID
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedInquiry.altEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Specifications Section */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Briefcase size={14} /> Project Requirements & Specs
                </h4>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Project Details & Description
                    </span>
                    <div className="mt-1 p-4 bg-background rounded-xl border border-border/60 text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.projectDetails || "No detailed specifications provided."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-background p-3 rounded-xl border border-border/60">
                      <span className="text-xs text-muted-foreground block font-medium flex items-center gap-1">
                        <DollarSign size={13} className="text-emerald-500" /> Budget Range
                      </span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {selectedInquiry.budgetRange ? formatAmount(selectedInquiry.budgetRange) : "Flexible"} ({selectedInquiry.currency || "USD"})
                      </span>
                    </div>

                    <div className="bg-background p-3 rounded-xl border border-border/60">
                      <span className="text-xs text-muted-foreground block font-medium flex items-center gap-1">
                        <Calendar size={13} className="text-blue-500" /> Preferable Deadline
                      </span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {selectedInquiry.deadline || "Not specified"}
                      </span>
                    </div>

                    <div className="bg-background p-3 rounded-xl border border-border/60">
                      <span className="text-xs text-muted-foreground block font-medium flex items-center gap-1">
                        <FileText size={13} className="text-purple-500" /> Attached File
                      </span>
                      {selectedInquiry.fileName ? (
                        <span className="font-bold text-purple-500 hover:underline truncate block mt-0.5">
                          {selectedInquiry.fileName}
                        </span>
                      ) : (
                        <span className="font-medium text-muted-foreground italic mt-0.5 block">
                          No file attached
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleDeleteInquiry(selectedInquiry)}
                  className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={15} /> Delete Inquiry
                </button>
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Request Approval Modal */}
      <ApproveRequestModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        request={selectedAccountReq}
        onSuccess={() => {
          setIsApproveOpen(false);
          fetchData();
        }}
      />

      {/* Gmail-Style Email Composer Modal */}
      <GmailComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialTo={composerTo}
        initialSubject={composerSubject}
        relatedInquiryId={composerInquiryId}
        onSuccess={() => {
          fetchData();
        }}
      />
    </>
  );
}
