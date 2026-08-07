"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Loader2,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function ChatWindowModal({
  isOpen,
  onClose,
  currentUser,
  recipientUser,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const activePairRef = useRef({
    senderId: "",
    recipientId: "",
  });

  const cleanValue = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  const uniqueValues = (values) => {
    return Array.from(
      new Set(values.map((value) => cleanValue(value)).filter(Boolean))
    );
  };

  const sourceItem = recipientUser?.sourceItem || recipientUser?.rawItem || {};

  const getSenderCandidates = () => {
    return uniqueValues([
      currentUser?.id,
      currentUser?._id,
      currentUser?.employeeId,
      currentUser?.empCode,
      currentUser?.employeeCode,
      currentUser?.code,
      currentUser?.loginId,
      currentUser?.role === "admin" ? "ADMIN_ID" : "",
      currentUser?.role === "admin" ? "ADMIN" : "",
    ]);
  };

  const getRecipientCandidates = () => {
    const senderCandidates = getSenderCandidates();

    const possibleValues = uniqueValues([
      recipientUser?.id,
      recipientUser?._id,
      recipientUser?.employeeId,
      recipientUser?.empCode,
      recipientUser?.employeeCode,
      recipientUser?.code,
      recipientUser?.loginId,
      recipientUser?.partnerId,
      recipientUser?.partnerCode,

      recipientUser?.rawPartner?.id,
      recipientUser?.rawPartner?._id,
      recipientUser?.rawPartner?.employeeId,
      recipientUser?.rawPartner?.empCode,
      recipientUser?.rawPartner?.employeeCode,
      recipientUser?.rawPartner?.code,
      recipientUser?.rawPartner?.loginId,

      sourceItem?.partnerId,
      sourceItem?.partnerCode,
      sourceItem?.senderId,
      sourceItem?.recipientId,
      sourceItem?.senderCode,
      sourceItem?.recipientCode,
      sourceItem?.userId,
      sourceItem?.empCode,
      sourceItem?.employeeCode,
      sourceItem?.code,
    ]);

    const filteredValues = possibleValues.filter(
      (value) => !senderCandidates.includes(value)
    );

    return filteredValues.length > 0 ? filteredValues : possibleValues;
  };

  const getSenderId = () => {
    const candidates = getSenderCandidates();
    return candidates[0] || "";
  };

  const getRecipientId = () => {
    const candidates = getRecipientCandidates();
    return candidates[0] || "";
  };

  const recipientName =
    recipientUser?.name ||
    recipientUser?.partnerName ||
    sourceItem?.partnerName ||
    sourceItem?.senderName ||
    sourceItem?.recipientName ||
    "User";

  const recipientCode =
    recipientUser?.empCode ||
    recipientUser?.employeeCode ||
    recipientUser?.code ||
    recipientUser?.loginId ||
    sourceItem?.partnerCode ||
    sourceItem?.senderCode ||
    sourceItem?.recipientCode ||
    recipientUser?.designation ||
    "";

  const getMessageText = (msg) => {
    return msg?.message || msg?.text || msg?.body || msg?.lastMessage || "";
  };

  const isMyMessage = (msg) => {
    const senderId = cleanValue(msg?.senderId);
    const senderCode = cleanValue(msg?.senderCode);
    const senderRole = cleanValue(msg?.senderRole).toLowerCase();

    const myIds = getSenderCandidates();
    const myRole = cleanValue(currentUser?.role).toLowerCase();

    return (
      myIds.includes(senderId) ||
      myIds.includes(senderCode) ||
      (myRole === "admin" && senderRole === "admin")
    );
  };

  const formatMessageTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchConversation = async () => {
    const senderCandidates = getSenderCandidates();
    const recipientCandidates = getRecipientCandidates();

    if (senderCandidates.length === 0 || recipientCandidates.length === 0) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let finalMessages = [];
    let matchedSenderId = senderCandidates[0];
    let matchedRecipientId = recipientCandidates[0];

    try {
      const pairsToTry = [];

      senderCandidates.forEach((senderId) => {
        recipientCandidates.forEach((recipientId) => {
          pairsToTry.push({
            user1: senderId,
            user2: recipientId,
            senderId,
            recipientId,
          });

          pairsToTry.push({
            user1: recipientId,
            user2: senderId,
            senderId,
            recipientId,
          });
        });
      });

      for (const pair of pairsToTry) {
        try {
          const res = await api.get(
            `/api/internalChat/conversation?user1=${encodeURIComponent(
              pair.user1
            )}&user2=${encodeURIComponent(pair.user2)}`
          );

          const list = Array.isArray(res.data) ? res.data : [];

          if (list.length > 0) {
            finalMessages = list;
            matchedSenderId = pair.senderId;
            matchedRecipientId = pair.recipientId;
            break;
          }
        } catch (err) {
          // Try next pair silently
        }
      }

      const sortedList = [...finalMessages].sort((a, b) => {
        const first = new Date(a.createdAt || 0).getTime();
        const second = new Date(b.createdAt || 0).getTime();

        return first - second;
      });

      activePairRef.current = {
        senderId: matchedSenderId,
        recipientId: matchedRecipientId,
      };

      setMessages(sortedList);

      if (matchedSenderId && matchedRecipientId) {
        api
          .patch("/api/internalChat/read", {
            senderId: matchedRecipientId,
            recipientId: matchedSenderId,
            senderCode: recipientCode || matchedRecipientId,
            recipientCode: currentUser?.code || currentUser?.employeeCode || matchedSenderId,
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error("Failed to fetch chat:", err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser && recipientUser) {
      setIsLoading(true);
      fetchConversation();

      const interval = setInterval(fetchConversation, 3000);

      return () => clearInterval(interval);
    }
  }, [
    isOpen,
    currentUser?.id,
    currentUser?._id,
    currentUser?.code,
    currentUser?.employeeCode,
    recipientUser?.id,
    recipientUser?._id,
    recipientUser?.empCode,
    recipientUser?.employeeCode,
    recipientUser?.code,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

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

    const textToSend = newMessage.trim();
    setNewMessage("");

    const activeSenderId = activePairRef.current.senderId || getSenderId();
    const activeRecipientId =
      activePairRef.current.recipientId || getRecipientId();

    try {
      await api.post("/api/internalChat/send", {
        senderId: activeSenderId,
        senderName: currentUser?.name || "System Admin",
        senderCode: currentUser?.code || currentUser?.employeeCode || "ADMIN",
        senderRole: currentUser?.role || "admin",
        recipientId: activeRecipientId,
        recipientName,
        recipientCode: recipientCode || activeRecipientId,
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
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="employee-chat-window-modal flex h-[620px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl"
        >
          {/* Header */}
          <div className="employee-chat-window-header flex items-center justify-between border-b border-slate-700/80 bg-slate-800/90 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                {recipientName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-base font-bold leading-tight text-white">
                  {recipientName}
                </h3>

                <p className="mt-0.5 font-mono text-xs text-blue-400">
                  {recipientCode}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white"
              title="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="employee-chat-window-body flex-1 overflow-y-auto bg-slate-950/40 px-5 py-5">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-2 text-slate-500">
                <MessageSquare size={42} className="stroke-1" />

                <p className="text-sm font-medium">No messages yet.</p>

                <p className="text-xs">
                  Send a message to start the conversation!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => {
                  const isMe = isMyMessage(msg);
                  const messageText = getMessageText(msg);

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex flex-col ${
                        isMe ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                          isMe
                            ? "rounded-bl-none bg-blue-600 text-white"
                            : "rounded-br-none border border-slate-700 bg-slate-800 text-slate-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {messageText}
                        </p>
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-1.5 px-1 ${
                          isMe ? "justify-start" : "justify-end"
                        }`}
                      >
                        <span className="text-[10px] text-slate-500">
                          {formatMessageTime(msg.createdAt)}
                        </span>

                        {isMe && (
                          <span className="text-[11px] text-blue-400">
                            {msg.isRead ? (
                              <CheckCheck size={13} />
                            ) : (
                              <Check size={13} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="employee-chat-window-footer flex gap-2 border-t border-slate-700/80 bg-slate-800/90 p-4"
          >
            <input
              type="text"
              placeholder={`Message ${recipientName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="employee-chat-window-input flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-violet-500 disabled:bg-violet-300 disabled:text-white disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:opacity-40"
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