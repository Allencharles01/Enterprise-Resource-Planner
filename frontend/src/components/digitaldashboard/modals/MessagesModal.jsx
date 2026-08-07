import { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  Mail,
  Loader2,
  Trash2,
  Reply,
  Eye,
  Plus,
  Inbox,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { GmailComposerModal } from "../../GmailComposerModal";
import { StartChatModal } from "../../StartChatModal";
import { ChatWindowModal } from "../../ChatWindowModal";

export function MessagesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("email"); // "email" | "message"
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Gmail composer states for reply or new email
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerTo, setComposerTo] = useState("");
  const [composerSubject, setComposerSubject] = useState("");

  // Start Chat & Chat Window states
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
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
    if (isOpen) {
      fetchItems();

      api
        .get("/api/auth/me")
        .then((res) => {
          const u = res.data?.user || res.data;

          if (u) {
            const uObj = {
              id:
                u.id ||
                u._id ||
                (u.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
              name: u.name || "System Admin",
              code: u.employeeCode || (u.role === "admin" ? "ADMIN" : "EMP"),
              role: u.role || "admin",
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
                  (parsed.role === "admin" ? "ADMIN" : "EMP"),
                role: parsed.role || "admin",
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
              });
            }
          } catch (err) {
            console.error("Failed to parse stored user:", err);

            setCurrentUser({
              id: "ADMIN_ID",
              name: "System Admin",
              code: "ADMIN",
              role: "admin",
            });
          }
        });
    }
  }, [isOpen, activeTab, currentUser?.id, currentUser?.code]);

  useEffect(() => {
    if (!isOpen) return;

    if (activeTab === "email") {
      if (selectedItem) {
        const selectedStillExists = selectedItem.isGroupedConversation
          ? items.some(
              (item) => getPartnerEmailKey(item) === selectedItem.partnerKey
            )
          : items.some((item) => item._id === selectedItem?._id);

        if (!selectedStillExists) {
          setSelectedItem(null);
        }
      }
    }

    if (activeTab === "message" && selectedItem) {
      setSelectedItem(null);
    }
  }, [items, activeTab, isOpen, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        isOpen &&
        !selectedItem &&
        !isComposerOpen &&
        !isStartChatOpen &&
        !selectedChatRecipient
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    onClose,
    Boolean(selectedItem),
    isComposerOpen,
    isStartChatOpen,
    Boolean(selectedChatRecipient),
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  const stripHtml = (value = "") => {
    return String(value)
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getSenderName = (item) => {
    return (
      item.fromName ||
      item.senderName ||
      item.partnerName ||
      item.from ||
      item.to ||
      "Unknown Sender"
    );
  };

  const getPreviewText = (item) => {
    const preview =
      item.preview ||
      item.snippet ||
      item.message ||
      item.body ||
      item.subject ||
      "";

    return stripHtml(preview) || "No message preview available.";
  };

  const getItemDate = (item) => {
    if (!item?.createdAt) return "N/A";

    return new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/emails/${item._id}`);

        if (selectedItem?._id === item._id) {
          setSelectedItem(null);
        }

        fetchItems();
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  };

  const getReplyRecipientEmail = (item) => {
    if (!item) return "";

    if (item.isGroupedConversation) {
      if (item.partnerEmail) {
        return item.partnerEmail;
      }
      if (item.latestEmail) {
        const myEmail = String(currentUser?.email || "").toLowerCase().trim();
        const myCode = String(currentUser?.code || "").toLowerCase().trim();
        const fromStr = String(item.latestEmail.from || "").toLowerCase().trim();
        const sentByMe = (myEmail && fromStr.includes(myEmail)) || (myCode && fromStr.includes(myCode));
        return sentByMe
          ? item.latestEmail.to || ""
          : item.latestEmail.from || item.latestEmail.to || "";
      }
    }

    const myEmail = String(currentUser?.email || "").toLowerCase().trim();
    const myCode = String(currentUser?.code || "").toLowerCase().trim();
    const fromStr = String(item.from || "").toLowerCase().trim();
    const sentByMe = (myEmail && fromStr.includes(myEmail)) || (myCode && fromStr.includes(myCode));

    if (sentByMe) {
      return item.to || item.from || "";
    } else {
      return item.from || item.to || "";
    }
  };

  const handleReply = (item) => {
    const replyTo = getReplyRecipientEmail(item);
    setComposerTo(replyTo);

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

  const handleOpenItem = async (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === item._id ||
        (item.rawPartner &&
          i.rawPartner &&
          (i.rawPartner._id === item.rawPartner._id ||
            i.rawPartner.id === item.rawPartner.id))
          ? { ...i, isRead: true, unreadCount: 0 }
          : i
      )
    );

    window.dispatchEvent(new CustomEvent("messagesRead"));

    if (item.isChatConversation) {
      setSelectedChatRecipient(item.rawPartner);

      try {
        if (currentUser && item.rawPartner) {
          const senderCode =
            item.rawPartner.code ||
            item.rawPartner.empCode ||
            item.rawPartner.employeeCode ||
            item.rawPartner.id;

          const recipientCode =
            currentUser.code ||
            currentUser.employeeCode ||
            (currentUser.role === "admin" ? "ADMIN" : "EMP001");

          const senderId = item.rawPartner.id || item.rawPartner._id;

          const recipientId =
            currentUser.id ||
            currentUser._id ||
            (currentUser.role === "admin" ? "ADMIN_ID" : "");

          await api
            .patch("/api/internalChat/read", {
              senderId,
              recipientId,
              senderCode,
              recipientCode,
            })
            .catch(() => {});
        }
      } catch (e) {}
    } else {
      setSelectedItem(item);

      try {
        await api
          .put(`/api/emails/${item._id}`, { isRead: true })
          .catch(() => {});
      } catch (e) {}
    }
  };

  const renderEmptyState = () => (
    <div className="flex min-h-[360px] w-full flex-col items-center justify-center space-y-3 text-center text-muted-foreground">
      <Inbox size={48} className="opacity-40" />

      <p className="text-sm font-semibold">
        No {activeTab} history recorded yet.
      </p>

      {activeTab === "email" ? (
        <button
          onClick={handleComposeNew}
          className="text-xs font-bold text-violet-600 hover:underline"
        >
          Click here to send your first email &rarr;
        </button>
      ) : (
        <button
          onClick={() => setIsStartChatOpen(true)}
          className="text-xs font-bold text-purple-500 hover:underline"
        >
          Click here to start a chat &rarr;
        </button>
      )}
    </div>
  );

  const renderEmailContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          {renderEmptyState()}
        </div>
      );
    }

    return (
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[48%_52%]">
        {/* Left Email List */}
        <div className="flex min-w-0 flex-col border-r border-border bg-background/40">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Inbox</h3>

              <p className="text-xs text-muted-foreground">
                Select an email to read the full conversation
              </p>
            </div>

            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              {items.length} Emails
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.map((item, idx) => {
              const isSelected = selectedItem?._id === item._id;
              const isUnread = !item.isRead && item.direction === "inbound";

              return (
                <button
                  key={item._id || idx}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className={`w-full rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-violet-300 bg-violet-100/70 shadow-sm dark:border-violet-500/40 dark:bg-violet-500/10"
                      : "border-border bg-background hover:border-violet-200 hover:bg-violet-50/60 dark:hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="block max-w-full truncate text-[13px] font-bold leading-5 text-foreground">
                          {getSenderName(item)}
                        </p>

                        {isUnread && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            title="New / Unread"
                          />
                        )}
                      </div>

                      <p className="mt-1 block truncate text-xs font-semibold text-foreground">
                        {item.subject || "No Subject"}
                      </p>
                    </div>

                    <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                      {getItemDate(item)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {getPreviewText(item)}
                  </p>

                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-violet-600">
                      <FileText size={12} />
                      {item.attachments.length} attachment
                      {item.attachments.length > 1 ? "s" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Email Preview */}
        <div className="flex min-w-0 flex-col bg-muted/10 p-5">
          {selectedItem ? (
            <>
              <div className="mb-4 border-b border-border/60 pb-4">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-violet-600">
                  Email Preview
                </span>

                <h3 className="mt-1 break-words text-xl font-extrabold text-foreground">
                  {selectedItem.subject || "No Subject"}
                </h3>
              </div>

              <div className="mb-4 grid gap-4 rounded-2xl border border-border/80 bg-background p-4 text-xs md:grid-cols-2">
                <div className="min-w-0">
                  <span className="font-semibold text-muted-foreground">
                    From
                  </span>

                  <p className="mt-1 break-words font-bold text-foreground">
                    {selectedItem.from || "NovaNectar ERP"}
                  </p>
                </div>

                <div className="min-w-0">
                  <span className="font-semibold text-muted-foreground">To</span>

                  <p className="mt-1 break-words font-bold text-foreground">
                    {selectedItem.to || "N/A"}
                  </p>
                </div>

                <div className="min-w-0 md:col-span-2">
                  <span className="font-semibold text-muted-foreground">
                    Date
                  </span>

                  <p className="mt-1 break-words text-muted-foreground">
                    {selectedItem.createdAt
                      ? new Date(selectedItem.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto rounded-2xl border border-border/80 bg-background p-5 text-sm leading-relaxed text-foreground shadow-sm">
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: selectedItem.body?.includes("<")
                      ? selectedItem.body
                      : selectedItem.body?.replace(/\n/g, "<br/>") ||
                        "No message body available.",
                  }}
                />
              </div>

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="mt-4 border-t border-border/60 pt-4">
                  <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                    Attached Files ({selectedItem.attachments.length})
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {selectedItem.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
                      >
                        <FileText size={15} className="text-violet-600" />
                        <span>{att.name || "Attachment"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-4">
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

                <button
                  onClick={() => handleReply(selectedItem)}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-violet-700"
                >
                  <Reply size={14} />
                  Reply to {selectedItem.to || selectedItem.from || "Sender"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <Mail size={46} className="mb-3 opacity-40" />

              <p className="text-sm font-semibold text-foreground">
                Select an email to preview
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Email details will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          {renderEmptyState()}
        </div>
      );
    }

    return (
      <div className="w-full overflow-y-auto p-5">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-16 px-5 py-3.5 font-semibold">#</th>
                <th className="px-5 py-3.5 font-semibold">
                  Recipient / Sender
                </th>
                <th className="px-5 py-3.5 font-semibold">Subject</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item._id || idx}
                  onClick={() => handleOpenItem(item)}
                  className={`cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 ${
                    selectedItem?._id === item._id
                      ? "bg-primary/5 font-medium dark:bg-primary/10"
                      : ""
                  }`}
                >
                  <td className="flex items-center px-5 py-3.5 font-bold text-muted-foreground">
                    <span>{idx + 1}</span>

                    {(item.unreadCount > 0 ||
                      (!item.isRead && item.direction === "inbound")) && (
                      <span
                        className="ml-1.5 inline-block h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        title="New / Unread"
                      />
                    )}
                  </td>

                  <td className="px-5 py-3.5 font-bold text-foreground">
                    <span className="block max-w-[260px] truncate font-extrabold">
                      {item.partnerName || item.to || item.from}
                    </span>
                  </td>

                  <td className="max-w-[260px] truncate px-5 py-3.5 font-semibold text-foreground">
                    {item.subject || item.lastMessage || "Message"}

                    {item.attachments && item.attachments.length > 0 && (
                      <span
                        className="ml-2 inline-flex items-center text-violet-600"
                        title="Has attachment"
                      >
                        <FileText size={13} />
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted-foreground">
                    {getItemDate(item)}
                  </td>

                  <td
                    className="px-5 py-3.5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          item.isChatConversation
                            ? setSelectedChatRecipient(item.rawPartner)
                            : setSelectedItem(item)
                        }
                        className="rounded-lg p-1.5 text-violet-600 transition-colors hover:bg-violet-100 dark:hover:bg-violet-500/10"
                        title={
                          item.isChatConversation
                            ? "Open chat window"
                            : "Read message"
                        }
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        onClick={() =>
                          item.isChatConversation
                            ? setSelectedChatRecipient(item.rawPartner)
                            : handleReply(item)
                        }
                        className="rounded-lg p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                        title={
                          item.isChatConversation
                            ? "Continue chat"
                            : "Reply to correspondence"
                        }
                      >
                        <Reply size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                        title="Delete item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedItem && activeTab === "message" && (
          <div className="mt-5 rounded-2xl border border-border bg-muted/10 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-violet-600">
                  System Message
                </span>

                <h3 className="mt-0.5 text-lg font-extrabold tracking-tight text-foreground">
                  {selectedItem.subject || "Message"}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                title="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-border/80 bg-background p-5 text-sm leading-relaxed text-foreground">
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: selectedItem.body?.includes("<")
                    ? selectedItem.body
                    : selectedItem.body?.replace(/\n/g, "<br/>") ||
                      getPreviewText(selectedItem),
                }}
              />
            </div>
          </div>
        )}
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
            {/* Header & Toggle */}
            <div className="flex flex-col justify-between gap-4 border-b border-border/50 bg-muted/20 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-violet-200 bg-violet-100 p-2.5 text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
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

              {/* Center Toggle & Compose Button */}
              <div className="flex items-center gap-3">
                <div className="flex rounded-xl border border-border/60 bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => handleTabChange("email")}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === "email"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail size={14} />
                    Email Box

                    <span className="flex items-center gap-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
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
                    onClick={() => handleTabChange("message")}
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
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 hover:from-violet-500 hover:to-purple-500"
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
              </div>

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:static"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex min-h-[460px] flex-1 overflow-hidden">
              {activeTab === "email"
                ? renderEmailContent()
                : renderMessageContent()}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Gmail Composer Modal for reply/compose */}
      <GmailComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialTo={composerTo}
        initialSubject={composerSubject}
        onSuccess={() => {
          fetchItems();
        }}
      />

      {/* Start Chat Modal */}
      <StartChatModal
        isOpen={isStartChatOpen}
        onClose={() => setIsStartChatOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setSelectedChatRecipient(user)}
      />

      {/* Chat Window Modal */}
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
