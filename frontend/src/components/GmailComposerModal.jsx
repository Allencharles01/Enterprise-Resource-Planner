import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isOpen) {
      setTo(initialTo);
      setSubject(initialSubject);
    }
  }, [isOpen, initialTo, initialSubject]);

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
          className="gmail-composer-light-root w-[560px] max-w-[95vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.25)] overflow-hidden pointer-events-auto flex flex-col"
        >
          {/* Gmail Title Bar */}
          <div className="flex items-center justify-between border-b border-violet-200 bg-[#f3e8ff] px-4 py-3 text-[#260b45] cursor-pointer select-none dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100">
            <span className="flex items-center gap-2 text-sm font-bold tracking-wide">
              New Message
              {initialTo && (
                <span className="max-w-[220px] truncate text-xs font-normal text-[#7a6692] dark:text-slate-500">
                  ({initialTo})
                </span>
              )}
            </span>

            <div className="flex items-center gap-1.5 text-[#7a6692] dark:text-slate-300">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded p-1 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                title="Minimize"
              >
                <Minus size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="rounded p-1 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                title="Pop-out"
              >
                <Maximize2 size={14} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 transition-colors hover:bg-red-500 hover:text-white"
                title="Close & Discard"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex max-h-[75vh] flex-1 flex-col overflow-y-auto bg-white dark:bg-slate-900">
              {sentSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-auto space-y-4 px-6 py-16 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-primary ring-8 ring-violet-100/60 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/5">
                    <CheckCircle2 size={36} />
                  </div>

                  <h4 className="text-xl font-bold text-[#260b45] dark:text-white">
                    Message Sent!
                  </h4>

                  <p className="text-sm text-[#7a6692] dark:text-slate-400">
                    Your email has been dispatched to {to}.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="flex flex-1 flex-col">
                  {/* To Field */}
                  <div className="flex items-center justify-between border-b border-violet-100 px-4 py-2.5 text-sm dark:border-slate-800">
                    <div className="flex flex-1 items-center gap-2">
                      <span className="w-12 font-semibold text-[#7a6692] dark:text-slate-500">
                        To
                      </span>

                      <input
                        type="email"
                        required
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Recipient email address..."
                        className="flex-1 border-none bg-transparent font-semibold text-[#260b45] outline-none placeholder:text-[#9b82b5] dark:text-slate-100 dark:placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-[#7a6692] dark:text-slate-500">
                      <button
                        type="button"
                        onClick={() => setShowCc(!showCc)}
                        className="hover:text-primary hover:underline dark:hover:text-blue-500"
                      >
                        Cc Bcc
                      </button>
                    </div>
                  </div>

                  {/* Optional CC Field */}
                  {showCc && (
                    <div className="flex items-center border-b border-violet-100 bg-[#fbf7ff] px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/30">
                      <span className="w-12 font-semibold text-[#7a6692] dark:text-slate-500">
                        Cc
                      </span>

                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="Additional recipients..."
                        className="flex-1 border-none bg-transparent text-[#260b45] outline-none placeholder:text-[#9b82b5] dark:text-slate-100 dark:placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {/* Subject Field */}
                  <div className="flex items-center border-b border-violet-100 px-4 py-2.5 text-sm dark:border-slate-800">
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full border-none bg-transparent font-semibold text-[#260b45] outline-none placeholder:text-[#7a6692] dark:text-slate-100 dark:placeholder:text-slate-400"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div className="min-h-[220px] flex-1 bg-white p-4 dark:bg-slate-900">
                    <textarea
                      required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email here..."
                      className="h-full min-h-[180px] w-full resize-none border-none bg-transparent font-sans text-sm leading-relaxed text-[#260b45] outline-none placeholder:text-[#7a6692] dark:text-slate-100 dark:placeholder:text-slate-400"
                    />
                  </div>

                  {/* Attached Files List */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-violet-100 bg-[#fbf7ff] px-4 py-2 dark:border-slate-800/80 dark:bg-slate-800/40">
                      {attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs text-[#260b45] shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <FileText
                            size={14}
                            className="shrink-0 text-primary dark:text-blue-500"
                          />

                          <span className="max-w-[160px] truncate font-semibold">
                            {att.name}
                          </span>

                          <span className="text-[10px] text-[#7a6692] dark:text-slate-400">
                            ({att.size})
                          </span>

                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="ml-1 text-[#7a6692] transition-colors hover:text-red-500 dark:text-slate-400"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gmail Bottom Toolbar Bar */}
                  <div className="flex items-center justify-between border-t border-violet-100 bg-[#fbf7ff] px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
                    {/* Left: Send Button with Split Arrow + Icons */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex overflow-hidden rounded-full shadow-md shadow-violet-500/20 dark:shadow-blue-500/20">
                        <button
                          type="submit"
                          disabled={isSending}
                          className="flex cursor-pointer items-center gap-2 bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-violet-700 active:bg-violet-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
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

                        <div className="w-px bg-violet-400 dark:bg-blue-500"></div>

                        <button
                          type="button"
                          className="flex cursor-pointer items-center justify-center bg-primary px-2 py-2 text-white transition-colors hover:bg-violet-700 active:bg-violet-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
                          title="More send options"
                        >
                          <span className="text-xs font-bold leading-none">
                            ▼
                          </span>
                        </button>
                      </div>

                      {/* Gmail Toolbar Icons */}
                      <div className="ml-2 flex items-center gap-1 text-[#7a6692] dark:text-slate-300">
                        <button
                          type="button"
                          className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                          title="Formatting options"
                        >
                          <Type size={18} />
                        </button>

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
                            className="inline-flex cursor-pointer items-center rounded p-1.5 text-[#7a6692] transition-colors hover:bg-violet-100 dark:text-slate-300 dark:hover:bg-slate-700"
                            title="Attach files"
                          >
                            <Paperclip size={18} />
                          </label>
                        </div>

                        <button
                          type="button"
                          className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                          title="Insert link"
                        >
                          <Link2 size={18} />
                        </button>

                        <button
                          type="button"
                          className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                          title="Insert emoji"
                        >
                          <Smile size={18} />
                        </button>

                        <button
                          type="button"
                          className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                          title="Insert photo"
                        >
                          <ImageIcon size={18} />
                        </button>

                        <button
                          type="button"
                          className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                          title="Toggle confidential mode"
                        >
                          <Lock size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Right: Discard / Delete Draft */}
                    <div className="flex items-center gap-2 text-[#7a6692] dark:text-slate-500">
                      <button
                        type="button"
                        className="rounded p-1.5 transition-colors hover:bg-violet-100 dark:hover:bg-slate-700"
                        title="More options"
                      >
                        <MoreVertical size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-500"
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