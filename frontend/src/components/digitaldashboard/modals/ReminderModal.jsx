import { useState } from "react";
import { BellRing } from "lucide-react";
import Modal from "../ui/Modal";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-purple-500/20";

const initialForm = {
  subject: "",
  message: "",
  date: "",
  time: "",
};

export default function ReminderModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onClose();
    setForm(initialForm);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<BellRing size={22} />}
      iconBg="bg-purple-500"
      title="Set a Reminder"
      subtitle="Get notified about important follow-ups and tasks."
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Save Reminder
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
          <input
            className={inputCls}
            placeholder="Call NovaNectar Client about Budget Alterations"
            value={form.subject}
            onChange={update("subject")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            rows={4}
            className={inputCls}
            placeholder="Add discussion points and important notes for call."
            value={form.message}
            onChange={update("message")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" className={inputCls} value={form.date} onChange={update("date")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
            <input type="time" className={inputCls} value={form.time} onChange={update("time")} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
