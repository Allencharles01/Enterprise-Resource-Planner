"use client";

import { useEffect, useState } from "react";
import { X, Paperclip, Save, Trash2, Send } from "lucide-react";

const inputClass =
  "w-full rounded-2xl bg-[#1b2333] border border-slate-700/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition";

export default function EmployeeMessagesModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [messageData, setMessageData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
  if (!isOpen) return;

  const handleEsc = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMessageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      "employeeMessageDraft",
      JSON.stringify({
        ...messageData,
        files: files.map((file) => file.name),
      }),
    );

    alert("Draft saved successfully.");
  };

  const handleDelete = () => {
    setMessageData({
      to: "",
      subject: "",
      message: "",
    });

    setFiles([]);
    localStorage.removeItem("employeeMessageDraft");
  };

  const handleSend = () => {
    if (!messageData.to || !messageData.subject || !messageData.message) {
      alert("Please fill To, Subject, and Message before sending.");
      return;
    }

    alert("Message sent successfully.");

    setMessageData({
      to: "",
      subject: "",
      message: "",
    });

    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">New Message</h2>
            <p className="mt-1 text-sm text-slate-400">
              Compose and send a message to admin or team members
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 hover:scale-105 active:scale-95 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              To:
            </label>
            <input
              name="to"
              value={messageData.to}
              onChange={handleChange}
              className={inputClass}
              placeholder="admin@novanectar.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Subject:
            </label>
            <input
              name="subject"
              value={messageData.subject}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter message subject"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Message:
            </label>
            <textarea
              name="message"
              value={messageData.message}
              onChange={handleChange}
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Write your message here..."
            />
          </div>

          <div>
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-600 bg-[#151e2e] px-4 py-4 text-sm font-semibold text-slate-400 hover:border-indigo-500 hover:text-indigo-300 transition">
              <Paperclip size={18} />
              Attach File
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-[#1b2333] px-4 py-2"
                  >
                    <span
                      title={file.name}
                      className="min-w-0 flex-1 break-all text-sm font-medium text-slate-200"
                    >
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-3 border-t border-slate-700/60 px-6 py-5">
          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
          >
            <Save size={17} />
            Save Draft
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 size={17} />
            Delete
          </button>

          <button
            onClick={handleSend}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition"
          >
            <Send size={17} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}