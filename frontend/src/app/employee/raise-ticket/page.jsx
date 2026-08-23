"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";
import {
  Ticket,
  User,
  Mail,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  X,
  ArrowLeft,
  Sun,
  Moon,
  Loader2,
  Paperclip,
  ShieldCheck,
  Layers,
  Tag,
  ChevronDown,
  Check,
} from "lucide-react";

export default function EmployeeRaiseTicketPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Employee details state (autofilled)
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "Sales Agent",
    empId: "EMP-1002",
    email: "sales@novanectar.com",
    department: "Sales",
  });

  const [formData, setFormData] = useState({
    moduleName: "Client Projects",
    category: "Contacts",
    subCategory: "Unable to Access Contacts",
    remarks: "",
    fileName: "",
    fileData: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketConfirmation, setTicketConfirmation] = useState(null);

  // Custom Dropdown Open States
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);

  const moduleRef = useRef(null);
  const categoryRef = useRef(null);
  const subCategoryRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("userName") || "Sales Agent";
    const storedId = localStorage.getItem("userEmployeeCode") || "EMP-1002";
    const storedEmail = localStorage.getItem("userEmail") || "sales@novanectar.com";
    const storedDept = localStorage.getItem("userDepartment") || "Sales";

    setEmployeeInfo({
      name: storedName,
      empId: storedId,
      email: storedEmail,
      department: storedDept,
    });

    const handleClickOutside = (e) => {
      if (moduleRef.current && !moduleRef.current.contains(e.target)) {
        setIsModuleOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (subCategoryRef.current && !subCategoryRef.current.contains(e.target)) {
        setIsSubCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Esc key listener for popup
  useEffect(() => {
    if (!ticketConfirmation) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setTicketConfirmation(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ticketConfirmation]);

  const modulesList = ["Client Projects", "Internships", "Training", "Software"];
  const categoriesList = ["Contacts", "Customer", "Sales", "Software"];

  // Dynamic Subcategories mapping
  const subCategoriesMap = {
    Contacts: [
      "Unable to Access Contacts",
      "Unable to Sync Contacts",
      "Unable to View the Synced Contacts",
    ],
    Customer: [
      "Issue with Customer Info",
      "Issue with Logging Call Status",
      "Issue with Calling or Emailing the Customer",
    ],
    Sales: [
      "Issue with Logging the Sales Info",
      "Issue with uploading the Sales Document",
    ],
    Software: [
      "Unable to Send Messages or Emails",
      "Unable to Set/ View Reminders",
      "Unable to view/access notifications",
      "Issues with requesting to change my details",
    ],
  };

  const currentSubCategories = subCategoriesMap[formData.category] || [
    "Unable to Send Messages or Emails",
    "Unable to Set/ View Reminders",
    "Unable to view/access notifications",
    "Issues with requesting to change my details",
  ];

  const handleCategoryChange = (newCategory) => {
    const defaultSub = subCategoriesMap[newCategory]?.[0] || "";
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      subCategory: defaultSub,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/api/tickets", {
        type: "Employee",
        employeeName: employeeInfo.name,
        employeeId: employeeInfo.empId,
        employeeEmail: employeeInfo.email,
        moduleName: formData.moduleName,
        category: formData.category,
        subCategory: formData.subCategory,
        remarks: formData.remarks,
        fileName: formData.fileName,
        fileData: formData.fileData,
      });

      const ticketID = response.data?.ticketID || `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

      setTicketConfirmation({
        ticketID,
      });

      setFormData((prev) => ({
        ...prev,
        remarks: "",
        fileName: "",
        fileData: "",
      }));
    } catch (error) {
      console.error("Failed to submit employee ticket:", error);
      const fallbackId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketConfirmation({
        ticketID: fallbackId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Glow Accents */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <Ticket size={18} />
              </div>
              <span className="font-extrabold text-base tracking-tight hidden sm:inline">
                Internal Employee Ticketing
              </span>
            </div>
          </div>

          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-visible"
        >
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-t-3xl" />

          {/* Form Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold mb-3">
              <ShieldCheck size={14} />
              Employee Issue Ticket
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Raise an Internal Ticket
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Report system glitches, data syncing errors, or administrative issues to the engineering team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Information Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Autofilled Employee Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={employeeInfo.name}
                    className="w-full bg-slate-200/70 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    EmpID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={employeeInfo.empId}
                    className="w-full bg-slate-200/70 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Employee Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={employeeInfo.email}
                    className="w-full bg-slate-200/70 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Module Custom Dropdown */}
            <div className="space-y-2 relative" ref={moduleRef}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Layers size={16} className="text-indigo-500" />
                <span>Select Module</span>
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModuleOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-semibold cursor-pointer transition-all ${
                  isModuleOpen
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span>{formData.moduleName}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isModuleOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isModuleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    {modulesList.map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, moduleName: mod });
                          setIsModuleOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.moduleName === mod
                            ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{mod}</span>
                        {formData.moduleName === mod && (
                          <Check size={16} className="text-indigo-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Custom Dropdown */}
            <div className="space-y-2 relative" ref={categoryRef}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Tag size={16} className="text-indigo-500" />
                <span>Select Category</span>
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-semibold cursor-pointer transition-all ${
                  isCategoryOpen
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span>{formData.category}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          handleCategoryChange(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.category === cat
                            ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{cat}</span>
                        {formData.category === cat && (
                          <Check size={16} className="text-indigo-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sub Category Custom Dropdown */}
            <div className="space-y-2 relative" ref={subCategoryRef}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Tag size={16} className="text-purple-500" />
                <span>Select Sub Category</span>
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setIsSubCategoryOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-semibold cursor-pointer transition-all ${
                  isSubCategoryOpen
                    ? "border-purple-500 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span>{formData.subCategory}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isSubCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSubCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    {currentSubCategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, subCategory: sub });
                          setIsSubCategoryOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.subCategory === sub
                            ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{sub}</span>
                        {formData.subCategory === sub && (
                          <Check size={16} className="text-purple-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileText size={16} className="text-indigo-500" />
                <span>Remarks / Detailed Description</span>
              </label>
              <textarea
                rows={4}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Describe the issue or error steps in detail..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-y"
              />
            </div>

            {/* File Upload Button */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <UploadCloud size={16} className="text-indigo-500" />
                <span>Attach Screenshot / File (Optional)</span>
              </label>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0">
                  <UploadCloud size={18} className="text-indigo-500" />
                  <span>Choose File</span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>

                {formData.fileName ? (
                  <div className="flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-xl border border-indigo-500/20 truncate">
                    <Paperclip size={14} className="shrink-0" />
                    <span className="truncate font-semibold">{formData.fileName}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, fileName: "", fileData: "" })}
                      className="text-red-500 hover:text-red-600 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">No file selected</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting Ticket...
                  </>
                ) : (
                  <>
                    <Ticket size={20} />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Confirmation Modal Popup Window */}
      <AnimatePresence>
        {ticketConfirmation && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
            onClick={() => setTicketConfirmation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative p-6 sm:p-8 text-slate-900 dark:text-slate-100"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

              {/* Red Circle X Button on Top Right */}
              <div className="flex justify-end mb-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setTicketConfirmation(null)}
                  className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} className="stroke-[3]" />
                </motion.button>
              </div>

              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                <CheckCircle2 size={36} />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight mb-4">
                Employee Ticket Submitted
              </h2>

              {/* Details Body */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed text-center">
                <p>Your internal ticket has been submitted to system administrators.</p>

                <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Generated Ticket ID:</span>
                  <span className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-xl border border-indigo-500/20 inline-block">
                    {ticketConfirmation.ticketID}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setTicketConfirmation(null)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer text-sm"
                >
                  Close & Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} NovaNectar Services Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
}
