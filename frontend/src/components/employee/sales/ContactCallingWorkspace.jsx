"use client";

import { useMemo, useState } from "react";
import {
  PhoneCall,
  PhoneOff,
  Mail,
  Search,
  List,
  Plus,
  ArrowLeft,
  X,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import NewLeadModal from "./NewLeadModal";

const initialContacts = [
  {
    id: 1,
    name: "Rohan Mehta",
    contact: "+91 98765 43210",
    email: "rohan.mehta@example.com",
    status: "Answered",
    remark: "Call answered and lead is interested.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    contact: "+91 91234 56789",
    email: "priya.sharma@example.com",
    status: "Unanswered",
    remark: "No response on first attempt.",
  },
  {
    id: 3,
    name: "Amit Verma",
    contact: "+91 98987 76554",
    email: "amit.verma@example.com",
    status: "Rejected",
    remark: "Not interested right now.",
  },
  {
    id: 4,
    name: "Neha Bansal",
    contact: "+91 88776 44132",
    email: "neha.bansal@example.com",
    status: "Busy",
    remark: "Asked to call later.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    contact: "+91 97654 32109",
    email: "vikram.singh@example.com",
    status: "Not Connected",
    remark: "Network issue.",
  },
  {
    id: 6,
    name: "Kavita Iyer",
    contact: "+91 90909 11223",
    email: "kavita.iyer@example.com",
    status: "",
    remark: "",
  },
  {
    id: 7,
    name: "Rohan Das",
    contact: "+91 93456 77889",
    email: "rohan.das@example.com",
    status: "",
    remark: "",
  },
  {
    id: 8,
    name: "Anjali Kapoor",
    contact: "+91 96123 44567",
    email: "anjali.kapoor@example.com",
    status: "",
    remark: "",
  },
  {
    id: 9,
    name: "Siddharth Jain",
    contact: "+91 88220 99887",
    email: "siddharth.jain@example.com",
    status: "",
    remark: "",
  },
  {
    id: 10,
    name: "Meera Nair",
    contact: "+91 99011 22334",
    email: "meera.nair@example.com",
    status: "",
    remark: "",
  },
];

const dialPadKeys = [
  { number: "1", letters: "" },
  { number: "2", letters: "ABC" },
  { number: "3", letters: "DEF" },
  { number: "4", letters: "GHI" },
  { number: "5", letters: "JKL" },
  { number: "6", letters: "MNO" },
  { number: "7", letters: "PQRS" },
  { number: "8", letters: "TUV" },
  { number: "9", letters: "WXYZ" },
  { number: "*", letters: "" },
  { number: "0", letters: "+" },
  { number: "#", letters: "" },
];

const statusOptions = [
  "Answered",
  "Unanswered",
  "Rejected",
  "Busy",
  "Not Connected",
];

const contactsPerPage = 5;

const getStatusClass = (status) => {
  const styles = {
    Answered:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25",
    Unanswered:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25",
    Rejected:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25",
    Busy:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25",
    "Not Connected":
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/25",
  };

  return (
    styles[status] ||
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  );
};

export default function ContactCallingWorkspace({ onBack }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(initialContacts[0]);
  const [dialNumber, setDialNumber] = useState(initialContacts[0].contact);
  const [isCalling, setIsCalling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [leadModalTab, setLeadModalTab] = useState(null);
  const [statusModalContact, setStatusModalContact] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const query = searchQuery.toLowerCase();

      return (
        contact.name.toLowerCase().includes(query) ||
        contact.contact.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
      );
    });
  }, [contacts, searchQuery]);

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedContacts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;

    return filteredContacts.slice(startIndex, endIndex);
  }, [filteredContacts, safeCurrentPage]);

  const handleDialKey = (key) => {
    setDialNumber((prev) => `${prev}${key}`);
  };

  const handleSelectContactForCall = (contact) => {
    setSelectedContact(contact);
    setDialNumber(contact.contact);
    setIsCalling(false);
  };

  const handleEmailClick = (contact) => {
    window.location.href = `mailto:${contact.email}`;
  };

  const openStatusModal = (contact) => {
    setStatusModalContact(contact);
    setStatusValue(contact.status || "");
    setRemarkValue(contact.remark || "");
  };

  const openLeadModal = (tabName) => {
    setLeadModalTab(tabName);
    setShowLeadDropdown(false);
  };

  const saveStatus = () => {
    if (!statusModalContact || !statusValue) return;

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === statusModalContact.id
          ? {
              ...contact,
              status: statusValue,
              remark: remarkValue,
            }
          : contact
      )
    );

    if (selectedContact?.id === statusModalContact.id) {
      setSelectedContact((prev) => ({
        ...prev,
        status: statusValue,
        remark: remarkValue,
      }));
    }

    setStatusModalContact(null);
    setStatusValue("");
    setRemarkValue("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-white text-primary shadow-sm transition hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Contact Calling Workspace
            </h1>

            <p className="mt-2 text-muted-foreground">
              Make calls, manage assigned contacts, and update call status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowLeadDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-105"
            >
              <Plus size={18} />
              New Lead
              <ChevronDown
                size={16}
                className={`transition ${
                  showLeadDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showLeadDropdown && (
  <div
    className={`
      absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border shadow-xl
      ${
        isDarkMode
          ? "border-slate-700 bg-slate-900 shadow-black/40"
          : "border-violet-200 bg-white shadow-violet-500/15"
      }
    `}
  >
    <button
      onClick={() => openLeadModal("Client Projects")}
      className={`
        block w-full px-4 py-3 text-left text-sm font-semibold transition
        ${
          isDarkMode
            ? "text-slate-100 hover:bg-primary/10"
            : "text-[#260b45] hover:bg-[#fbf7ff]"
        }
      `}
    >
      Client Project
    </button>

    <button
      onClick={() => openLeadModal("Internships")}
      className={`
        block w-full border-t px-4 py-3 text-left text-sm font-semibold transition
        ${
          isDarkMode
            ? "border-slate-800 text-slate-100 hover:bg-primary/10"
            : "border-violet-100 text-[#260b45] hover:bg-[#fbf7ff]"
        }
      `}
    >
      Internship
    </button>

    <button
      onClick={() => openLeadModal("Training")}
      className={`
        block w-full border-t px-4 py-3 text-left text-sm font-semibold transition
        ${
          isDarkMode
            ? "border-slate-800 text-slate-100 hover:bg-primary/10"
            : "border-violet-100 text-[#260b45] hover:bg-[#fbf7ff]"
        }
      `}
    >
      Training Program
    </button>
  </div>
)}
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20">
            <List size={18} />
            Contact List
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Dialpad */}
        <div className="contact-workspace-card glass-card rounded-2xl border border-border p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-primary dark:bg-primary/10">
              <PhoneCall size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">Dialpad</h2>
              <p className="text-sm text-muted-foreground">
                Make calls directly
              </p>
            </div>
          </div>

          <div className="contact-workspace-soft mb-5 rounded-xl border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Selected Number
            </p>

            <p className="text-xl font-bold text-foreground">{dialNumber}</p>

            <p className="mt-2 text-xs text-muted-foreground">
              {selectedContact
                ? `Selected: ${selectedContact.name}`
                : "Selected from contact list"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {dialPadKeys.map((key) => (
              <button
                key={key.number}
                onClick={() => handleDialKey(key.number)}
                className="contact-dial-key flex h-16 w-16 flex-col items-center justify-center rounded-full border border-violet-100 bg-white text-foreground shadow-sm transition hover:scale-105 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
              >
                <span className="text-xl font-bold">{key.number}</span>

                {key.letters && (
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {key.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setIsCalling(true)}
              disabled={isCalling || !dialNumber}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                isCalling || !dialNumber
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] hover:bg-emerald-600"
              }`}
            >
              <PhoneCall size={18} />
              Call
            </button>

            <button
              onClick={() => setIsCalling(false)}
              disabled={!isCalling}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                isCalling
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:scale-[1.02] hover:bg-red-600"
                  : "cursor-not-allowed border border-red-100 bg-red-50 text-red-300 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400/60"
              }`}
            >
              <PhoneOff size={18} />
              End Call
            </button>
          </div>
        </div>

        {/* Contacts */}
        <div className="contact-workspace-card glass-card rounded-2xl border border-border p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">
              Assigned Contacts
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage and track your assigned leads
            </p>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search contacts by name, number or email..."
                className="contact-search-input w-full rounded-xl border border-violet-100 bg-white py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>

          <div className="contact-table-wrap overflow-x-auto rounded-xl border border-violet-100 dark:border-slate-700">
            <table className="w-full min-w-[920px] text-left">
              <thead className="contact-table-head border-b border-violet-100 bg-violet-50/70 text-xs uppercase tracking-wider text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70">
                <tr>
                  <th className="px-4 py-4">S.No.</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4 text-center">Call</th>
                  <th className="px-4 py-4 text-center">Email</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-100 dark:divide-slate-800">
                {paginatedContacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={`contact-table-row transition hover:bg-violet-50/60 dark:hover:bg-primary/5 ${
                      selectedContact?.id === contact.id
                        ? "contact-table-row-selected bg-violet-50/80 dark:bg-primary/10"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">
                      {(safeCurrentPage - 1) * contactsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 text-sm font-bold text-foreground">
                      {contact.name}
                    </td>

                    <td className="px-4 py-4 text-sm text-foreground">
                      {contact.contact}
                    </td>

                    <td className="px-4 py-4 text-sm text-foreground">
                      {contact.email}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleSelectContactForCall(contact)}
                        className="contact-action-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-white text-primary transition hover:scale-110 hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20"
                      >
                        <PhoneCall size={16} />
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleEmailClick(contact)}
                        className="contact-action-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-white text-primary transition hover:scale-110 hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20"
                      >
                        <Mail size={16} />
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      {contact.status ? (
                        <button
                          onClick={() => openStatusModal(contact)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                            contact.status
                          )}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {contact.status}
                        </button>
                      ) : (
                        <button
                          onClick={() => openStatusModal(contact)}
                          className="contact-mark-status rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold text-primary shadow-sm transition hover:bg-violet-100 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-primary/10"
                        >
                          Mark Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              {filteredContacts.length === 0
                ? 0
                : (safeCurrentPage - 1) * contactsPerPage + 1}
              {" - "}
              {Math.min(
                safeCurrentPage * contactsPerPage,
                filteredContacts.length
              )}{" "}
              of {filteredContacts.length} contacts
            </p>

            {totalPages > 1 && (
              <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={safeCurrentPage === 1}
                  className="contact-pagination-btn h-9 rounded-lg px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
                        page === safeCurrentPage
                          ? "contact-pagination-btn-active"
                          : "contact-pagination-btn"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={safeCurrentPage === totalPages}
                  className="contact-pagination-btn h-9 rounded-lg px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {statusModalContact && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="contact-status-modal w-full max-w-md overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="contact-status-modal-header flex items-start justify-between border-b border-violet-100 px-6 py-5 dark:border-slate-700">
              <div>
                <h2 className="contact-status-modal-title text-xl font-bold text-foreground">
                  Update Call Status
                </h2>

                <p className="contact-status-modal-subtitle mt-1 text-sm text-muted-foreground">
                  {statusModalContact.name} · {statusModalContact.contact}
                </p>
              </div>

              <button
                onClick={() => setStatusModalContact(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-1 gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusValue(status)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      statusValue === status
                        ? "contact-status-option-active border-primary bg-violet-50 text-primary dark:bg-primary/10"
                        : "contact-status-option border-violet-100 bg-white text-foreground hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800/40"
                    }`}
                  >
                    <span>{status}</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        statusValue === status
                          ? "contact-status-radio-active border-primary bg-primary"
                          : "contact-status-radio border-violet-300 bg-white dark:border-slate-500 dark:bg-slate-900"
                      }`}
                    >
                      {statusValue === status && (
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Call Remark
                </label>

                <textarea
                  value={remarkValue}
                  onChange={(e) => setRemarkValue(e.target.value)}
                  rows={4}
                  placeholder="Add remark, e.g. call answered but not interested..."
                  className="contact-status-textarea w-full resize-none rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="contact-status-footer grid grid-cols-2 gap-3 border-t border-violet-100 px-6 py-5 dark:border-slate-700">
              <button
                onClick={() => setStatusModalContact(null)}
                className="contact-status-cancel rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-foreground transition hover:bg-violet-50 dark:border-slate-700 dark:bg-transparent dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={saveStatus}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.02]"
              >
                <CheckCircle2 size={17} />
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {leadModalTab && (
        <NewLeadModal
          isOpen={Boolean(leadModalTab)}
          activeTab={leadModalTab}
          onClose={() => setLeadModalTab(null)}
        />
      )}
    </div>
  );
}