import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";
import { deadlineNotifications, assignedProjects, } from "../data/mockData";

export default function NotificationsModal({ open, onClose }) {
  const [notifications, setNotifications] = useState(deadlineNotifications);
  const router = useRouter();

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  const openClientDashboard = (clientName) => {
    const project = assignedProjects.find(
      (p) => p.client === clientName
    );

    if (!project) return;

    onClose();
    router.push(`/employee/digitaldashboard/client/${project.id}`);
  };

  

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<Bell size={22} />}
      iconBg="bg-amber-500"
      title="Deadline Notifications"
      subtitle="Upcoming project deadlines"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            Close
          </button>

          <button
            onClick={markAllAsRead}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Mark All as Read
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => openClientDashboard(item.client)}
            className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400 hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className={getPriorityColor(item.priority)}>
              <AlertCircle size={22} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {item.client}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.task}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} />
                {item.dueDate}
              </div>
            </div>

            {item.read ? (
              <CheckCircle2
                size={18}
                className="text-green-500"
              />
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}