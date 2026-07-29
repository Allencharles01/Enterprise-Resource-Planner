"use client";

import { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  Mail,
  Loader2,
  Trash2,
  Reply,
  Plus,
  Inbox,
  Send,
  Eye,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { GmailComposerModal } from "./GmailComposerModal";
import { StartChatModal } from "./StartChatModal";
import { ChatWindowModal } from "./ChatWindowModal";

export function MessagesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("email");
  const [viewMode, setViewMode] = useState("inbox");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quickMessage, setQuickMessage] = useState("");

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerTo, setComposerTo] = useState("");
  const [composerSubject, setComposerSubject] = useState("");

  const [isStartChatOpen, setIsStartChatOpen] = useState(false);
  const [selectedChatRecipient, setSelectedChatRecipient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchItems = () => {
    Promise.resolve().then(() => setIsLoading(true));

    if (activeTab === "message") {
      const uId = currentUser?.id || "";
      const uCode = currentUser?.code || "";
      const uRole = currentUser?.role || "";

      Promise.all([
        api
          .get(
            `/api/internalChat/conversations-list?userId=${uId}&code=${uCode}&role=${uRole}`
          )
          .catch(() => ({ data: [] })),
        api.get(`/api/emails?type=message`).catch(() => ({ data: [] })),
      ])
        .then(([chatRes, emailRes]) => {
          const chats = (chatRes.data || []).map((c) => ({
            ...c,
            isChatConversation: true,
          }));

          const emails = (emailRes.data || []).map((e) => ({
            ...e,
            isChatConversation: false,
          }));

          const combined = [...chats, ...emails].sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );

          setItems(combined);
        })
        .catch(() => setItems([]))
        .finally(() => setIsLoading(false));
    } else {
      api
        .get(`/api/emails?type=${activeTab}`)
        .then((res) => setItems(res.data || []))
        .catch(() => setItems([]))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setSelectedItem(null);
    setQuickMessage("");
    setViewMode("inbox");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchItems();

      api
        .get("/api/auth/me")
        .then((res) => {
          const u = res.data?.user || res.data;

          if (u) {
            const uObj = {
              id: u.id || u._id || (u.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
              name: u.name || "System Admin",
              code: u.employeeCode || (u.role === "admin" ? "ADMIN" : "EMP"),
              role: u.role || "admin",
              email: u.email || u.workEmail || "",
            };

            setCurrentUser(uObj);
            localStorage.setItem("user", JSON.stringify(uObj));
          }
        })
        .catch(() => {
          try {
            const stored = localStorage.getItem("user");

            if (stored) {
              const parsed = JSON.parse(stored);

              setCurrentUser({
                id:
                  parsed.id ||
                  parsed._id ||
                  (parsed.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
                name: parsed.name || "System Admin",
                code:
                  parsed.employeeCode ||
                  parsed.employeeId ||
                  parsed.code ||
                  (parsed.role === "admin" ? "ADMIN" : "EMP"),
                role: parsed.role || "admin",
                email: parsed.email || parsed.workEmail || "",
              });
            } else {
              const name = localStorage.getItem("userName") || "System Admin";
              const role = localStorage.getItem("userRole") || "admin";
              const code =
                localStorage.getItem("userEmployeeCode") ||
                (role === "admin" ? "ADMIN" : "EMP");

              setCurrentUser({
                id: role === "admin" ? "ADMIN_ID" : code,
                name,
                code,
                role,
                email: localStorage.getItem("userEmail") || "",
              });
            }
          } catch (err) {
            console.error("Failed to parse stored user:", err);

            setCurrentUser({
              id: "ADMIN_ID",
              name: "System Admin",
              code: "ADMIN",
              role: "admin",
              email: "",
            });
          }
        });
    }
  }, [isOpen, activeTab, currentUser?.id, currentUser?.code]);

  useEffect(() => {
    if (!isOpen) return;

    if (items.length === 0) {
      setSelectedItem(null);
      setViewMode("inbox");
      return;
    }

    if (selectedItem) {
      const selectedStillExists = items.some((item) =>
        isSameItem(item, selectedItem)
      );

      if (!selectedStillExists) {
        setSelectedItem(null);
        setViewMode("inbox");
      }
    }
  }, [items, isOpen, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        isOpen &&
        !isComposerOpen &&
        !isStartChatOpen &&
        !selectedChatRecipient
      ) {
        if (viewMode === "conversation") {
          setViewMode("inbox");
          setSelectedItem(null);
          setQuickMessage("");
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    onClose,
    viewMode,
    isComposerOpen,
    isStartChatOpen,
    Boolean(selectedChatRecipient),
  ]);

  const stripHtml = (value = "") => {
    if (!value) return "";

    return String(value)
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getItemKey = (item, fallback = "") => {
    if (!item) return fallback;

    return (
      item._id ||
      item.id ||
      item.rawPartner?._id ||
      item.rawPartner?.id ||
      item.partnerId ||
      `${item.partnerName || item.from || item.to || "item"}-${
        item.createdAt || fallback
      }`
    );
  };

  const isSameItem = (a, b) => {
    if (!a || !b) return false;

    return getItemKey(a) === getItemKey(b);
  };

  const getDisplayPerson = (item) => {
    if (item?.isChatConversation) {
      return (
        item.partnerName ||
        item.rawPartner?.name ||
        item.to ||
        item.from ||
        "Unknown"
      );
    }

    return item?.from || item?.to || "Unknown Sender";
  };

  const getMessagePreview = (item) => {
    const preview =
      item?.preview ||
      item?.message ||
      item?.body ||
      item?.description ||
      item?.lastMessage ||
      "No message preview available.";

    return stripHtml(preview);
  };

  const getMessageTitle = (item) => {
    if (!item) return "Message";

    return item.subject || item.lastMessageSubject || item.lastMessage || "Message";
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizeSubject = (value = "") => {
    return String(value)
      .replace(/^re:\s*/i, "")
      .replace(/^fw:\s*/i, "")
      .trim()
      .toLowerCase();
  };

  const isSentByCurrentUser = (item) => {
    if (!item) return false;

    if (item.direction === "outbound" || item.type === "sent") return true;
    if (item.direction === "inbound") return false;

    if (item.isChatConversation) {
      return (
        item.senderId === currentUser?.id ||
        item.senderCode === currentUser?.code ||
        (currentUser?.role === "admin" && item.senderRole === "admin")
      );
    }

    if (currentUser?.email && item.from) {
      return String(item.from)
        .toLowerCase()
        .includes(String(currentUser.email).toLowerCase());
    }

    return false;
  };

  const buildChatRecipient = (item) => {
    if (!item) return null;

    const raw = item.rawPartner || item.partner || item.recipientUser || {};
    const sentByMe = isSentByCurrentUser(item);

    const partnerId =
      item.partnerId ||
      raw.id ||
      raw._id ||
      raw.employeeId ||
      raw.empCode ||
      raw.employeeCode ||
      raw.code ||
      (sentByMe ? item.recipientId : item.senderId) ||
      item.userId ||
      item.id ||
      item._id;

    const partnerCode =
      item.partnerCode ||
      raw.empCode ||
      raw.employeeCode ||
      raw.code ||
      raw.loginId ||
      (sentByMe ? item.recipientCode : item.senderCode) ||
      item.empCode ||
      item.employeeCode ||
      item.code ||
      partnerId;

    const partnerName =
      item.partnerName ||
      raw.name ||
      raw.fullName ||
      (sentByMe ? item.recipientName : item.senderName) ||
      item.name ||
      item.from ||
      item.to ||
      "Unknown User";

    return {
      ...raw,
      id: partnerId,
      _id: raw._id || partnerId,
      employeeId: raw.employeeId || partnerId,
      empCode: partnerCode,
      employeeCode: raw.employeeCode || partnerCode,
      code: raw.code || partnerCode,
      loginId: raw.loginId || partnerCode,
      name: partnerName,
      designation:
        raw.designation ||
        item.partnerDesignation ||
        item.designation ||
        item.department ||
        "",
      department: raw.department || item.department || "",
    };
  };

  const getSortedInboxItems = () => {
    return [...items].sort((a, b) => {
      const first = new Date(a.createdAt || 0).getTime();
      const second = new Date(b.createdAt || 0).getTime();

      return second - first;
    });
  };

  const getConversationItemsForSelected = () => {
    if (!selectedItem) return [];

    const selectedPerson = getDisplayPerson(selectedItem).toLowerCase();
    const selectedSubject = normalizeSubject(getMessageTitle(selectedItem));

    const relatedEmails = items.filter((item) => {
      if (isSameItem(item, selectedItem)) return true;

      const itemPerson = getDisplayPerson(item).toLowerCase();
      const itemSubject = normalizeSubject(getMessageTitle(item));

      const samePerson = selectedPerson && itemPerson === selectedPerson;
      const sameSubject = selectedSubject && itemSubject === selectedSubject;

      return samePerson || sameSubject;
    });

    const finalItems = relatedEmails.length > 0 ? relatedEmails : [selectedItem];

    return finalItems
      .filter((item, index, arr) => {
        const key = getItemKey(item, index);
        return arr.findIndex((i, idx) => getItemKey(i, idx) === key) === index;
      })
      .sort((a, b) => {
        const first = new Date(a.createdAt || 0).getTime();
        const second = new Date(b.createdAt || 0).getTime();

        return first - second;
      });
  };

  const handleDelete = async (item) => {
    if (!item) return;

    if (item.isChatConversation) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/emails/${item._id}`);

        if (isSameItem(selectedItem, item)) {
          setSelectedItem(null);
          setViewMode("inbox");
        }

        fetchItems();
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  };

  const handleReply = (item) => {
    setComposerTo(item.to || item.from || "");

    const sub = item.subject?.startsWith("Re:")
      ? item.subject
      : `Re: ${item.subject || "Your Message"}`;

    setComposerSubject(sub);
    setIsComposerOpen(true);
  };

  const handleComposeNew = () => {
    setComposerTo("");
    setComposerSubject("");
    setIsComposerOpen(true);
  };

  const markItemAsRead = async (item) => {
    setItems((prev) =>
      prev.map((i) =>
        isSameItem(i, item) ? { ...i, isRead: true, unreadCount: 0 } : i
      )
    );

    window.dispatchEvent(new CustomEvent("messagesRead"));

    if (item.isChatConversation) {
      try {
        const recipient = buildChatRecipient(item);

        const senderCode =
          recipient?.code ||
          recipient?.empCode ||
          recipient?.employeeCode ||
          recipient?.id;

        const recipientCode =
          currentUser?.code ||
          currentUser?.employeeCode ||
          (currentUser?.role === "admin" ? "ADMIN" : "EMP001");

        const senderId = recipient?.id || recipient?._id;

        const recipientId =
          currentUser?.id ||
          currentUser?._id ||
          (currentUser?.role === "admin" ? "ADMIN_ID" : "");

        if (senderId && recipientId) {
          await api
            .patch("/api/internalChat/read", {
              senderId,
              recipientId,
              senderCode,
              recipientCode,
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error("Failed to mark chat as read:", e);
      }
    } else if (item._id) {
      try {
        await api.put(`/api/emails/${item._id}`, { isRead: true }).catch(() => {});
      } catch (e) {
        console.error("Failed to mark email/message as read:", e);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        isRead: true,
        unreadCount: 0,
      }))
    );

    window.dispatchEvent(new CustomEvent("messagesRead"));

    if (activeTab === "email") {
      const unreadEmails = items.filter(
        (i) => !i.isChatConversation && (!i.isRead || i.unreadCount > 0) && i._id
      );
      await Promise.all(
        unreadEmails.map((e) =>
          api.put(`/api/emails/${e._id}`, { isRead: true }).catch(() => {})
        )
      );
    } else {
      const uId = currentUser?.id || "";
      const uCode = currentUser?.code || "";
      const uRole = currentUser?.role || "";
      if (uId || uCode) {
        await api
          .patch("/api/internalChat/read-all", {
            userId: uId,
            code: uCode,
            role: uRole,
          })
          .catch(() => {});
      }
      const unreadEmails = items.filter(
        (i) => !i.isChatConversation && (!i.isRead || i.unreadCount > 0) && i._id
      );
      await Promise.all(
        unreadEmails.map((e) =>
          api.put(`/api/emails/${e._id}`, { isRead: true }).catch(() => {})
        )
      );
    }
  };

  const handlePreviewItem = async (item) => {
    if (activeTab === "message") {
      await handleOpenItem(item);
      return;
    }

    setSelectedItem({ ...item, isRead: true, unreadCount: 0 });
    setViewMode("conversation");
    await markItemAsRead(item);
  };

  const handleOpenItem = async (item) => {
    await markItemAsRead(item);

    if (activeTab === "message" || item.isChatConversation) {
      const recipient = buildChatRecipient(item);

      if (recipient?.id || recipient?._id || recipient?.empCode) {
        setSelectedChatRecipient(recipient);
        return;
      }
    }

    setSelectedItem({ ...item, isRead: true, unreadCount: 0 });
    setViewMode("conversation");
  };

  const handleTopTabClick = (tabName) => {
    setSelectedItem(null);
    setQuickMessage("");
    setViewMode("inbox");
    setActiveTab(tabName);
  };

  const handleBackToInbox = () => {
    setSelectedItem(null);
    setQuickMessage("");
    setViewMode("inbox");
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();

    if (!quickMessage.trim()) return;

    const target = selectedItem || items[items.length - 1];

    if (activeTab === "email") {
      if (target) {
        handleReply(target);
      } else {
        handleComposeNew();
      }

      setQuickMessage("");
      return;
    }

    if (target) {
      handleOpenItem(target);
      setQuickMessage("");
      return;
    }

    setIsStartChatOpen(true);
    setQuickMessage("");
  };

  const renderInboxLayout = (mode) => {
    if (isLoading) {
      return (
        <div className="flex h-72 w-full items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    const isEmail = mode === "email";
    const inboxItems = getSortedInboxItems();

    if (inboxItems.length === 0) {
      return (
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <Inbox size={48} className="opacity-40" />

          <p className="font-semibold">
            No {isEmail ? "email" : "message"} history recorded yet.
          </p>

          <button
            onClick={isEmail ? handleComposeNew : () => setIsStartChatOpen(true)}
            className={`text-xs font-bold hover:underline ${
              isEmail ? "text-blue-500" : "text-purple-500"
            }`}
          >
            {isEmail
              ? "Click here to send your first email →"
              : "Click here to start a chat →"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-extrabold text-foreground">
              {isEmail ? "Inbox" : "Messages Inbox"}
            </h3>

            <p className="text-xs text-muted-foreground">
              {isEmail
                ? "Select an email to open the conversation view."
                : "Click Open Chat to continue the conversation."}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              isEmail
                ? "bg-blue-500/10 text-blue-500"
                : "bg-purple-500/10 text-purple-500"
            }`}
          >
            {inboxItems.length} {isEmail ? "Emails" : "Messages"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-extrabold">#</th>
                  <th className="px-5 py-4 font-extrabold">Recipient / Sender</th>
                  <th className="px-5 py-4 font-extrabold">
                    {isEmail ? "Subject / Preview" : "Message / Preview"}
                  </th>
                  <th className="px-5 py-4 font-extrabold">Date</th>
                  <th className="px-5 py-4 text-right font-extrabold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {inboxItems.map((item, idx) => {
                  const isUnread =
                    item.unreadCount > 0 ||
                    (!item.isRead && item.direction === "inbound");

                  return (
                    <tr
                      key={getItemKey(item, idx)}
                      onClick={() =>
                        isEmail ? handlePreviewItem(item) : handleOpenItem(item)
                      }
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-2 font-bold text-muted-foreground">
                          <span>{idx + 1}</span>

                          {isUnread && (
                            <span
                              className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                              title="Unread"
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="max-w-[280px] truncate text-sm font-extrabold text-foreground">
                          {getDisplayPerson(item)}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="max-w-[420px] truncate text-sm font-bold text-foreground">
                          {getMessageTitle(item)}
                        </p>

                        <p className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">
                          {getMessagePreview(item)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 align-middle text-xs font-semibold text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>

                      <td
                        className="px-5 py-4 align-middle"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-2">
                          {isEmail ? (
                            <>
                              <button
                                onClick={() => handlePreviewItem(item)}
                                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500"
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <Eye size={13} />
                                  View
                                </span>
                              </button>

                              <button
                                onClick={() => handleReply(item)}
                                className="rounded-xl border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-500 transition hover:bg-blue-500 hover:text-white"
                                title="Reply"
                              >
                                <Reply size={13} />
                              </button>

                              <button
                                onClick={() => handleDelete(item)}
                                className="rounded-xl border border-red-500/30 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenItem(item)}
                              className="rounded-xl border border-purple-500/30 px-4 py-2 text-xs font-bold text-purple-500 transition hover:bg-purple-500 hover:text-white"
                            >
                              Open Chat
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderConversationBubble = (item, idx) => {
    const isSent = isSentByCurrentUser(item);
    const isUnread =
      item.unreadCount > 0 || (!item.isRead && item.direction === "inbound");

    return (
      <div
        key={getItemKey(item, idx)}
        className={`flex w-full ${isSent ? "justify-end" : "justify-start"}`}
      >
        <button
          type="button"
          onClick={() => handlePreviewItem(item)}
          className="group max-w-[88%] text-left transition-all md:max-w-[48%]"
        >
          <div
            className={`rounded-2xl border p-2 shadow-sm transition-all ${
              isSent
                ? "border-violet-300 bg-violet-100 dark:border-indigo-500/40 dark:bg-indigo-600/15"
                : "border-purple-200 bg-purple-50 dark:border-slate-700 dark:bg-slate-800/70"
            }`}
          >
            <div
              className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                isSent
                  ? "border-violet-300 bg-violet-200 text-[#260b45] dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-100"
                  : "border-purple-200 bg-purple-100 text-[#260b45] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="line-clamp-2">
                  Sender&apos;s Subject: {getMessageTitle(item)}
                </span>

                {isUnread && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    title="Unread Email"
                  />
                )}
              </div>
            </div>

            <div
              className={`mt-2 rounded-xl border px-3 py-3 text-xs leading-relaxed ${
                isSent
                  ? "border-violet-200 bg-white/75 text-[#260b45] dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-slate-100"
                  : "border-purple-200 bg-white text-[#260b45] dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {getMessagePreview(item)}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 px-1">
              <span className="truncate text-[10px] font-semibold text-muted-foreground">
                {getDisplayPerson(item)}
              </span>

              <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                {isSent ? "Sent" : "Received"} on {formatDate(item.createdAt)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleReply(item);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-blue-700"
              >
                <Reply size={12} />
                Reply
              </span>

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={12} />
                Delete
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const renderConversationLayout = (mode) => {
    if (isLoading) {
      return (
        <div className="flex h-72 w-full items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    if (!selectedItem) {
      return renderInboxLayout(mode);
    }

    const conversationItems = getConversationItemsForSelected();

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/10 px-6 py-3">
          <div>
            <h3 className="text-sm font-extrabold text-foreground">
              Email Conversation
            </h3>

            <p className="text-xs text-muted-foreground">
              {getDisplayPerson(selectedItem)}
            </p>
          </div>

          <button
            onClick={handleBackToInbox}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500"
          >
            Back to Inbox
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f7f0ff] p-6 dark:bg-slate-950/20">
          <div className="mx-auto flex max-w-5xl flex-col gap-5">
            {conversationItems.map((item, idx) =>
              renderConversationBubble(item, idx)
            )}
          </div>
        </div>

        <form
          onSubmit={handleQuickSubmit}
          className="border-t border-border/60 bg-muted/20 p-4"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <input
              type="text"
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="Enter your email reply here..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground"
            />

            <button
              type="submit"
              disabled={!quickMessage.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              Reply
            </button>
          </div>

          <p className="mx-auto mt-2 max-w-5xl text-[11px] text-muted-foreground">
            Typing here opens the existing email composer with the selected email
            details.
          </p>
        </form>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-border/50 bg-muted/20 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
                  <Mail size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Communication & Email Center
                  </h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Manage client correspondence, replies, and system alerts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex rounded-xl border border-border/60 bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => handleTopTabClick("email")}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "email"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail size={14} />
                    Email Box
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
                      {activeTab === "email" ? items.length : ""}

                      {activeTab === "email" &&
                        items.some(
                          (i) => !i.isRead && i.direction === "inbound"
                        ) && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-sm"
                            title="Unread Email"
                          />
                        )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTopTabClick("message")}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "message"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageSquare size={14} />
                    Messages
                    <span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-500">
                      {activeTab === "message" ? items.length : ""}

                      {activeTab === "message" &&
                        items.some(
                          (i) =>
                            i.unreadCount > 0 ||
                            (!i.isRead && i.direction === "inbound")
                        ) && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-sm"
                            title="Unread Message"
                          />
                        )}
                    </span>
                  </button>
                </div>

                {activeTab === "email" ? (
                  <button
                    onClick={handleComposeNew}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500"
                  >
                    <Plus size={15} />
                    Compose Email
                  </button>
                ) : (
                  <button
                    onClick={() => setIsStartChatOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:from-purple-500 hover:to-pink-500"
                  >
                    <MessageSquare size={15} />
                    Start Chat
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-500 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
                  title={`Mark all ${activeTab === "email" ? "emails" : "messages"} as read`}
                >
                  <CheckCheck size={15} />
                  Mark all as Read
                </button>
              </div>

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:static"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
              {viewMode === "inbox"
                ? renderInboxLayout(activeTab)
                : renderConversationLayout(activeTab)}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <GmailComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialTo={composerTo}
        initialSubject={composerSubject}
        onSuccess={() => {
          fetchItems();
        }}
      />

      <StartChatModal
        isOpen={isStartChatOpen}
        onClose={() => setIsStartChatOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setSelectedChatRecipient(user)}
      />

      <ChatWindowModal
        isOpen={Boolean(selectedChatRecipient)}
        onClose={() => {
          setSelectedChatRecipient(null);
          fetchItems();
          window.dispatchEvent(new CustomEvent("messagesRead"));
        }}
        currentUser={currentUser}
        recipientUser={selectedChatRecipient}
      />
    </>
  );
}