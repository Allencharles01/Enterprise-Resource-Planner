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
import { GmailComposerModal } from "./GmailComposerModal";
import { StartChatModal } from "./StartChatModal";
import { ChatWindowModal } from "./ChatWindowModal";

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
        api.get(`/api/internalChat/conversations-list?userId=${uId}&code=${uCode}&role=${uRole}`).catch(() => ({ data: [] })),
        api.get(`/api/emails?type=message`).catch(() => ({ data: [] })),
      ])
        .then(([chatRes, emailRes]) => {
          const chats = (chatRes.data || []).map((c) => ({ ...c, isChatConversation: true }));
          const emails = (emailRes.data || []).map((e) => ({ ...e, isChatConversation: false }));
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
                id: parsed.id || parsed._id || (parsed.role === "admin" ? "ADMIN_ID" : "EMP_ID"),
                name: parsed.name || "System Admin",
                code: parsed.employeeCode || parsed.employeeId || (parsed.role === "admin" ? "ADMIN" : "EMP"),
                role: parsed.role || "admin",
              });
            } else {
              const name = localStorage.getItem("userName") || "System Admin";
              const role = localStorage.getItem("userRole") || "admin";
              const code = localStorage.getItem("userEmployeeCode") || (role === "admin" ? "ADMIN" : "EMP");
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
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !selectedItem && !isComposerOpen && !isStartChatOpen && !selectedChatRecipient) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, Boolean(selectedItem), isComposerOpen, isStartChatOpen, Boolean(selectedChatRecipient)]);


  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/emails/${item._id}`);
        if (selectedItem?._id === item._id) setSelectedItem(null);
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

  const handleOpenItem = async (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === item._id ||
          (item.rawPartner &&
            i.rawPartner &&
            (i.rawPartner._id === item.rawPartner._id || i.rawPartner.id === item.rawPartner.id))
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
          await api.patch("/api/internalChat/read", {
            senderId,
            recipientId,
            senderCode,
            recipientCode,
          }).catch(() => { });
        }
      } catch (e) { }
    } else {
      setSelectedItem(item);
      try {
        await api.put(`/api/emails/${item._id}`, { isRead: true }).catch(() => { });
      } catch (e) { }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border/50 bg-muted/20 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Communication & Email Center
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage client correspondence, replies, and system alerts
                  </p>
                </div>
              </div>

              {/* Center Toggle & Compose Button */}
              <div className="flex items-center gap-3">
                <div className="flex bg-muted p-1 rounded-xl border border-border/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("email")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "email"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Mail size={14} />
                    Email Box
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] flex items-center gap-1 font-bold">
                      {activeTab === "email" ? items.length : ""}
                      {activeTab === "email" && items.some((i) => !i.isRead && i.direction === "inbound") && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-sm" title="Unread Email" />
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("message")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "message"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <MessageSquare size={14} />
                    Messages
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 text-[10px] flex items-center gap-1 font-bold">
                      {activeTab === "message" ? items.length : ""}
                      {activeTab === "message" && items.some((i) => i.unreadCount > 0 || (!i.isRead && i.direction === "inbound")) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-sm" title="Unread Message" />
                      )}
                    </span>
                  </button>
                </div>

                {activeTab === "email" ? (
                  <button
                    onClick={handleComposeNew}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <Plus size={15} /> Compose Email
                  </button>
                ) : (
                  <button
                    onClick={() => setIsStartChatOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <MessageSquare size={15} /> Start Chat
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors absolute top-4 right-4 sm:static"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left/Main List Table */}
              <div
                className={`overflow-y-auto p-6 ${selectedItem
                  ? "hidden md:block md:w-[38%] border-r border-border"
                  : "w-full"
                  }`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground space-y-3">
                    <Inbox size={48} className="mx-auto opacity-40" />
                    <p className="font-semibold">No {activeTab} history recorded yet.</p>
                    {activeTab === "email" ? (
                      <button
                        onClick={handleComposeNew}
                        className="text-xs text-blue-500 font-bold hover:underline"
                      >
                        Click here to send your first email &rarr;
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsStartChatOpen(true)}
                        className="text-xs text-purple-500 font-bold hover:underline"
                      >
                        Click here to start a chat &rarr;
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden bg-background">

                    {/* Search */}
                    <div className="p-4 border-b border-border">
                      <input
                        type="text"
                        placeholder="🔍 Search emails..."
                        className="
        w-full
        rounded-xl
        border
        border-border
        bg-muted/20
        px-4
        py-3
        text-sm
        outline-none
        focus:ring-2
        focus:ring-primary
      "
                      />
                    </div>

                    {/* Inbox */}
                    <div className="max-h-[600px] overflow-y-auto">

                      {items.map((item) => (

                        <button
                          key={item._id}
                          onClick={() => handleOpenItem(item)}
                          className={`
          w-full
          text-left
          px-5
          py-4
          border-b
          border-border
          transition-all
          duration-200

          hover:bg-primary/5
