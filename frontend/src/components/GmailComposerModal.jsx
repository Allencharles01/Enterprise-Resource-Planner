import { useState } from "react";
import {
  X,
  Minus,
  Maximize2,
  Paperclip,
  Loader2,
  Trash2,
  CheckCircle2,
  Smile,
  Image as ImageIcon,
  Link2,
  Lock,
  MoreVertical,
  Type,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function GmailComposerModal({
  isOpen,
  onClose,
  initialTo = "",
  initialSubject = "",
  relatedInquiryId = null,
  onSuccess,
}) {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Update initial fields when modal opens or initialTo changes
  useState(() => {
    setTo(initialTo);
    setSubject(initialSubject);
  });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const reader = new FileReader();
      const base64Data = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
      setAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          data: base64Data,
        },
      ]);
    }
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!to || !subject || !body) {
      alert("Please enter To, Subject, and Body before sending.");
      return;
    }

    setIsSending(true);
    try {
      await api.post("/api/emails/send", {
        to,
        subject,
        body,
        attachments,
        type: "email",
        relatedInquiryId,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setBody("");
        setAttachments([]);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 right-6 z-[120] flex items-end justify-end pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            height: isMinimized ? "48px" : "auto",
          }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-[560px] max-w-[95vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.25)] overflow-hidden pointer-events-auto flex flex-col"
        >
          {/* Gmail Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/80 cursor-pointer text-slate-800 dark:text-slate-100 select-none">
            <span className="text-sm font-bold tracking-wide flex items-center gap-2">
              New Message
              {initialTo && (
                <span className="text-xs font-normal text-slate-500 truncate max-w-[220px]">
                  ({initialTo})
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                title="Minimize"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                title="Pop-out"
              >
                <Maximize2 size={14} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                title="Close & Discard"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col flex-1 max-h-[75vh] overflow-y-auto">
              {sentSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 px-6 text-center space-y-4 my-auto"
                >
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-500/5">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your email has been dispatched to {to}.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="flex flex-col flex-1">
                  {/* To Field */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 text-sm">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-slate-500 font-medium w-12">To</span>
                      <input
                        type="email"
                        required
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Recipient email address..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                      <button
                        type="button"
                        onClick={() => setShowCc(!showCc)}
                        className="hover:underline hover:text-blue-500"
                      >
                        Cc Bcc
                      </button>
                    </div>
                  </div>

                  {/* Optional CC Field */}
                  {showCc && (
                    <div className="flex items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-sm bg-slate-50/50 dark:bg-slate-800/30">
                      <span className="text-slate-500 font-medium w-12">Cc</span>
                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="Additional recipients..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {/* Subject Field */}
                  <div className="flex items-center px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 text-sm">
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-semibold"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div className="p-4 flex-1 min-h-[220px]">
                    <textarea
                      required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email here..."
                      className="w-full h-full min-h-[180px] bg-transparent border-none outline-none resize-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Attached Files List */}
                  {attachments.length > 0 && (
                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40 flex flex-wrap gap-2">
                      {attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-xs text-slate-700 dark:text-slate-200"
                        >
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="font-semibold truncate max-w-[160px]">
                            {att.name}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            ({att.size})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-slate-400 hover:text-red-500 ml-1 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gmail Bottom Toolbar Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
                    {/* Left: Send Button with Split Arrow + Icons */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex rounded-full shadow-md shadow-blue-500/20 overflow-hidden">
                        <button
                          type="submit"
                          disabled={isSending}
                          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-5 py-2 text-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Sending...
                            </>
                          ) : (
                            "Send"
                          )}
                        </button>
                        <div className="w-px bg-blue-500"></div>
                        <button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-2 py-2 flex items-center justify-center transition-colors cursor-pointer"
                          title="More send options"
                        >
                          <span className="text-xs font-bold leading-none">▼</span>
                        </button>
                      </div>

                      {/* Gmail Toolbar Icons */}
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 ml-2">
                        <button
                          type="button"
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Formatting options"
                        >
                          <Type size={18} />
                        </button>

                        {/* Attach file input (Paperclip) */}
                        <div className="relative">
                          <input
                            type="file"
                            id="gmail-attachment-upload"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="gmail-attachment-upload"
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer inline-flex items-center text-slate-600 dark:text-slate-300"
                            title="Attach files"
                          >
                            <Paperclip size={18} />
                          </label>
                        </div>

                        <button
                          type="button"
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Insert link"
                        >
                          <Link2 size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Insert emoji"
                        >
                          <Smile size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Insert photo"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Toggle confidential mode"
                        >
                          <Lock size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Right: Discard / Delete Draft */}
                    <div className="flex items-center gap-2 text-slate-500">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                        title="Discard draft"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
