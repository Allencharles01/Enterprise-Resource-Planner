import { useState, useEffect } from "react";
import { X, Loader2, UserPlus, Check, X as RejectIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { ApproveRequestModal } from "./ApproveRequestModal";

export function NewRequestsModal({ isOpen, onClose }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const fetchRequests = () => {
    setIsLoading(true);
    api
      .get("/api/accountRequests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to fetch requests:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only close NewRequestsModal if its sub-modal isn't open
      if (e.key === "Escape" && isOpen && !isApproveOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isApproveOpen]);

  const handleApproveClick = (req) => {
    setSelectedRequest(req);
    setIsApproveOpen(true);
  };

  const handleRejectClick = async (req) => {
    if (
      window.confirm(
        `Are you sure you want to reject the request for ${req.name}?`,
      )
    ) {
      try {
        await api.post(`/api/accountRequests/${req._id}/reject`);
        fetchRequests();
      } catch (err) {
        console.error("Failed to reject request:", err);
        alert("Failed to reject request.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  New Account Requests
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold w-24">S.no</th>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Email ID</th>
                        <th className="px-6 py-4 font-semibold">
                          Applied Date
                        </th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req, idx) => (
                        <tr
                          key={req._id}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {req.name}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {req.email}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApproveClick(req)}
                                className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20 shadow-sm"
                                title="Approve Request"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectClick(req)}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 shadow-sm"
                                title="Reject Request"
                              >
                                <RejectIcon size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            No pending account requests at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ApproveRequestModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        request={selectedRequest}
        onSuccess={() => {
          setIsApproveOpen(false);
          fetchRequests();
        }}
      />
    </>
  );
}
