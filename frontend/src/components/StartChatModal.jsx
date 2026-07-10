"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Users, Loader2, MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function StartChatModal({ isOpen, onClose, currentUser, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setSearchQuery("");
      api
        .get("/api/internalChat/users")
        .then((res) => {
          const list = res.data || [];
          // Filter out the logged in user
          const filtered = list.filter((u) => u.id !== currentUser?.id && u.empCode !== currentUser?.code);
          setUsers(filtered);
        })
        .catch((err) => console.error("Failed to fetch chat users:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, currentUser?.id, currentUser?.code]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) => {
      const name = String(u.name || "").toLowerCase();
      const code = String(u.empCode || "").toLowerCase();
      const login = String(u.loginId || "").toLowerCase();
      const desig = String(u.designation || "").toLowerCase();
      const dept = String(u.department || "").toLowerCase();
      return name.includes(q) || code.includes(q) || login.includes(q) || desig.includes(q) || dept.includes(q);
    });
  }, [users, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden text-slate-100 relative p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Start Chat
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search by Name, EMP ID, Login ID, or Designation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mt-5 mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Type to search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px] max-h-[420px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                <Loader2 className="animate-spin text-blue-500" size={36} />
                <span className="text-xs font-medium">Loading directory...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
                <Users size={40} className="stroke-1" />
                <p className="text-sm font-medium">No team members found.</p>
                <p className="text-xs">Try searching with a different Name or EMP ID.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 transition-all cursor-pointer group hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:border-blue-500 transition-all">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[11px] border border-blue-500/20 font-bold">
                          {user.empCode}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{user.designation || "Employee"}</span>
                        {user.department && (
                          <>
                            <span>•</span>
                            <span>{user.department}</span>
                          </>
                        )}
                        {user.loginId && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-slate-500">{user.loginId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-700/40 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
