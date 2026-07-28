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
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { GmailComposerModal } from "./GmailComposerModal";
import { StartChatModal } from "./StartChatModal";
import { ChatWindowModal } from "./ChatWindowModal";

export function MessagesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("email");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

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
              id: u.id || u._id || (u.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
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

    if ((activeTab === "email" || activeTab === "message") && items.length > 0) {
      const selectedStillExists = items.some((item) =>
        isSameItem(item, selectedItem)
      );

      if (!selectedItem || !selectedStillExists) {
        setSelectedItem(items[0]);
      }
    }

    if (items.length === 0) {
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

  const handlePreviewItem = async (item) => {
    setSelectedItem({ ...item, isRead: true, unreadCount: 0 });
    await markItemAsRead(item);
  };

  const handleOpenItem = async (item) => {
    await markItemAsRead(item);

    if (item.isChatConversation) {
      setSelectedChatRecipient(item.rawPartner);
    } else {
      setSelectedItem({ ...item, isRead: true, unreadCount: 0 });
    }
  };

  const renderEmailChatLayout = () => {
    if (isLoading) {
      return (
        <div className="flex h-72 w-full items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <Inbox size={48} className="opacity-40" />

          <p className="font-semibold">No email history recorded yet.</p>

          <button
            onClick={handleComposeNew}
            className="text-xs font-bold text-blue-500 hover:underline"
          >
            Click here to send your first email &rarr;
          </button>
        </div>
      );
    }

    return (
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[42%_58%]">
        <div className="min-h-0 border-b border-border bg-muted/10 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">Inbox</h3>
              <p className="text-xs text-muted-foreground">
                Select an email to read the full conversation
              </p>
            </div>

            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-500">
              {items.length} Emails
            </span>
          </div>

          <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const isSelected = isSameItem(selectedItem, item);
              const isUnread = !item.isRead && item.direction === "inbound";

              return (
                <button
                  key={getItemKey(item, idx)}
                  type="button"
                  onClick={() => handlePreviewItem(item)}
                  className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-blue-500/40 bg-blue-500/10 shadow-sm dark:bg-blue-500/15"
                      : "border-border/70 bg-background hover:border-blue-500/30 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="block truncate text-[13px] font-bold leading-5 text-foreground">
                          {getDisplayPerson(item)}
                        </p>

                        {isUnread && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            title="Unread Email"
                          />
                        )}
                      </div>

                      <p className="mt-1 block truncate text-xs font-semibold text-foreground">
                        {item.subject || "No Subject"}
                      </p>
                    </div>

                    <span className="shrink-0 max-w-[96px] text-right text-[10px] font-semibold leading-4 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {getMessagePreview(item)}
                  </p>

                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500">
                      <FileText size={11} />
                      {item.attachments.length} Attachment
                      {item.attachments.length > 1 ? "s" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto bg-background p-5">
          {!selectedItem ? (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-muted-foreground">
              <Mail size={42} className="mb-3 opacity-40" />
              <p className="text-sm font-bold text-foreground">Select an email</p>
              <p className="mt-1 text-xs">The full email will appear here.</p>
            </div>
          ) : (
            <div className="flex min-h-full flex-col">
              <div className="border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                      Email Preview
                    </span>

                    <h3 className="mt-1 text-2xl font-extrabold leading-tight text-foreground">
                      {selectedItem.subject || "No Subject"}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                    title="Close preview"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 grid gap-2 rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-muted-foreground">From</p>
                    <p className="mt-1 break-all font-bold text-foreground">
                      {selectedItem.from || "NovaNectar ERP"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground">To</p>
                    <p className="mt-1 break-all font-bold text-foreground">
                      {selectedItem.to || "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="font-semibold text-muted-foreground">Date</p>
                    <p className="mt-1 font-semibold text-muted-foreground">
                      {selectedItem.createdAt
                        ? new Date(selectedItem.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex-1 rounded-2xl border border-border/80 bg-muted/10 p-5 text-sm leading-relaxed text-foreground shadow-sm">
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: selectedItem.body?.includes("<")
                      ? selectedItem.body
                      : selectedItem.body?.replace(/\n/g, "<br/>") ||
                        "No email body available.",
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
                        <FileText size={15} className="text-blue-500" />
                        <span>{att.name || "Attachment"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-border/60 pt-4">
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

                <button
                  onClick={() => handleReply(selectedItem)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-700"
                >
                  <Reply size={14} />
                  Reply to {selectedItem.to || selectedItem.from || "Email"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessageChatLayout = () => {
    if (isLoading) {
      return (
        <div className="flex h-72 w-full items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <Inbox size={48} className="opacity-40" />

          <p className="font-semibold">No message history recorded yet.</p>

          <button
            onClick={() => setIsStartChatOpen(true)}
            className="text-xs font-bold text-purple-500 hover:underline"
          >
            Click here to start a chat &rarr;
          </button>
        </div>
      );
    }

    return (
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[42%_58%]">
        <div className="min-h-0 border-b border-border bg-muted/10 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Messages
              </h3>
              <p className="text-xs text-muted-foreground">
                Select a message to read the full conversation
              </p>
            </div>

            <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-500">
              {items.length} Messages
            </span>
          </div>

          <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const isSelected = isSameItem(selectedItem, item);
              const isUnread =
                item.unreadCount > 0 ||
                (!item.isRead && item.direction === "inbound");

              return (
                <button
                  key={getItemKey(item, idx)}
                  type="button"
                  onClick={() => handlePreviewItem(item)}
                  className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-purple-500/40 bg-purple-500/10 shadow-sm dark:bg-purple-500/15"
                      : "border-border/70 bg-background hover:border-purple-500/30 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="block truncate text-[13px] font-bold leading-5 text-foreground">
                          {getDisplayPerson(item)}
                        </p>

                        {isUnread && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            title="Unread Message"
                          />
                        )}
                      </div>

                      <p className="mt-1 block truncate text-xs font-semibold text-foreground">
                        {getMessageTitle(item)}
                      </p>
                    </div>

                    <span className="shrink-0 max-w-[96px] text-right text-[10px] font-semibold leading-4 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {getMessagePreview(item)}
                  </p>

                  {item.isChatConversation && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-1 text-[10px] font-bold text-purple-500">
                      <MessageSquare size={11} />
                      Internal Chat
                    </div>
                  )}

                  {!item.isChatConversation &&
                    item.attachments &&
                    item.attachments.length > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-1 text-[10px] font-bold text-purple-500">
                        <FileText size={11} />
                        {item.attachments.length} Attachment
                        {item.attachments.length > 1 ? "s" : ""}
                      </div>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto bg-background p-5">
          {!selectedItem ? (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-muted-foreground">
              <MessageSquare size={42} className="mb-3 opacity-40" />
              <p className="text-sm font-bold text-foreground">
                Select a message
              </p>
              <p className="mt-1 text-xs">The full message will appear here.</p>
            </div>
          ) : (
            <div className="flex min-h-full flex-col">
              <div className="border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
                      {selectedItem.isChatConversation
                        ? "Chat Preview"
                        : "Message Preview"}
                    </span>

                    <h3 className="mt-1 text-2xl font-extrabold leading-tight text-foreground">
                      {getMessageTitle(selectedItem)}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                    title="Close preview"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 grid gap-2 rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-muted-foreground">
                      {selectedItem.isChatConversation ? "Chat With" : "From"}
                    </p>

                    <p className="mt-1 break-all font-bold text-foreground">
                      {getDisplayPerson(selectedItem)}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground">Type</p>

                    <p className="mt-1 break-all font-bold text-foreground">
                      {selectedItem.isChatConversation
                        ? "Internal Chat"
                        : selectedItem.type || "Message"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="font-semibold text-muted-foreground">Date</p>

                    <p className="mt-1 font-semibold text-muted-foreground">
                      {selectedItem.createdAt
                        ? new Date(selectedItem.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex-1 rounded-2xl border border-border/80 bg-muted/10 p-5 text-sm leading-relaxed text-foreground shadow-sm">
                {selectedItem.isChatConversation ? (
                  <p className="whitespace-pre-wrap">
                    {getMessagePreview(selectedItem) ||
                      selectedItem.lastMessage ||
                      "No message preview available."}
                  </p>
                ) : (
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: selectedItem.body?.includes("<")
                        ? selectedItem.body
                        : selectedItem.body?.replace(/\n/g, "<br/>") ||
                          getMessagePreview(selectedItem) ||
                          "No message body available.",
                    }}
                  />
                )}
              </div>

              {!selectedItem.isChatConversation &&
                selectedItem.attachments &&
                selectedItem.attachments.length > 0 && (
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
                          <FileText size={15} className="text-purple-500" />
                          <span>{att.name || "Attachment"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-border/60 pt-4">
                {!selectedItem.isChatConversation && (
                  <button
                    onClick={() => handleDelete(selectedItem)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}

                {selectedItem.isChatConversation ? (
                  <button
                    onClick={() => handleOpenItem(selectedItem)}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-purple-700"
                  >
                    <MessageSquare size={14} />
                    Continue Chat with {getDisplayPerson(selectedItem)}
                  </button>
                ) : (
                  <button
                    onClick={() => handleReply(selectedItem)}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-purple-700"
                  >
                    <Reply size={14} />
                    Reply to {selectedItem.to || selectedItem.from || "Message"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
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
                    onClick={() => {
                      setSelectedItem(null);
                      setActiveTab("email");
                    }}
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
                    onClick={() => {
                      setSelectedItem(null);
                      setActiveTab("message");
                    }}
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
              </div>

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:static"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
              {activeTab === "email"
                ? renderEmailChatLayout()
                : renderMessageChatLayout()}
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