hover:shadow-lg
hover:shadow-primary/10
hover:scale-[1.01]

          ${selectedItem?._id === item._id
                              ? "bg-primary/10 border-l-4 border-l-primary"
                              : ""
                            }
        `}
                        >

                          <div className="flex items-start justify-between">

                            <div className="flex gap-3 flex-1 items-start">
                              {/* Avatar */}
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                                {(item.from || item.to || "?")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="flex-1 min-w-0">

                                {/* Sender */}
                                <div className="flex items-start justify-between">

  <div className="min-w-0 flex-1">

    {(() => {
      const sender = item.from || item.to || "";
      const match = sender.match(/^(.*?)\s*<(.*)>$/);

      return (
        <>
          <h4 className="font-semibold text-[15px] leading-tight text-foreground truncate">
            {match ? match[1] : sender}
          </h4>

          {match && (
            <p className="text-[11px] text-muted-foreground truncate">
              {match[2]}
            </p>
          )}
        </>
      );
    })()}

  </div>

  {(item.unreadCount > 0 ||
    (!item.isRead && item.direction === "inbound")) && (
    <span className="ml-2 mt-1 h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
  )}

</div>

                                {/* Subject */}

                                <p className="font-medium text-sm text-foreground mt-1 truncate">

                                  {item.subject || "No Subject"}

                                </p>

                                {/* Message Preview */}

                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">

                                  {item.body
                                    ?.replace(/<[^>]+>/g, "")
                                    ?.substring(0, 80)}

                                </p>

                              </div>

                            </div>

                            {/* Time */}

                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">

                              {new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}

                            </div>

                          </div>

                        </button>

                      ))}

                    </div>

                  </div>
                )}
              </div>

              {/* Right/Reading Panel if an item is selected */}
              {selectedItem && (
                <div className="w-full md:w-1/2 p-6 flex flex-col bg-muted/10 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-primary mb-1">
                        {selectedItem.from || "NovaNectar ERP"}
                      </div>
                      <h3 className="text-3xl font-bold text-foreground leading-tight">
                        {selectedItem.subject}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                      title="Close preview"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mb-6 rounded-2xl border border-border bg-muted/20 p-5">

                    <div className="flex items-start gap-4">

                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {(selectedItem.from || "N").charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">

                        {(() => {
                          const sender = selectedItem.from || "";
                          const match = sender.match(/^(.*?)\s*<(.*)>$/);

                          return (
                            <>
                              <h4 className="font-bold text-xl text-foreground">
                                {match ? match[1] : sender}
                              </h4>

                              {match && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {match[2]}
                                </p>
                              )}
                            </>
                          );
                        })()}

                        <p className="text-sm text-muted-foreground mt-1">
                          To: {selectedItem.to}
                        </p>

                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(selectedItem.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Body Content */}
                  <div
                    className="
    flex-1
    rounded-2xl
    bg-muted/10
    p-8
    text-[15px]
    leading-8
    text-foreground
    overflow-y-auto
    whitespace-pre-wrap
  "
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedItem.body?.includes("<")
                          ? selectedItem.body
                          : selectedItem.body?.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>

                  {/* Attachments if any */}
                  {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <span className="text-xs font-bold text-muted-foreground uppercase block mb-2">
                        Attached Files ({selectedItem.attachments.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-lg text-xs font-semibold"
                          >
                            <FileText size={15} className="text-blue-500" />
                            <span>{att.name || "Attachment"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Bar */}
                  <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                    <button
                      onClick={() => handleDelete(selectedItem)}
                      className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                    {selectedItem.isChatConversation ? (
                      <button
                        onClick={() => handleOpenItem(selectedItem)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <MessageSquare size={14} /> Continue Chat with {selectedItem.partnerName || selectedItem.to}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReply(selectedItem)}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Reply size={14} /> Reply to {selectedItem.to}
                      </button>
                    )}
                  </div>
                </div>
              )}
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