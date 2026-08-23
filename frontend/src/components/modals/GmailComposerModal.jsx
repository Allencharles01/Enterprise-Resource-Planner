import { useEffect, useState, useMemo } from "react";
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
  currentUser = null,
  onSuccess,
  onSent,
}) {
  const [to, setTo] = useState(initialTo);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [myEmail, setMyEmail] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const getEmployeeEmail = (emp) => {
    if (!emp) return "";

    const candidates = [
      emp.work?.companyEmail,
      emp.personal?.contactEmail,
      emp.email,
      emp.workEmail,
      emp.username && emp.username.includes("@") ? emp.username : null,
    ];

    for (const raw of candidates) {
      if (raw && typeof raw === "string") {
        const clean = raw.trim();
        const lower = clean.toLowerCase();
        if (clean && lower !== "na" && lower !== "n/a" && lower !== "no email") {
          return clean;
        }
      }
    }

    const fn = (emp.personal?.firstName || "").trim().toLowerCase();
    const ln = (
      emp.personal?.lastName && emp.personal?.lastName !== "Emp"
        ? emp.personal?.lastName
        : ""
    ).trim().toLowerCase();
    const num = (emp.employeeNumber || "").trim();

    if (fn && ln) {
      return `${fn}.${ln}${num}@novanectar.demo`;
    }

    const code = (emp.employeeCode || emp.code || "").trim().toLowerCase();
    if (code && code !== "emp" && code !== "na") {
      return `${code}@novanectar.demo`;
    }

    return "employee@novanectar.demo";
  };

  const filteredEmployees = useMemo(() => {
    const query = (to || "").trim().toLowerCase();
    if (!query) return [];

    return employees
      .filter((emp) => {
        const fn = (emp.personal?.firstName || "").toLowerCase();
        const ln = (emp.personal?.lastName || "").toLowerCase();
        const fullName = `${fn} ${ln}`.trim();
        const nameAlt = (emp.name || "").toLowerCase();

        const empId = (
          emp.employeeCode ||
          emp.employeeNumber ||
          emp.id ||
          ""
        ).toLowerCase();
        const empNum = (emp.employeeNumber || "").toLowerCase();

        const cEmail = (emp.work?.companyEmail || "").toLowerCase();
        const pEmail = (emp.personal?.contactEmail || "").toLowerCase();
        const gEmail = (emp.email || "").toLowerCase();
        const resolvedEmail = getEmployeeEmail(emp).toLowerCase();

        return (
          fullName.includes(query) ||
          nameAlt.includes(query) ||
          empId.includes(query) ||
          empNum.includes(query) ||
          cEmail.includes(query) ||
          pEmail.includes(query) ||
          gEmail.includes(query) ||
          resolvedEmail.includes(query)
        );
      })
      .slice(0, 8);
  }, [employees, to]);

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!to || !subject || !body) {
      alert("Please enter To, Subject, and Body before sending.");
      return;
    }

    setIsSending(true);
    try {
      await api.post("/api/emails/send", {
        from: myEmail || currentUser?.email || "Employee",
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
        onClose?.();
        if (onSuccess) onSuccess();
        if (onSent) onSent();
      }, 1000);
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, to, subject, body, attachments, myEmail, currentUser]);

  useEffect(() => {
    if (isOpen) {
      setTo(initialTo);
      setSubject(initialSubject);

      // Fetch employee list for email suggestions
      api
        .get("/api/employees")
        .then((res) => {
          const list = res.data || [];
          setEmployees(list);

          if (initialTo) {
            let cleanT = initialTo.trim();
            if (cleanT.startsWith("EMP_")) cleanT = cleanT.replace("EMP_", "");
            if (cleanT.startsWith("EMAIL_")) cleanT = cleanT.replace("EMAIL_", "");
            cleanT = cleanT.toLowerCase();

            const found = list.find((e) => {
              const code = (e.employeeCode || e.code || "").toLowerCase().trim();
              const empNum = (e.employeeNumber || "").toLowerCase().trim();
              const cEmail = (e.work?.companyEmail || "").toLowerCase().trim();
              const pEmail = (e.personal?.contactEmail || "").toLowerCase().trim();
              const gEmail = (e.email || "").toLowerCase().trim();
              const rEmail = getEmployeeEmail(e).toLowerCase().trim();
              const fn = (e.personal?.firstName || "").toLowerCase().trim();
              const ln = (e.personal?.lastName && e.personal?.lastName !== "Emp" ? e.personal?.lastName : "").toLowerCase().trim();
              const fullName = `${fn} ${ln}`.trim();

              return (
                (code && code === cleanT) ||
                (empNum && empNum === cleanT) ||
                (cEmail && cEmail === cleanT && cEmail !== "na") ||
                (pEmail && pEmail === cleanT && pEmail !== "na") ||
                (gEmail && gEmail === cleanT && gEmail !== "na") ||
                (rEmail && rEmail === cleanT) ||
                (fullName && fullName === cleanT)
              );
            });

            if (found) {
              const fn = found.personal?.firstName || "";
              const ln =
                found.personal?.lastName && found.personal?.lastName !== "Emp"
                  ? found.personal?.lastName
                  : "";
              const fullName = `${fn} ${ln}`.trim() || found.name || "Employee";
              const officialEmail = getEmployeeEmail(found);
              setSelectedRecipient({
                name: fullName,
                email: officialEmail,
                code: found.employeeCode || found.employeeNumber || "",
              });
              setTo(officialEmail);
            } else {
              setSelectedRecipient(null);
            }
          } else {
            setSelectedRecipient(null);
          }
        })
        .catch(() => setEmployees([]));

      // Fetch logged-in user email if not provided
      if (currentUser?.email) {
        setMyEmail(currentUser.email);
      } else {
        api
          .get("/api/auth/me")
          .then((res) => {
            const u = res.data?.user || res.data;
            if (u?.email) setMyEmail(u.email);
          })
          .catch(() => {});
      }
    }
  }, [isOpen, initialTo, initialSubject, currentUser]);

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
          className="gmail-composer-modern w-[540px] max-w-[95vw] bg-slate-900 border border-slate-750 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100 cursor-pointer select-none">
            <span className="flex items-center gap-2 text-sm font-bold tracking-wide">
              New Message
              {initialTo && (
                <span className="max-w-[200px] truncate text-xs font-normal text-slate-400">
                  ({initialTo})
                </span>
              )}
            </span>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-full p-1.5 transition-colors hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center cursor-pointer"
                title="Minimize"
              >
                <Minus size={14} />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="rounded-full p-1.5 transition-colors hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center cursor-pointer"
                title="Pop-out"
              >
                <Maximize2 size={12} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-200 active:scale-95 shadow-sm shrink-0"
                title="Close & Discard"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex max-h-[70vh] flex-1 flex-col overflow-y-auto bg-slate-900">
              {sentSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-auto space-y-4 px-6 py-16 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/5">
                    <CheckCircle2 size={32} />
                  </div>

                  <h4 className="text-lg font-bold text-white">
                    Message Sent!
                  </h4>

                  <p className="text-xs text-slate-400">
                    Your email has been dispatched to {to}.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="flex flex-1 flex-col">
                  {/* To Field */}
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm">
                    <div className="relative flex flex-1 items-center gap-2">
                      <span className="w-8 font-semibold text-slate-400">
                        To
                      </span>

                      {selectedRecipient ? (
                        <div className="flex flex-1 items-center gap-2 py-0.5">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-750 bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-100">
                            <span>{selectedRecipient.name}</span>
                            <span className="font-mono text-[11px] font-normal text-blue-400">
                              &lt;{selectedRecipient.email}&gt;
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecipient(null);
                                setTo("");
                              }}
                              className="ml-1 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100 cursor-pointer"
                              title="Change recipient"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          required
                          value={to}
                          onChange={(e) => {
                            setTo(e.target.value);
                            setShowSuggestions(true);
                            setHighlightedIndex(0);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowSuggestions(false), 200);
                          }}
                          onKeyDown={(e) => {
                            if (showSuggestions && filteredEmployees.length > 0) {
                              if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setHighlightedIndex(
                                  (prev) => (prev + 1) % filteredEmployees.length
                                );
                              } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setHighlightedIndex(
                                  (prev) =>
                                    (prev - 1 + filteredEmployees.length) %
                                    filteredEmployees.length
                                );
                              } else if (
                                e.key === "Enter" &&
                                filteredEmployees[highlightedIndex]
                              ) {
                                e.preventDefault();
                                const selected = filteredEmployees[highlightedIndex];
                                const fn = selected.personal?.firstName || "";
                                const ln =
                                  selected.personal?.lastName &&
                                  selected.personal?.lastName !== "Emp"
                                    ? selected.personal?.lastName
                                    : "";
                                const fullName =
                                  `${fn} ${ln}`.trim() || selected.name || "Employee";
                                const officialEmail = getEmployeeEmail(selected);
                                setSelectedRecipient({
                                  name: fullName,
                                  email: officialEmail,
                                  code:
                                    selected.employeeCode ||
                                    selected.employeeNumber ||
                                    "",
                                });
                                setTo(officialEmail);
                                setShowSuggestions(false);
                              } else if (e.key === "Escape") {
                                setShowSuggestions(false);
                              }
                            }
                          }}
                          placeholder="Search by Employee Name, ID, or Email..."
                          className="flex-1 border-none bg-transparent font-medium text-slate-200 outline-none placeholder:text-slate-500"
                        />
                      )}

                      {/* Auto-suggest Dropdown */}
                      {!selectedRecipient && showSuggestions && filteredEmployees.length > 0 && (
                        <div className="absolute left-10 top-full z-50 mt-1 max-h-60 w-[calc(100%-2.5rem)] overflow-y-auto rounded-xl border border-slate-700 bg-slate-850 p-1.5 shadow-2xl">
                          {filteredEmployees.map((emp, index) => {
                            const fn = emp.personal?.firstName || "";
                            const ln =
                              emp.personal?.lastName &&
                              emp.personal?.lastName !== "Emp"
                                ? emp.personal?.lastName
                                : "";
                            const fullName =
                              `${fn} ${ln}`.trim() || emp.name || "Employee";
                            const empCode =
                              emp.employeeCode ||
                              emp.employeeNumber ||
                              emp.id ||
                              "EMP";
                            const email = getEmployeeEmail(emp);

                            const isHighlighted = index === highlightedIndex;

                            return (
                              <div
                                key={emp._id || emp.id || index}
                                onMouseDown={() => {
                                  setSelectedRecipient({
                                    name: fullName,
                                    email: email,
                                    code: empCode,
                                  });
                                  setTo(email);
                                  setShowSuggestions(false);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                                  isHighlighted
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-800/50"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="truncate font-bold">
                                    {fullName}
                                  </span>
                                  <span className="shrink-0 rounded-md bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                                    {empCode}
                                  </span>
                                </div>
                                <span className="ml-2 truncate font-mono text-[11px] text-slate-400">
                                  {email}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                      <button
                        type="button"
                        onClick={() => setShowCc(!showCc)}
                        className="hover:text-blue-400 hover:underline cursor-pointer"
                      >
                        Cc Bcc
                      </button>
                    </div>
                  </div>

                  {/* Optional CC Field */}
                  {showCc && (
                    <div className="flex items-center border-b border-slate-800 bg-slate-900/30 px-4 py-2 text-sm">
                      <span className="w-8 font-semibold text-slate-400">
                        Cc
                      </span>

                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="Additional recipients..."
                        className="flex-1 border-none bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
                      />
                    </div>
                  )}

                  {/* Subject Field */}
                  <div className="flex items-center border-b border-slate-800 px-4 py-2.5 text-sm">
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full border-none bg-transparent font-semibold text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div className="min-h-[200px] flex-1 bg-slate-950/20 p-4">
                    <textarea
                      required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Write your email here... (Press Ctrl + Enter to send)"
                      className="h-full min-h-[160px] w-full resize-none border-none bg-transparent font-sans text-sm leading-relaxed text-slate-200 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  {/* Attached Files List */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-slate-800 bg-slate-950/40 px-4 py-2">
                      {attachments.map((att, idx) => (
                        <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-slate-750 bg-slate-850 px-3 py-1.5 text-xs text-slate-200 shadow-md"
                        >
                          <FileText
                            size={14}
                            className="shrink-0 text-blue-400"
                          />

                          <span className="max-w-[160px] truncate font-semibold">
                            {att.name}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            ({att.size})
                          </span>

                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="ml-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Toolbar Bar */}
                  <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/20 px-4 py-3">
                    {/* Left: Send Button with Split Arrow + Icons */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex overflow-hidden rounded-xl shadow-md shadow-blue-500/10">
                        <button
                          type="submit"
                          disabled={isSending}
                          className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 text-sm font-bold transition-colors disabled:opacity-60"
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

                        <div className="w-px bg-blue-500/50"></div>

                        <button
                          type="button"
                          className="flex cursor-pointer items-center justify-center bg-blue-600 px-2 py-2 text-white transition-colors hover:bg-blue-500 active:bg-blue-700"
                          title="More send options"
                        >
                          <span className="text-xs font-bold leading-none">
                            ▼
                          </span>
                        </button>
                      </div>

                      {/* Gmail Toolbar Icons */}
                      <div className="ml-1 flex items-center gap-0.5 text-slate-400">
                        <button
                          type="button"
                          className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                          title="Formatting options"
                        >
                          <Type size={17} />
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
                            className="inline-flex cursor-pointer items-center rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            title="Attach files"
                          >
                            <Paperclip size={17} />
                          </label>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                          title="Insert link"
                        >
                          <Link2 size={17} />
                        </button>

                        <button
                          type="button"
                          className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                          title="Insert emoji"
                        >
                          <Smile size={17} />
                        </button>

                        <button
                          type="button"
                          className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                          title="Insert photo"
                        >
                          <ImageIcon size={17} />
                        </button>

                        <button
                          type="button"
                          className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                          title="Toggle confidential mode"
                        >
                          <Lock size={17} />
                        </button>
                      </div>
                    </div>

                    {/* Right: Discard / Delete Draft */}
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        className="rounded-xl p-2 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                        title="Discard draft"
                      >
                        <Trash2 size={17} />
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