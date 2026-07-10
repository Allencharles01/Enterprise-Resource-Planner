"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, MessageSquare, User, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function ChatWindowModal({ isOpen, onClose, currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const getSenderId = () => currentUser?.id || currentUser?._id || currentUser?.code || (currentUser?.role === "admin" ? "ADMIN_ID" : "");
  const getRecipientId = () => recipientUser?.id || recipientUser?._id || recipientUser?.employeeId || recipientUser?.empCode || "";

  const fetchConversation = () => {
    const sId = getSenderId();
    const rId = getRecipientId();

    if (!sId || !rId) {
      setIsLoading(false);
      return;
    }

    api
      .get(`/api/internalChat/conversation?user1=${sId}&user2=${rId}`)
      .then((res) => {
        setMessages(res.data || []);
        // Mark read
        api.patch("/api/internalChat/read", {
          senderId: rId,
          recipientId: sId,
          senderCode: recipientUser?.empCode || rId,
          recipientCode: currentUser?.code || sId,
        }).catch(() => {});
      })
      .catch((err) => console.error("Failed to fetch chat:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen && currentUser && recipientUser) {
      setIsLoading(true);
      fetchConversation();
      const interval = setInterval(fetchConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentUser?.id, currentUser?.code, recipientUser?.id, recipientUser?._id, recipientUser?.empCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !recipientUser) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = newMessage;
    setNewMessage("");

    try {
      await api.post("/api/internalChat/send", {
        senderId: getSenderId(),
        senderName: currentUser?.name || "System Admin",
        senderCode: currentUser?.code || "ADMIN",
        senderRole: currentUser?.role || "admin",
        recipientId: getRecipientId(),
        recipientName: recipientUser.name,
        recipientCode: recipientUser.empCode || getRecipientId(),
        message: textToSend,
      });
      fetchConversation();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error sending message. Please try again.");
      setNewMessage(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden text-slate-100 relative"
        >
          {/* Top Header */}
          <div className="p-4 px-5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {recipientUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {recipientUser.name}
                </h3>
                <p className="text-xs text-blue-400 font-mono mt-0.5">
                  {recipientUser.empCode || recipientUser.designation}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-950/40">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                <MessageSquare size={40} className="stroke-1" />
                <p className="text-sm font-medium">No messages yet.</p>
                <p className="text-xs">Send a message to start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === getSenderId() || msg.senderCode === currentUser?.code || (currentUser?.role === "admin" && msg.senderRole === "admin");
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe && (
                        <span className="text-[11px] text-blue-400">
                          {msg.isRead ? <CheckCheck size={13} /> : <Check size={13} />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 bg-slate-800/80 border-t border-slate-700/80 flex gap-2">
            <input
              type="text"
              placeholder={`Message ${recipientUser.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl font-medium text-sm flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
