import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2, User, Briefcase, Hash } from "lucide-react";
import { api } from "@/lib/api";

export function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeCode: "",
    department: "",
    designation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Auto-generate employee code if empty
      const code =
        formData.employeeCode ||
        `EMP-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`;
      await api.post("/api/employees", {
        employeeCode: code,
        personal: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        work: {
          department: formData.department,
          designation: formData.designation,
        },
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        employeeCode: "",
        department: "",
        designation: "",
      });
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError(
        err.response?.data?.error ||
          "Failed to add employee. Please check your permissions.",
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
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Add New Employee
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User size={14} className="text-primary" /> First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Hash size={14} className="text-primary" /> Employee Code
                  (Optional)
                </label>
                <input
                  type="text"
                  value={formData.employeeCode}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeCode: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Leave empty to auto-generate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" /> Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="e.g. Frontend"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="e.g. Developer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Save Employee
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
