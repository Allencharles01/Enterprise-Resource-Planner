import {
    Activity,
    Megaphone,
    Users,
    Tv,
    FolderOpen,
} from "lucide-react";

import Modal from "../ui/Modal";
import { recentActivity } from "../data/mockData";

const activityIcons = {
    advertising: Megaphone,
    creators: Users,
    heavyAds: Tv,
    invoices: FolderOpen,
};

const activityColors = {
    advertising: "text-blue-500",
    creators: "text-purple-500",
    heavyAds: "text-orange-500",
    invoices: "text-teal-500",
};

export default function ActivityHistoryModal({ open, onClose }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Activity History"
            subtitle="Complete activity log"
            icon={<Activity size={22} />}
            iconBg="bg-blue-500"
            maxWidth="max-w-3xl"
            footer={
                <button
                    onClick={onClose}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-500"
                >
                    Close
                </button>
            }
        >
            <div className="space-y-4">
                {recentActivity.map((item) => {
                    const Icon = activityIcons[item.type] || Activity;

                    return (
                        <div
                            key={item.id}
                            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 ${activityColors[item.type]
                                    }`}              >
                                <Icon size={18} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {item.detail}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}