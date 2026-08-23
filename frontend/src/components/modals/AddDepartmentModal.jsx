"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  CheckCircle2,
  ChevronDown,
  Check,
  Briefcase,
  Users,
  Code,
  DollarSign,
  Headphones,
  Crown,
  Share2,
} from "lucide-react";

export function AddDepartmentModal({ isOpen, onClose, onDepartmentAdded }) {
  const [departmentName, setDepartmentName] = useState("");
  const [employeeSourceDept, setEmployeeSourceDept] = useState("Sales");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const existingDepartments = [
    { name: "Sales", icon: Briefcase, color: "text-amber-500 bg-amber-500/10" },
    { name: "Digital Marketing", icon: Share2, color: "text-purple-500 bg-purple-500/10" },
    { name: "Executive Suite", icon: Crown, color: "text-yellow-500 bg-yellow-500/10" },
    { name: "Engineering", icon: Code, color: "text-blue-500 bg-blue-500/10" },
    { name: "Human Resources", icon: Users, color: "text-rose-500 bg-rose-500/10" },
    { name: "Finance", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "IT & Operations", icon: Headphones, color: "text-cyan-500 bg-cyan-500/10" },
  ];

  // Esc key listener & click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isDropdownOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return;

    onDepartmentAdded({
      name: departmentName.trim(),
      employeeSourceDept,
      path: `/${departmentName.trim().toLowerCase().replace(/\s+/g, "-")}`,
      isCustom: true,
    });

    setDepartmentName("");
    setIsDropdownOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentSelectedDept = existingDepartments.find(
    (d) => d.name === employeeSourceDept
  ) || existingDepartments[0];

  const SelectedIcon = currentSelectedDept.icon;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-visible relative p-6 md:p-8 text-slate-900 dark:text-slate-100"
        >
          {/* Top Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 mt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-inner">
                <Building2 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Add Department
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Create a new organizational department
                </p>
              </div>
            </div>

            {/* Red Circle X Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md shrink-0 cursor-pointer"
              title="Close (Esc)"
            >
              <X size={18} className="stroke-[3]" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Department Name</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="e.g. Quality Assurance"
                className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 transition-all outline-none placeholder:text-slate-400 font-semibold"
              />
            </div>

            {/* Premium Custom Dropdown Menu */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Which department Employee should be added here?
              </label>

              {/* Custom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 border transition-all rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 font-semibold cursor-pointer shadow-sm ${
                  isDropdownOpen
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${currentSelectedDept.color}`}>
                    <SelectedIcon size={16} />
                  </div>
                  <span className="font-bold">{employeeSourceDept}</span>
                </div>

                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-400"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              {/* Custom Dropdown Menu List */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-[#111625]/95 backdrop-blur-xl p-2 shadow-2xl scrollbar-thin"
                  >
                    {existingDepartments.map((dept) => {
                      const IconComp = dept.icon;
                      const isSelected = dept.name === employeeSourceDept;

                      return (
                        <button
                          key={dept.name}
                          type="button"
                          onClick={() => {
                            setEmployeeSourceDept(dept.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${dept.color}`}>
                              <IconComp size={15} />
                            </div>
                            <span>{dept.name}</span>
                          </div>

                          {isSelected && (
                            <Check size={16} className="text-emerald-500" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Create
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
