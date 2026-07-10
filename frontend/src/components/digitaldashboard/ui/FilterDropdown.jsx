import { useState } from "react";
import DateRangeModal from "../modals/DateRangeModal";
import { ChevronDown } from "lucide-react";

const options = [
    "Today",
    "This Week",
    "This Month",
    "Past 3 Months",
    "Past 6 Months",
    "This Year",
    "Custom",
];

export default function FilterDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white"
            >
                <span className="text-gray-400">
                    Show data for:
                </span>

                <span className="font-semibold">
                    {value}
                </span>

                <ChevronDown size={16} />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0B1224] shadow-2xl">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                if (option === "Custom") {
                                    setOpen(false);
                                    setShowDateModal(true);
                                    return;
                                }

                                onChange(option);
                                setOpen(false);
                            }}
                            className={`block w-full px-4 py-3 text-left text-sm transition ${value === option
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                    <DateRangeModal
                        open={showDateModal}
                        onClose={() => setShowDateModal(false)}
                        onApply={({ startDate, endDate }) => {
                            onChange(`${startDate} - ${endDate}`);
                            setShowDateModal(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}