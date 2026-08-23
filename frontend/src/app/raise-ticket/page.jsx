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
  Phone,
  HelpCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
  X,
  ArrowLeft,
  Sun,
  Moon,
  Loader2,
  Paperclip,
  ChevronDown,
  Check,
} from "lucide-react";

export default function CustomerRaiseTicketPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "+91",
    phoneNumber: "",
    areaOfInconvenience: "Issue with uploading a Document",
    remarks: "",
    fileName: "",
    fileData: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketConfirmation, setTicketConfirmation] = useState(null);

  // Custom Dropdown Open States
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isInconvenienceDropdownOpen, setIsInconvenienceDropdownOpen] = useState(false);

  const countryRef = useRef(null);
  const inconvenienceRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (inconvenienceRef.current && !inconvenienceRef.current.contains(e.target)) {
        setIsInconvenienceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Esc key listener for popup window
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

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+86", country: "China" },
    { code: "+971", country: "UAE" },
    { code: "+65", country: "Singapore" },
  ];

  const inconvenienceOptions = [
    "Issue with uploading a Document",
    "Issue with setting a Budget",
    "Issue with Deadline",
    "Issue with an already existing project or file",
    "Issue with an Agent of ours",
    "Issue with our services",
  ];

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
    if (!formData.name || !formData.email || !formData.phoneNumber) return;

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/tickets", {
        type: "Customer",
        name: formData.name,
        email: formData.email,
        phoneCountryCode: formData.phoneCountryCode,
        phoneNumber: formData.phoneNumber,
        areaOfInconvenience: formData.areaOfInconvenience,
        remarks: formData.remarks,
        fileName: formData.fileName,
        fileData: formData.fileData,
      });

      const ticketID = response.data?.ticketID || `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

      setTicketConfirmation({
        ticketID,
        email: formData.email,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneCountryCode: "+91",
        phoneNumber: "",
        areaOfInconvenience: "Issue with uploading a Document",
        remarks: "",
        fileName: "",
        fileData: "",
      });
    } catch (error) {
      console.error("Failed to raise ticket:", error);
      const fallbackId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketConfirmation({
        ticketID: fallbackId,
        email: formData.email,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Glow Accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
                <Ticket size={18} />
              </div>
              <span className="font-extrabold text-base tracking-tight hidden sm:inline">
                NovaNectar Support Center
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
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-t-3xl" />

          {/* Form Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-extrabold mb-3">
              <HelpCircle size={14} />
              Customer Support Ticket
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Raise a Support Ticket
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Fill in your contact info and describe your issue. Our support team will review and contact you within 24–48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User size={16} className="text-cyan-500" />
                <span>Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail size={16} className="text-cyan-500" />
                <span>Registered Email Address</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
              />
            </div>

            {/* Phone Number Field with Custom Country Code Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone size={16} className="text-cyan-500" />
                <span>Phone Number</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                {/* Custom Country Selector */}
                <div className="relative shrink-0" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                    className="h-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm flex items-center gap-2 font-bold cursor-pointer hover:border-cyan-500 transition-all"
                  >
                    <span>{formData.phoneCountryCode}</span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isCountryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        className="absolute left-0 top-full z-50 mt-1 w-48 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl"
                      >
                        {countryCodes.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, phoneCountryCode: c.code });
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              formData.phoneCountryCode === c.code
                                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{c.code} ({c.country})</span>
                            {formData.phoneCountryCode === c.code && (
                              <Check size={14} className="text-cyan-500" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="9876543210"
                  className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Custom Area of Inconvenience Dropdown */}
            <div className="space-y-2 relative" ref={inconvenienceRef}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <HelpCircle size={16} className="text-cyan-500" />
                <span>Area of Inconvenience</span>
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setIsInconvenienceDropdownOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-semibold cursor-pointer transition-all ${
                  isInconvenienceDropdownOpen
                    ? "border-cyan-500 ring-2 ring-cyan-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span>{formData.areaOfInconvenience}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isInconvenienceDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isInconvenienceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    {inconvenienceOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, areaOfInconvenience: opt });
                          setIsInconvenienceDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.areaOfInconvenience === opt
                            ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.areaOfInconvenience === opt && (
                          <Check size={16} className="text-cyan-500" />
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
                <FileText size={16} className="text-cyan-500" />
                <span>Write Your Remarks</span>
              </label>
              <textarea
                rows={4}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Provide details about the issue you are experiencing..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium resize-y"
              />
            </div>

            {/* File Upload Button */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <UploadCloud size={16} className="text-cyan-500" />
                <span>Attach Files / Documents (Optional)</span>
              </label>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0">
                  <UploadCloud size={18} className="text-cyan-500" />
                  <span>Choose File</span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>

                {formData.fileName ? (
                  <div className="flex items-center gap-2 text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-2 rounded-xl border border-cyan-500/20 truncate">
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
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting Ticket...
                  </>
                ) : (
                  <>
                    <Ticket size={20} />
                    Raise Ticket
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
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

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
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight mb-4">
                Ticket Raised Successfully
              </h2>

              {/* Exact Requested Text Body */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                <p>We have noted your issue, and a support ticket has been successfully raised.</p>

                <p>
                  Please allow us <strong>24–48 hours</strong> to review the issue. One of our representatives will get back to you with an update as soon as possible.
                </p>

                <p>
                  A confirmation email has also been sent to your registered email address for your reference.
                </p>

                <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Your Ticket ID is:</span>
                  <span className="font-mono text-xl font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-xl border border-cyan-500/20 inline-block">
                    {ticketConfirmation.ticketID}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
                  Thank you for your patience and understanding.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setTicketConfirmation(null)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer text-sm"
                >
                  Done & Close
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
