import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  UserPlus,
  Trash2,
  ShieldMinus,
  User,
  Hash,
  Mail,
  Building2,
  Briefcase,
  Network,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";

export function ManualEmployeeModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("add");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    employeeId: "",
    contactEmail: "",
    companyEmail: "",
    designation: "",
    department: "",
    manager: "",
  });

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode("add");
      setError("");
      setSuccessMsg("");
      setFormData({
        name: "",
        employeeNumber: "",
        employeeId: "",
        contactEmail: "",
        companyEmail: "",
        designation: "",
        department: "",
        manager: "",
      });
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Parse name into first and last
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      await api.post("/api/employees", {
        employeeCode:
          formData.employeeId || `EMP-${Math.floor(Math.random() * 10000)}`,
        employeeNumber: formData.employeeNumber,
        personal: {
          firstName,
          lastName,
          contactEmail: formData.contactEmail,
        },
        work: {
          department: formData.department,
          designation: formData.designation,
          companyEmail: formData.companyEmail,
          manager: formData.manager,
        },
      });
      setSuccessMsg("Employee added successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    if (
      !formData.employeeId &&
      !formData.employeeNumber &&
      !formData.companyEmail
    ) {
      setError(
        "Please provide at least Emp ID, EMP Number, or Company Email to identify the employee.",
      );
      setIsLoading(false);
      return;
    }

    try {
      await api.delete("/api/employees", {
        data: {
          employeeCode: formData.employeeId,
          employeeNumber: formData.employeeNumber,
          companyEmail: formData.companyEmail,
        },
      });
      setSuccessMsg("Employee removed successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to remove employee. Check details.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative max-h-[90vh] flex flex-col"
          >
            {/* Top gradient bar */}
            {mode === "add" ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            ) : (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-600"></div>
            )}

            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b border-border/50 mt-1 ${mode === "add" ? "bg-muted/30" : "bg-red-500/5"}`}
            >
              <div className="flex items-center gap-3">
                {mode === "add" ? (
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                    <UserPlus size={24} />
                  </div>
                ) : (
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                    <ShieldMinus size={24} />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {mode === "add"
                      ? "Add Employee Manually"
                      : "Remove Employee"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mode === "add"
                      ? "Enter details to create record"
                      : "Remove record from database"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {mode === "add" ? (
                  <button
                    onClick={() => {
                      setMode("remove");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Switch to Remove Mode"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMode("add");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                    title="Switch to Add Mode"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form
                onSubmit={mode === "add" ? handleAdd : handleRemove}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-xl">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Common Fields */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User
                        size={14}
                        className={
                          mode === "add" ? "text-blue-500" : "text-red-500"
                        }
                      />{" "}
                      Name
                    </label>
                    <input
                      type="text"
                      required={mode === "add"}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 text-sm ${mode === "add" ? "focus:ring-blue-500/50" : "focus:ring-red-500/50"}`}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Hash
                        size={14}
                        className={
                          mode === "add" ? "text-blue-500" : "text-red-500"
                        }
                      />{" "}
                      EMP Number
                    </label>
                    <input
                      type="text"
                      value={formData.employeeNumber}
                      onChange={(e) =>
                        handleChange("employeeNumber", e.target.value)
                      }
                      className={`w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 text-sm ${mode === "add" ? "focus:ring-blue-500/50" : "focus:ring-red-500/50"}`}
                      placeholder="e.g. 1045"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Hash
                        size={14}
                        className={
                          mode === "add" ? "text-blue-500" : "text-red-500"
                        }
                      />{" "}
                      Emp ID
                    </label>
                    <input
                      type="text"
                      required={mode === "add"}
                      value={formData.employeeId}
                      onChange={(e) =>
                        handleChange("employeeId", e.target.value)
                      }
                      className={`w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 text-sm ${mode === "add" ? "focus:ring-blue-500/50" : "focus:ring-red-500/50"}`}
                      placeholder="e.g. EMP-1045"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2
                        size={14}
                        className={
                          mode === "add" ? "text-blue-500" : "text-red-500"
                        }
                      />{" "}
                      Company Email
                    </label>
                    <input
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) =>
                        handleChange("companyEmail", e.target.value)
                      }
                      className={`w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 text-sm ${mode === "add" ? "focus:ring-blue-500/50" : "focus:ring-red-500/50"}`}
                      placeholder="work@company.com"
                    />
                  </div>

                  {/* Add Mode Only Fields */}
                  {mode === "add" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Mail size={14} className="text-blue-500" /> Contact
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            handleChange("contactEmail", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="personal@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Briefcase size={14} className="text-blue-500" />{" "}
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) =>
                            handleChange("designation", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Building2 size={14} className="text-blue-500" />{" "}
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) =>
                            handleChange("department", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="e.g. Engineering"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Network size={14} className="text-blue-500" />{" "}
                          Reporting Manager
                        </label>
                        <input
                          type="text"
                          value={formData.manager}
                          onChange={(e) =>
                            handleChange("manager", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="e.g. Jane Doe"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors ${mode === "remove" ? "text-red-500 hover:bg-red-500/10 border border-red-500/20" : "text-foreground"}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg ${mode === "add" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-red-600 hover:bg-red-700 shadow-red-500/20"}`}
                  >
                    {isLoading && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {mode === "add" ? "Add Employee" : "Remove Employee"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
