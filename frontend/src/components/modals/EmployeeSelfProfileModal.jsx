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
import { useTheme } from "next-themes";
import { api } from "@/lib/api";

export function EmployeeSelfProfileModal({
  isOpen,
  onClose,
  userInfo,
  onUpdate,
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = useState("details");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [passwordStatus, setPasswordStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const [changeForm, setChangeForm] = useState({
    firstName: "",
    lastName: "",
    contactEmail: "",
    designation: "",
    department: "",
    reason: "",
  });

  const [changeStatus, setChangeStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

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
      setPasswordStatus({
        loading: false,
        error: "New password must be at least 6 characters.",
        success: "",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        loading: false,
        error: "New passwords do not match.",
        success: "",
      });
      return;
    }

    setPasswordStatus({ loading: true, error: "", success: "" });

    try {
      await api.put("/api/auth/password", {
        currentPassword,
        newPassword,
      });

      setPasswordStatus({
        loading: false,
        error: "",
        success: "Password updated successfully!",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordStatus({
        loading: false,
        error:
          err.response?.data?.message ||
          "Failed to update password. Check your current password.",
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
        name:
          userInfo.name ||
          `${changeForm.firstName} ${changeForm.lastName}`.trim() ||
          "Employee",
        email:
          userInfo.email ||
          changeForm.contactEmail ||
          "employee@company.com",
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
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to submit change request.",
        success: "",
      });
    }
  };

  if (!isOpen) return null;

  const modalClass = isDark
    ? "relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl"
    : "relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white text-[#260b45] shadow-2xl shadow-violet-500/20";

  const headerClass = isDark
    ? "sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-6"
    : "sticky top-0 z-10 flex items-center justify-between border-b border-violet-100 bg-white p-6";

  const tabWrapperClass = isDark
    ? "flex gap-4 border-b border-slate-800 bg-slate-900/50 px-6 pt-2 text-xs font-bold"
    : "flex gap-4 border-b border-violet-100 bg-[#fbf7ff] px-6 pt-2 text-xs font-bold";

  const contentClass = isDark
    ? "flex-1 space-y-6 overflow-y-auto bg-slate-900 p-6"
    : "flex-1 space-y-6 overflow-y-auto bg-[#fbf7ff] p-6";

  const detailCardClass = isDark
    ? "space-y-1 rounded-2xl border border-slate-800 bg-slate-800/40 p-4 shadow-none"
    : "space-y-1 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm shadow-violet-500/10";

  const detailLabelClass = isDark
    ? "block text-xs font-semibold uppercase tracking-wider text-slate-400"
    : "block text-xs font-semibold uppercase tracking-wider text-[#7a6692]";

  const detailIconLabelClass = isDark
    ? "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"
    : "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a6692]";

  const detailValueClass = isDark
    ? "text-sm font-semibold text-slate-200"
    : "text-sm font-semibold text-[#260b45]";

  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
    : "w-full rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm text-[#260b45] placeholder:text-[#7a6692] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/15";

  const smallInputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
    : "w-full rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs text-[#260b45] placeholder:text-[#7a6692] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/15";

  const formLabelClass = isDark
    ? "text-xs font-semibold uppercase tracking-wider text-slate-300"
    : "text-xs font-semibold uppercase tracking-wider text-[#7a6692]";

  const smallFormLabelClass = isDark
    ? "text-xs font-semibold text-slate-400"
    : "text-xs font-semibold text-[#7a6692]";

  const closeButtonClass = isDark
    ? "rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
    : "rounded-full p-2 text-[#7a6692] transition-colors hover:bg-violet-50 hover:text-[#260b45]";

  const inactiveTabClass = isDark
    ? "border-transparent text-slate-400 hover:text-slate-200"
    : "border-transparent text-[#7a6692] hover:text-[#260b45]";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={modalClass}
        >
          {/* Header */}
          <div className={headerClass}>
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-lg font-extrabold text-white shadow-lg">
                {(userInfo?.name || "E").charAt(0).toUpperCase()}
              </div>

              <div>
                <h3
                  className={
                    isDark
                      ? "text-xl font-bold tracking-tight text-white"
                      : "text-xl font-bold tracking-tight text-[#260b45]"
                  }
                >
                  {userInfo?.name || "Employee Profile"}
                </h3>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="rounded border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 font-mono text-xs font-bold text-blue-500">
                    {userInfo?.id || userInfo?.employeeCode || "EMP"}
                  </span>

                  <span
                    className={
                      isDark ? "text-xs text-slate-400" : "text-xs text-[#7a6692]"
                    }
                  >
                    {userInfo?.designation || "Sales Executive"}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={onClose} className={closeButtonClass}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className={tabWrapperClass}>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-2 pb-3 transition-all ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-500"
                  : inactiveTabClass
              }`}
            >
              <User size={14} /> Profile Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-2 pb-3 transition-all ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-500"
                  : inactiveTabClass
              }`}
            >
              <KeyRound size={14} /> Change Password
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requestChange")}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-2 pb-3 transition-all ${
                activeTab === "requestChange"
                  ? "border-purple-500 text-purple-500"
                  : inactiveTabClass
              }`}
            >
              <Edit3 size={14} /> Request Profile Change
            </button>
          </div>

          {/* Content */}
          <div className={contentClass}>
            {activeTab === "details" && (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={detailCardClass}>
                    <span className={detailLabelClass}>Full Name</span>

                    <p
                      className={
                        isDark
                          ? "text-base font-bold text-white"
                          : "text-base font-bold text-[#260b45]"
                      }
                    >
                      {userInfo?.name || "N/A"}
                    </p>
                  </div>

                  <div className={detailCardClass}>
                    <span className={detailLabelClass}>Employee ID</span>

                    <p className="font-mono text-base font-bold text-blue-500">
                      {userInfo?.id || userInfo?.employeeCode || "EMP001"}
                    </p>
                  </div>

                  <div className={detailCardClass}>
                    <span className={detailIconLabelClass}>
                      <Briefcase size={14} className="text-amber-400" />
                      Designation
                    </span>

                    <p className={detailValueClass}>
                      {userInfo?.designation || "Sales Executive"}
                    </p>
                  </div>

                  <div className={detailCardClass}>
                    <span className={detailIconLabelClass}>
                      <Building2 size={14} className="text-teal-400" />
                      Department
                    </span>

                    <p className={detailValueClass}>
                      {userInfo?.department || "Sales"}
                    </p>
                  </div>

                  <div className={detailCardClass}>
                    <span className={detailIconLabelClass}>
                      <Mail size={14} className="text-emerald-400" />
                      Email Address
                    </span>

                    <p
                      className={
                        isDark
                          ? "break-all text-sm font-medium text-slate-200"
                          : "break-all text-sm font-medium text-[#260b45]"
                      }
                    >
                      {userInfo?.email ||
                        userInfo?.contactEmail ||
                        "rahul.sharma@novanectar.com"}
                    </p>
                  </div>

                  <div className={detailCardClass}>
                    <span className={detailIconLabelClass}>
                      <Calendar size={14} className="text-purple-400" />
                      Joining Date
                    </span>

                    <p className={detailValueClass}>
                      {userInfo?.joiningDate || "June 2026"}
                    </p>
                  </div>
                </div>

                <div
                  className={
                    isDark
                      ? "flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-300"
                      : "flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700"
                  }
                >
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />

                  <div>
                    <span
                      className={
                        isDark
                          ? "mb-0.5 block font-bold text-white"
                          : "mb-0.5 block font-bold text-[#260b45]"
                      }
                    >
                      Note on Profile Updates
                    </span>
                    Your employee records are synchronized with HR and
                    Management systems. To update official details like Name or
                    Department, please submit a modification request via the
                    &quot;Request Profile Change&quot; tab.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <form
                onSubmit={handlePasswordSubmit}
                className="mx-auto max-w-md space-y-4 py-2"
              >
                <div className="space-y-1.5">
                  <label className={formLabelClass}>Current Password</label>

                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className={`${inputClass} pr-10`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className={
                        isDark
                          ? "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          : "absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6692] hover:text-[#260b45]"
                      }
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={formLabelClass}>New Password</label>

                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={formLabelClass}>Confirm New Password</label>

                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className={inputClass}
                  />
                </div>

                {passwordStatus.error && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{passwordStatus.error}</span>
                  </div>
                )}

                {passwordStatus.success && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
                    <Check size={16} className="shrink-0" />
                    <span>{passwordStatus.success}</span>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
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
              <form
                onSubmit={handleChangeRequestSubmit}
                className="mx-auto max-w-lg space-y-4 py-2 text-sm"
              >
                <div
                  className={
                    isDark
                      ? "rounded-2xl border border-purple-500/20 bg-purple-500/10 p-3.5 text-xs text-purple-300"
                      : "rounded-2xl border border-purple-100 bg-purple-50 p-3.5 text-xs text-purple-700"
                  }
                >
                  Fill in the details you would like to update. Once submitted,
                  your request will appear on the Admin Dashboard under Profile
                  Change Requests for approval.
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className={smallFormLabelClass}>First Name</label>

                    <input
                      type="text"
                      value={changeForm.firstName}
                      onChange={(e) =>
                        setChangeForm({
                          ...changeForm,
                          firstName: e.target.value,
                        })
                      }
                      className={smallInputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={smallFormLabelClass}>Last Name</label>

                    <input
                      type="text"
                      value={changeForm.lastName}
                      onChange={(e) =>
                        setChangeForm({
                          ...changeForm,
                          lastName: e.target.value,
                        })
                      }
                      className={smallInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={smallFormLabelClass}>Contact Email</label>

                  <input
                    type="email"
                    value={changeForm.contactEmail}
                    onChange={(e) =>
                      setChangeForm({
                        ...changeForm,
                        contactEmail: e.target.value,
                      })
                    }
                    className={smallInputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className={smallFormLabelClass}>Designation</label>

                    <input
                      type="text"
                      value={changeForm.designation}
                      onChange={(e) =>
                        setChangeForm({
                          ...changeForm,
                          designation: e.target.value,
                        })
                      }
                      className={smallInputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={smallFormLabelClass}>Department</label>

                    <input
                      type="text"
                      value={changeForm.department}
                      onChange={(e) =>
                        setChangeForm({
                          ...changeForm,
                          department: e.target.value,
                        })
                      }
                      className={smallInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={smallFormLabelClass}>
                    Reason / Note for Admin
                  </label>

                  <textarea
                    rows={2}
                    placeholder="e.g. Promoted to Team Lead, changed contact email, etc."
                    value={changeForm.reason}
                    onChange={(e) =>
                      setChangeForm({
                        ...changeForm,
                        reason: e.target.value,
                      })
                    }
                    className={smallInputClass}
                  />
                </div>

                {changeStatus.error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {changeStatus.error}
                  </div>
                )}

                {changeStatus.success && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                    {changeStatus.success}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changeStatus.loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-md transition-all hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
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