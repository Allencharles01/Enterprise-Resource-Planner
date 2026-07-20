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
          }).catch(() => {});
        }
      } catch (e) {}
    } else {
      setSelectedItem(item);
      try {
        await api.put(`/api/emails/${item._id}`, { isRead: true }).catch(() => {});
      } catch (e) {}
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
                <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl border border-violet-200">
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
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === "email"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail size={14} />
                    Email Box
                    <span className="px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] flex items-center gap-1 font-bold">
                      {activeTab === "email" ? items.length : ""}
                      {activeTab === "email" && items.some((i) => !i.isRead && i.direction === "inbound") && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-sm" title="Unread Email" />
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("message")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === "message"
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
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
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
              <div className={`flex-1 overflow-y-auto p-6 ${selectedItem ? "hidden md:block md:w-1/2 border-r border-border" : "w-full"}`}>
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
                        className="text-xs text-violet-600 font-bold hover:underline"
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
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-5 py-3.5 font-semibold w-16">#</th>
                          <th className="px-5 py-3.5 font-semibold">Recipient / Sender</th>
                          <th className="px-5 py-3.5 font-semibold">Subject</th>
                          <th className="px-5 py-3.5 font-semibold">Date</th>
                          <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr
                            key={item._id}
                            onClick={() => handleOpenItem(item)}
                            className={`border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${
                              selectedItem?._id === item._id ? "bg-primary/5 dark:bg-primary/10 font-medium" : ""
                            }`}
                          >
                            <td className="px-5 py-3.5 font-bold text-muted-foreground flex items-center">
                              <span>{idx + 1}</span>
                              {(item.unreadCount > 0 || (!item.isRead && item.direction === "inbound")) && (
                                <span
                                  className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1.5 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                                  title="New / Unread"
                                />
                              )}
                            </td>
                            <td className="px-5 py-3.5 font-bold text-foreground">
                              <span className="truncate max-w-[200px] block font-extrabold">
                                {item.to || item.from}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-foreground font-semibold truncate max-w-[220px]">
                              {item.subject}
                              {item.attachments && item.attachments.length > 0 && (
                                <span className="ml-2 inline-flex items-center text-violet-600" title="Has attachment">
                                  <FileText size={13} />
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() =>
                                    item.isChatConversation
                                      ? setSelectedChatRecipient(item.rawPartner)
                                      : setSelectedItem(item)
                                  }
                                  className="p-1.5 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                                  title={item.isChatConversation ? "Open chat window" : "Read message"}
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() =>
                                    item.isChatConversation
                                      ? setSelectedChatRecipient(item.rawPartner)
                                      : handleReply(item)
                                  }
                                  className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                  title={item.isChatConversation ? "Continue chat" : "Reply to correspondence"}
                                >
                                  <Reply size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
                )}
              </div>

              {/* Right/Reading Panel if an item is selected */}
              {selectedItem && (
                <div className="w-full md:w-1/2 p-6 flex flex-col bg-muted/10 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wider block">
                        {selectedItem.type === "email" ? "Email Correspondence" : "System Message"}
                      </span>
                      <h3 className="text-lg font-extrabold text-foreground tracking-tight mt-0.5">
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

                  <div className="space-y-3 text-xs border-b border-border/60 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">Recipient (To):</span>
                      <span className="font-bold text-foreground">{selectedItem.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">Sender (From):</span>
                      <span className="font-semibold text-foreground">{selectedItem.from || "NovaNectar ERP"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">Timestamp:</span>
                      <span className="text-muted-foreground">{new Date(selectedItem.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 bg-background p-5 rounded-xl border border-border/80 text-sm leading-relaxed text-foreground overflow-y-auto whitespace-pre-wrap">
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
                            <FileText size={15} className="text-violet-600" />
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
                        className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
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