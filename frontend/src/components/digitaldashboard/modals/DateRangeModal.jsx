import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Modal from "../ui/Modal";

export default function DateRangeModal({
  open,
  onClose,
  onApply,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const apply = () => {
    if (!startDate || !endDate) return;

    onApply({
      startDate,
      endDate,
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Custom Date Range"
      subtitle="Select a start and end date"
      icon={<CalendarDays size={22} />}
      iconBg="bg-blue-500"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-white/10"
          >
            Cancel
          </button>

          <button
            onClick={apply}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            Apply
          </button>
        </>
      }
    >
      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/5"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/5"
          />
        </div>

      </div>
    </Modal>
  );
}