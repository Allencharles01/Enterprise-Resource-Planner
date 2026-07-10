import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

export default function CalendarPopup({ open, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-24">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#0B1224]">
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Calendar
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <DatePicker
          inline
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
    </div>
  );
}