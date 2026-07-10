"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  KeyRound,
  Mail,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ShieldCheck,
  Edit3,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function EmployeeSelfProfileModal({ isOpen, onClose, userInfo, onUpdate }) {
  const [activeTab, setActiveTab] = useState("details"); // "details" | "password" | "requestChange"
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: "" });

  // Profile Change Request state
  const [changeForm, setChangeForm] = useState({
    firstName: "",
    lastName: "",
    contactEmail: "",
    designation: "",
    department: "",
    reason: "",
  });
  const [changeStatus, setChangeStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    if (isOpen && userInfo) {
      const names = (userInfo.name || "").split(" ");
      setChangeForm({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        contactEmail: userInfo.email || userInfo.contactEmail || "",
        designation: userInfo.designation || "",
        department: userInfo.department || "",
        reason: "",
      });
      setPasswordStatus({ loading: false, error: "", success: "" });
      setChangeStatus({ loading: false, error: "", success: "" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen, userInfo]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({ loading: false, error: "New password must be at least 6 characters.", success: "" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ loading: false, error: "New passwords do not match.", success: "" });
      return;
    }

    setPasswordStatus({ loading: true, error: "", success: "" });
    try {
      await api.put("/api/auth/password", {
        currentPassword,
        newPassword,
      });
      setPasswordStatus({ loading: false, error: "", success: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordStatus({
        loading: false,
        error: err.response?.data?.message || "Failed to update password. Check your current password.",
        success: "",
      });
    }
  };

  const handleChangeRequestSubmit = async (e) => {
    e.preventDefault();
    setChangeStatus({ loading: true, error: "", success: "" });
    try {
      await api.post("/api/profileChangeRequests", {
        employeeId: userInfo.id || userInfo._id,
        employeeCode: userInfo.employeeCode || userInfo.id || "EMP",
        name: userInfo.name || `${changeForm.firstName} ${changeForm.lastName}`.trim() || "Employee",
        email: userInfo.email || changeForm.contactEmail || "employee@company.com",
        currentData: {
          name: userInfo.name,
          email: userInfo.email,
          designation: userInfo.designation,
          department: userInfo.department,
        },
        requestedData: {
          firstName: changeForm.firstName,
          lastName: changeForm.lastName,
          contactEmail: changeForm.contactEmail,
          designation: changeForm.designation,
          department: changeForm.department,
        },
        requestedChanges: {
          firstName: changeForm.firstName,
          lastName: changeForm.lastName,
          contactEmail: changeForm.contactEmail,
          designation: changeForm.designation,
          department: changeForm.department,
          reason: changeForm.reason,
        },
        reason: changeForm.reason,
      });
      setChangeStatus({
        loading: false,
        error: "",
        success: "Profile change request submitted to Admin for review!",
      });
    } catch (err) {
      setChangeStatus({
        loading: false,
        error: err.response?.data?.error || err.response?.data?.message || "Failed to submit change request.",
        success: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-100 relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-lg shadow-lg">
                {(userInfo?.name || "E").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {userInfo?.name || "Employee Profile"}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                    {userInfo?.id || userInfo?.employeeCode || "EMP"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {userInfo?.designation || "Sales Executive"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-2 gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <User size={14} /> Profile Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <KeyRound size={14} /> Change Password
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("requestChange")}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "requestChange"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Edit3 size={14} /> Request Profile Change
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === "details" && (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Full Name
                    </span>
                    <p className="text-base font-bold text-white">
                      {userInfo?.name || "N/A"}
                    </p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Employee ID
                    </span>
                    <p className="text-base font-mono font-bold text-blue-400">
                      {userInfo?.id || userInfo?.employeeCode || "EMP001"}
                    </p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={14} className="text-amber-400" /> Designation
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {userInfo?.designation || "Sales Executive"}
                    </p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={14} className="text-teal-400" /> Department
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {userInfo?.department || "Sales"}
                    </p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={14} className="text-emerald-400" /> Email Address
                    </span>
                    <p className="text-sm font-medium text-slate-200 break-all">
                      {userInfo?.email || userInfo?.contactEmail || "rahul.sharma@novanectar.com"}
                    </p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={14} className="text-purple-400" /> Joining Date
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {userInfo?.joiningDate || "June 2026"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white mb-0.5">Note on Profile Updates</span>
                    Your employee records are synchronized with HR and Management systems. To update official details like Name or Department, please submit a modification request via the &quot;Request Profile Change&quot; tab.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md mx-auto py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {passwordStatus.error && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{passwordStatus.error}</span>
                  </div>
                )}

                {passwordStatus.success && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                    <Check size={16} className="shrink-0" />
                    <span>{passwordStatus.success}</span>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {passwordStatus.loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} />
                        <span>Save New Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "requestChange" && (
              <form onSubmit={handleChangeRequestSubmit} className="space-y-4 max-w-lg mx-auto py-2 text-sm">
                <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-xs text-purple-300">
                  Fill in the details you would like to update. Once submitted, your request will appear on the Admin Dashboard under Profile Change Requests for approval.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">First Name</label>
                    <input
                      type="text"
                      value={changeForm.firstName}
                      onChange={(e) => setChangeForm({ ...changeForm, firstName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Last Name</label>
                    <input
                      type="text"
                      value={changeForm.lastName}
                      onChange={(e) => setChangeForm({ ...changeForm, lastName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Contact Email</label>
                  <input
                    type="email"
                    value={changeForm.contactEmail}
                    onChange={(e) => setChangeForm({ ...changeForm, contactEmail: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Designation</label>
                    <input
                      type="text"
                      value={changeForm.designation}
                      onChange={(e) => setChangeForm({ ...changeForm, designation: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Department</label>
                    <input
                      type="text"
                      value={changeForm.department}
                      onChange={(e) => setChangeForm({ ...changeForm, department: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Reason / Note for Admin</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Promoted to Team Lead, changed contact email, etc."
                    value={changeForm.reason}
                    onChange={(e) => setChangeForm({ ...changeForm, reason: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                  />
                </div>

                {changeStatus.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                    {changeStatus.error}
                  </div>
                )}

                {changeStatus.success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                    {changeStatus.success}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changeStatus.loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {changeStatus.loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Change Request to Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
