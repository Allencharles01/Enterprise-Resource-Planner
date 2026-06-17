import { X, Briefcase, Mail, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EmployeeDetailsModal({ employee, onClose }) {
  return (
    <AnimatePresence>
      {employee && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Header */}
              <div className="h-32 bg-gradient-to-r from-primary/80 to-primary relative flex items-end px-6 pb-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute -bottom-12 left-6 p-1 bg-background rounded-2xl">
                  <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center text-4xl font-bold text-muted-foreground shadow-inner">
                    {employee.personal.firstName.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="pt-16 pb-8 px-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {employee.personal.firstName} {employee.personal.lastName}
                  </h2>
                  <p className="text-primary font-medium mt-1">
                    {employee.work?.department || "No Department"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-muted-foreground bg-muted/50 p-3 rounded-xl">
                    <div className="p-2 bg-background rounded-lg shadow-sm">
                      <KeyRound size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">
                        Employee Code
                      </p>
                      <p className="text-foreground font-medium">
                        {employee.employeeCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground bg-muted/50 p-3 rounded-xl">
                    <div className="p-2 bg-background rounded-lg shadow-sm">
                      <Briefcase size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">
                        Designation
                      </p>
                      <p className="text-foreground font-medium">
                        {employee.work?.designation || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground bg-muted/50 p-3 rounded-xl">
                    <div className="p-2 bg-background rounded-lg shadow-sm">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">
                        Contact Info
                      </p>
                      <p className="text-foreground font-medium">
                        {employee.personal.phone || "No phone provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
