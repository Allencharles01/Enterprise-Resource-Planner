"use client";

import { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Mail,
  Briefcase,
  Building2,
  Users,
  Loader2,
  Copy,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { ManagerDetailsModal } from "./ManagerDetailsModal";
import { ChatWindowModal } from "./ChatWindowModal";
import { GmailComposerModal } from "./GmailComposerModal";

export function EmployeeDetailsModal({ employee, isOpen, onClose, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  // Custom states for Copy, Message and Email functionality
  const [currentUser, setCurrentUser] = useState(null);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [emailComposerTo, setEmailComposerTo] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    employeeCode: "",
    companyEmail: "",
    contactEmail: "",
    manager: "",
    designation: "",
    department: "",
  });

  const allDepartments = [
    "Frontend",
    "Backend",
    "Database Management",
    "Sales",
    "Digital Marketing",
    "Testing and QA",
    "Network and Security",
    "Design",
    "Product",
    "HR",
  ];

  const allDesignations = [
    "Project Lead",
    "Supervisor",
    "Frontend Developer",
    "Frontend Engineer",
    "Backend Developer",
    "Database Administrator",
    "QA Analyst",
    "Security Engineer",
    "UI/UX Designer",
    "Product Manager",
    "HR Specialist",
    "Sales Director",
    "Sales Manager",
    "Sales Executive",
    "Account Executive",
    "Business Development Manager",
    "Digital Marketing Director",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Content Strategist",
    "Social Media Manager",
    "PPC Specialist",
  ];

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.personal?.firstName || "",
        lastName:
          employee.personal?.lastName !== "Emp"
            ? employee.personal?.lastName || ""
            : "",
        employeeCode: employee.employeeCode || "",
        companyEmail: employee.work?.companyEmail || "NA",
        contactEmail: employee.personal?.contactEmail || "NA",
        manager: employee.work?.manager || "NA",
        designation: employee.work?.designation || "Frontend Developer",
        department: employee.work?.department || "Frontend",
      });
      setIsEditing(false);
      setShowPassword(false);
    }
  }, [employee]);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/api/auth/me")
        .then((res) => {
          const u = res.data?.user || res.data;
          if (u) {
            setCurrentUser({
              id: u.id || u._id || (u.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
              name: u.name || "System Admin",
              code: u.employeeCode || u.username || (u.role === "admin" ? "allchar" : "EMP"),
              role: u.role || "admin",
              email: u.email || u.workEmail || u.username || (u.role === "admin" ? "allchar" : ""),
            });
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(form.employeeCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChat = () => {
    const recipient = {
      id: employee.id || employee._id,
      _id: employee.id || employee._id,
      employeeId: employee.id || employee._id,
      employeeCode: employee.employeeCode || employee.employeeNumber,
      code: employee.employeeCode || employee.employeeNumber,
      name: `${employee.personal?.firstName || ""} ${employee.personal?.lastName !== "Emp" ? employee.personal?.lastName || "" : ""}`.trim(),
      designation: employee.work?.designation || "",
      department: employee.work?.department || "",
    };
    setChatRecipient(recipient);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !selectedManager) {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isEditing, selectedManager]);

  if (!isOpen || !employee) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const targetId = employee.id || employee._id;
      const res = await api.put(`/api/employees/${targetId}`, {
        employeeCode: form.employeeCode,
        personal: {
          firstName: form.firstName,
          lastName: form.lastName || "Emp",
          contactEmail: form.contactEmail,
        },
        work: {
          companyEmail: form.companyEmail,
          manager: form.manager,
          designation: form.designation,
          department: form.department,
        },
      });

      if (res.data.success) {
        setIsEditing(false);
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      console.error("Failed to update employee details:", err);
      alert("Error saving updates. Please check console or try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentPassword = `${employee.employeeCode}_`;

  return (
    <AnimatePresence>
      <div
        onClick={() => {
          if (!isEditing) onClose();
        }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 25 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-100 relative p-6 md:p-8 max-h-[92vh] overflow-y-auto"
        >
          {/* Top Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-t-3xl" />

          {/* Header & Right Side Action Buttons */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6 mt-1">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 font-bold text-xl">
                {form.firstName.charAt(0).toUpperCase() || "E"}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Employee Details
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  ID: {employee.employeeNumber || form.employeeCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500 hover:text-black font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs transition-all shadow-sm cursor-pointer group"
                >
                  <Edit3 size={15} className="group-hover:scale-110 transition-transform" />
                  <span>Edit</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm shrink-0"
                title="Close (Esc)"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSave} className="space-y-5 text-sm">
            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Employee Name */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <User size={14} className="text-blue-400" />
                  Employee Name
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-base font-bold text-white">
                    {form.firstName} {form.lastName}
                  </p>
                )}
              </div>

              {/* Employee ID */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <KeyRound size={14} className="text-blue-400" />
                  Employee ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.employeeCode}
                    onChange={(e) =>
                      setForm({ ...form, employeeCode: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                    required
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-base font-mono font-bold text-blue-400">
                      {form.employeeCode}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="p-1.5 rounded-lg bg-slate-805 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title={copied ? "Copied!" : "Copy Employee ID"}
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenChat}
                        className="p-1.5 rounded-lg bg-slate-805 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Message Employee"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Email */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Mail size={14} className="text-blue-400" />
                  Company Email
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.companyEmail}
                    onChange={(e) =>
                      setForm({ ...form, companyEmail: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 break-all">
                      {form.companyEmail}
                    </p>
                    {form.companyEmail && form.companyEmail !== "NA" && (
                      <button
                        type="button"
                        onClick={() => setEmailComposerTo(form.companyEmail)}
                        className="p-1.5 rounded-lg bg-slate-805 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                        title="Open Company Email Composer"
                      >
                        <Mail size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Mail size={14} className="text-emerald-400" />
                  Contact Email
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm({ ...form, contactEmail: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 break-all">
                      {form.contactEmail}
                    </p>
                    {form.contactEmail && form.contactEmail !== "NA" && (
                      <button
                        type="button"
                        onClick={() => setEmailComposerTo(form.contactEmail)}
                        className="p-1.5 rounded-lg bg-slate-805 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer shrink-0"
                        title="Open Company Email Composer"
                      >
                        <Mail size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Password with Eye Toggle */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <KeyRound size={14} className="text-purple-400" />
                    Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white transition-colors p-0.5 flex items-center gap-1 text-[11px] font-normal"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </label>
                <div className="flex items-center justify-between pt-0.5 font-mono">
                  <span className="text-base text-slate-200 font-bold tracking-wider">
                    {showPassword ? currentPassword : "••••••••••••"}
                  </span>
                </div>
              </div>

              {/* Manager Name (Clickable to pop up window!) */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Users size={14} className="text-blue-400" />
                  Manager Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.manager}
                    onChange={(e) =>
                      setForm({ ...form, manager: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Manager Name"
                  />
                ) : (
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedManager(form.manager)}
                      className="text-sm font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer text-left"
                      title="Click to view Manager details"
                    >
                      {form.manager || "Not Assigned"}
                    </button>
                  </div>
                )}
              </div>

              {/* Designation (Dropdown when editing) */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Briefcase size={14} className="text-amber-400" />
                  Designation
                </label>
                {isEditing ? (
                  <select
                    value={form.designation}
                    onChange={(e) =>
                      setForm({ ...form, designation: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {!allDesignations.includes(form.designation) && (
                      <option value={form.designation}>{form.designation}</option>
                    )}
                    {allDesignations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-200">
                    <span className="px-3 py-1 bg-blue-500/15 text-blue-300 rounded-full border border-blue-500/30 text-xs inline-block">
                      {form.designation}
                    </span>
                  </p>
                )}
              </div>

              {/* Department (Dropdown when editing) */}
              <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Building2 size={14} className="text-teal-400" />
                  Department
                </label>
                {isEditing ? (
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {!allDepartments.includes(form.department) && (
                      <option value={form.department}>{form.department}</option>
                    )}
                    {allDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-200">
                    {form.department}
                  </p>
                )}
              </div>
            </div>

            {/* Save & Cancel Footer Buttons in Edit Mode */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>

      {/* Nested Manager Details Modal */}
      <ManagerDetailsModal
        isOpen={Boolean(selectedManager)}
        managerName={selectedManager}
        onClose={() => setSelectedManager(null)}
      />

      {/* Direct Chat Window Modal */}
      <ChatWindowModal
        isOpen={Boolean(chatRecipient)}
        onClose={() => setChatRecipient(null)}
        currentUser={currentUser}
        recipientUser={chatRecipient}
      />

      {/* Gmail Composer Modal */}
      <GmailComposerModal
        isOpen={Boolean(emailComposerTo)}
        onClose={() => setEmailComposerTo("")}
        initialTo={emailComposerTo}
        initialSubject=""
        currentUser={currentUser}
        onSuccess={() => {
          setEmailComposerTo("");
        }}
      />
    </AnimatePresence>
  );
}
