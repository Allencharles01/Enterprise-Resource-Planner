import { useMemo, useRef, useState, useEffect } from "react";
import { Search, Send, MessageCircleMore } from "lucide-react";
import Modal from "../ui/Modal";
import { employees } from "../data/mockData";

export default function MessagesModal({ open, onClose }) {
  const [selected, setSelected] = useState(employees[0]);

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState(() => {
    const obj = {};

    employees.forEach((emp) => {
      obj[emp.id] = [...emp.messages];
    });

    return obj;
  });

  const messageEndRef = useRef(null);

  const messages = useMemo(() => {
    return chat[selected.id] || [];
  }, [chat, selected]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat((prev) => ({
      ...prev,
      [selected.id]: [
        ...prev[selected.id],
        {
          sender: "You",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));

    setMessage("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Messages"
      subtitle="Search and chat with employees"
      icon={<MessageCircleMore size={22} />}
      iconBg="bg-blue-500"
      maxWidth="max-w-6xl"
      bodyClassName="p-0 overflow-hidden"
    >
      <div className="grid h-[72vh] grid-cols-3 overflow-hidden">

        {/* LEFT PANEL */}

        <div className="flex h-full flex-col border-r border-gray-200 dark:border-white/10 overflow-hidden">

          <div className="border-b border-gray-200 p-4 dark:border-white/10">

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                placeholder="Search employee..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-white/5"
              />

            </div>

          </div>

          <div className="h-0 flex-1 overflow-y-auto p-3 space-y-2">

            {employees.map((emp) => (

              <button
                key={emp.id}
                onClick={() => setSelected(emp)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  selected.id === emp.id
                    ? "bg-blue-100 dark:bg-blue-500/20"
                    : "hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >

                <div className="flex justify-between">

                  <div>

                    <p className="font-medium">
                      {emp.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {emp.lastMessage}
                    </p>

                  </div>

                  <span className="text-xs text-gray-400">
                    {emp.time}
                  </span>

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="col-span-2 flex h-full min-h-0 flex-col overflow-hidden">

          <div className="shrink-0 border-b border-gray-200 p-4 dark:border-white/10">

            <h3 className="font-semibold">
              {selected.name}
            </h3>

            <p className="text-xs text-gray-500">
              {selected.role}
            </p>

          </div>

          {/* ONLY THIS AREA SCROLLS */}

          <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((msg, index) => (
                            <div
                key={index}
                className={`max-w-[70%] rounded-xl px-4 py-2 ${
                  msg.sender === "You"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white"
                }`}
              >
                <p>{msg.text}</p>

                <p className="mt-1 text-[10px] opacity-70">
                  {msg.time}
                </p>
              </div>
            ))}

            <div ref={messageEndRef} />

          </div>

          {/* FIXED INPUT */}

          <div className="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#0B1224]">

            <div className="flex gap-3">

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type message..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/5"
              />

              <button
                onClick={sendMessage}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500"
              >
                <Send size={18} />
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-400">
              Press <span className="font-medium">Ctrl + Enter</span> to send
            </p>

          </div>

        </div>

      </div>

    </Modal>
  );
}