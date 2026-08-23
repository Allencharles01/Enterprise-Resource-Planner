import { useState, useEffect } from "react";
import { X, Loader2, ShieldAlert, Shield, ShieldMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { AddAdminModal } from "./AddAdminModal";
import { RemoveAdminModal } from "./RemoveAdminModal";

export function AdminsModal({ isOpen, onClose }) {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const fetchAdmins = () => {
    setIsLoading(true);
    api
      .get("/api/admins")
      .then((res) => setAdmins(res.data))
      .catch((err) => console.error("Failed to fetch admins:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only close AdminsModal if its sub-modals aren't open
      if (e.key === "Escape" && isOpen && !isAddOpen && !isRemoveOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isAddOpen, isRemoveOpen]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="relative p-5 sm:p-6 border-b border-border/50 bg-muted/20">
              <div className="flex flex-col gap-4 pr-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <ShieldAlert size={22} className="sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-foreground">
                    Administrators
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors font-semibold text-xs sm:text-sm rounded-lg border border-blue-500/20 whitespace-nowrap cursor-pointer"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4" />
                    <span>Add new Admins</span>
                  </button>
                  <button
                    onClick={() => setIsRemoveOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-semibold text-xs sm:text-sm rounded-lg border border-red-500/20 whitespace-nowrap cursor-pointer"
                  >
                    <ShieldMinus size={14} className="sm:w-4 sm:h-4" />
                    <span>Remove Admin</span>
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 sm:p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <>
                  {/* Mobile Grid View */}
                  <div className="grid grid-cols-1 gap-3 sm:hidden">
                    {admins.map((admin, idx) => (
                      <div
                        key={admin._id}
                        className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-3 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            No. {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 font-mono">
                            {admin.employeeId || "N/A"}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Employee Name</p>
                          <p className="font-bold text-slate-200 text-sm mt-0.5">
                            {admin.name}
                          </p>
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground text-sm">
                        No administrators found.
                      </div>
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-semibold w-24">S.no</th>
                          <th className="px-6 py-4 font-semibold">Employee ID</th>
                          <th className="px-6 py-4 font-semibold">
                            Employee Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin, idx) => (
                          <tr
                            key={admin._id}
                            className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-6 py-4 text-muted-foreground">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 font-medium text-primary bg-primary/5">
                              {admin.employeeId || "N/A"}
                            </td>
                            <td className="px-6 py-4 font-bold text-foreground">
                              {admin.name}
                            </td>
                          </tr>
                        ))}
                        {admins.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-6 py-8 text-center text-muted-foreground"
                            >
                              No administrators found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <AddAdminModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          fetchAdmins();
        }}
      />

      <RemoveAdminModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onSuccess={() => {
          setIsRemoveOpen(false);
          fetchAdmins();
        }}
      />
    </>
  );
}
