"use client";

import { useMemo, useState } from "react";
import {
  PhoneCall,
  PhoneOff,
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
import { GmailComposerModal } from "@/components/GmailComposerModal";

const initialContacts = [
  {
    id: 1,
    name: "Rohan Mehta",
    contact: "+91 98765 43210",
    email: "rohan.mehta@example.com",
    status: "Answered",
    remark: "Call answered and lead is interested.",
    month: "July 2026",
  },
  {
    id: 2,
    name: "Priya Sharma",
    contact: "+91 91234 56789",
    email: "priya.sharma@example.com",
    status: "Unanswered",
    remark: "No response on first attempt.",
    month: "July 2026",
  },
  {
    id: 3,
    name: "Amit Verma",
    contact: "+91 98987 76554",
    email: "amit.verma@example.com",
    status: "Rejected",
    remark: "Not interested right now.",
    month: "July 2026",
  },
  {
    id: 4,
    name: "Neha Bansal",
    contact: "+91 88776 44132",
    email: "neha.bansal@example.com",
    status: "Busy",
    remark: "Asked to call later.",
    month: "July 2026",
  },
  {
    id: 5,
    name: "Vikram Singh",
    contact: "+91 97654 32109",
    email: "vikram.singh@example.com",
    status: "Not Connected",
    remark: "Network issue.",
    month: "July 2026",
  },
  {
    id: 6,
    name: "Kavita Iyer",
    contact: "+91 90909 11223",
    email: "kavita.iyer@example.com",
    status: "",
    remark: "",
    month: "June 2026",
  },
  {
    id: 7,
    name: "Rohan Das",
    contact: "+91 93456 77889",
    email: "rohan.das@example.com",
    status: "",
    remark: "",
    month: "June 2026",
  },
  {
    id: 8,
    name: "Anjali Kapoor",
    contact: "+91 96123 44567",
    email: "anjali.kapoor@example.com",
    status: "",
    remark: "",
    month: "June 2026",
  },
  {
    id: 9,
    name: "Siddharth Jain",
    contact: "+91 88220 99887",
    email: "siddharth.jain@example.com",
    status: "",
    remark: "",
    month: "June 2026",
  },
  {
    id: 10,
    name: "Meera Nair",
    contact: "+91 99011 22334",
    email: "meera.nair@example.com",
    status: "",
    remark: "",
    month: "June 2026",
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

const contactListFilters = [
  "All",
  "Answered",
  "Unanswered",
  "Busy",
  "Rejected",
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
  const [dialNumberError, setDialNumberError] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [leadModalTab, setLeadModalTab] = useState(null);

  const [isContactListOpen, setIsContactListOpen] = useState(false);
  const [contactListFilter, setContactListFilter] = useState("All");
  const [expandedMonth, setExpandedMonth] = useState("July 2026");

  const [statusModalContact, setStatusModalContact] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [remarkValue, setRemarkValue] = useState("");

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerTo, setComposerTo] = useState("");
  const [composerSubject, setComposerSubject] = useState("");

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

  const filteredContactList = useMemo(() => {
    if (contactListFilter === "All") return contacts;

    return contacts.filter((contact) => contact.status === contactListFilter);
  }, [contacts, contactListFilter]);

  const groupedContactsByMonth = useMemo(() => {
    return filteredContactList.reduce((groups, contact) => {
      const month = contact.month || "Unassigned Month";

      if (!groups[month]) {
        groups[month] = [];
      }

      groups[month].push(contact);
      return groups;
    }, {});
  }, [filteredContactList]);

  const monthOrder = Object.keys(groupedContactsByMonth);

  const activeExpandedMonth = monthOrder.includes(expandedMonth)
    ? expandedMonth
    : monthOrder[0] || "";

  const getLocalDigits = (value) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.startsWith("91") && digitsOnly.length > 10) {
      return digitsOnly.slice(2);
    }

    return digitsOnly;
  };

  const validateDialNumber = (value) => {
    const localDigits = getLocalDigits(value);

    if (localDigits.length > 10) {
      setDialNumberError(
        "Invalid contact number. A contact number can only have 10 digits."
      );
    } else {
      setDialNumberError("");
    }
  };

  const handleDialKey = (key) => {
    setDialNumber((prev) => {
      const nextValue = `${prev}${key}`;
      validateDialNumber(nextValue);
      return nextValue;
    });
  };

  const handleDialInputChange = (e) => {
    const value = e.target.value;
    setDialNumber(value);
    validateDialNumber(value);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => {
      const nextValue = prev.slice(0, -1);
      validateDialNumber(nextValue);
      return nextValue;
    });
  };

  const handleSelectContactForCall = (contact) => {
    setSelectedContact(contact);
    setDialNumber(contact.contact);
    setDialNumberError("");
    setIsCalling(false);
  };

  const handleEmailClick = (contact) => {
    setComposerTo(contact.email);
    setComposerSubject("");
    setIsComposerOpen(true);
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

  const handleContactListFilterChange = (filter) => {
    setContactListFilter(filter);

    const nextFilteredContacts =
      filter === "All"
        ? contacts
        : contacts.filter((contact) => contact.status === filter);

    const firstMonth = nextFilteredContacts[0]?.month;

    if (firstMonth) {
      setExpandedMonth(firstMonth);
    }
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

  if (isContactListOpen) {
    return (
      <div className="space-y-5">
        {/* Contact List Full Screen Header */}
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsContactListOpen(false)}
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-primary shadow-sm transition hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20"
              title="Back to Dialpad"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Contact List
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Month-wise assigned contacts with call status and remarks.
              </p>
            </div>
          </div>
        </div>

        {/* Contact List Full Screen Content */}
        <div className="contact-list-window min-h-[calc(100vh-180px)] overflow-hidden rounded-2xl border shadow-2xl">
          <div className="contact-list-header border-b px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Monthly Contact Records</h2>

                <p className="text-xs">
                  Click any month to expand it. Opening one month will minimize
                  the other months.
                </p>
              </div>

              <div className="contact-list-filter-bar flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2">
                {contactListFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleContactListFilterChange(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      contactListFilter === filter
                        ? "contact-list-filter-active"
                        : "contact-list-filter"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-5 py-5">
            {monthOrder.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
                No contacts found for this filter.
              </div>
            ) : (
              <div className="space-y-4">
                {monthOrder.map((month) => {
                  const isExpanded = activeExpandedMonth === month;
                  const monthContacts = groupedContactsByMonth[month];

                  return (
                    <div
                      key={month}
                      className="contact-list-month-card overflow-hidden rounded-xl border"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedMonth(month)}
                        className={`contact-list-month-accordion flex w-full items-center justify-between px-5 py-4 text-left transition ${
                          isExpanded
                            ? "contact-list-month-expanded"
                            : "contact-list-month-collapsed"
                        }`}
                      >
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {month}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {isExpanded
                              ? "Expanded"
                              : "Click to expand this month"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/10">
                            {monthContacts.length} contacts
                          </span>

                          <ChevronDown
                            size={18}
                            className={`text-primary transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="contact-list-month-table-wrap border-t border-violet-100 dark:border-slate-700">
                          <table className="w-full table-fixed text-left">
                            <thead className="contact-list-table-head text-[11px] uppercase tracking-wider">
                              <tr>
                                <th className="w-[70px] px-4 py-3">S.No.</th>
                                <th className="w-[18%] px-4 py-3">Name</th>
                                <th className="w-[18%] px-4 py-3">Contact</th>
                                <th className="w-[24%] px-4 py-3">Email</th>
                                <th className="w-[16%] px-4 py-3">
                                  Call Status
                                </th>
                                <th className="w-[24%] px-4 py-3">Remark</th>
                              </tr>
                            </thead>

                            <tbody>
                              {monthContacts.map((contact, index) => (
                                <tr
                                  key={contact.id}
                                  className="contact-list-table-row"
                                >
                                  <td className="px-4 py-3 text-sm font-semibold">
                                    {index + 1}
                                  </td>

                                  <td className="px-4 py-3 text-sm font-bold">
                                    <span className="block truncate">
                                      {contact.name}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3 text-sm">
                                    <span className="block truncate">
                                      {contact.contact}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3 text-sm">
                                    <span className="block truncate">
                                      {contact.email}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3">
                                    {contact.status ? (
                                      <span
                                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClass(
                                          contact.status
                                        )}`}
                                      >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                                        <span className="truncate">
                                          {contact.status}
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="text-xs font-semibold text-muted-foreground">
                                        Not marked
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-4 py-3 text-sm">
                                    <span className="block truncate text-muted-foreground">
                                      {contact.remark || "No remark added"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <GmailComposerModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          initialTo={composerTo}
          initialSubject={composerSubject}
          onSuccess={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-primary shadow-sm transition hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Contact Calling Workspace
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Make calls, manage assigned contacts, and update call status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setShowLeadDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-105"
            >
              <Plus size={16} />
              New Lead
              <ChevronDown
                size={15}
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

          <button
            onClick={() => {
              setIsContactListOpen(true);
              if (monthOrder[0]) {
                setExpandedMonth(monthOrder[0]);
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-sm transition hover:bg-violet-50 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20"
          >
            <List size={16} />
            Contact List
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Dialpad */}
        <div className="contact-workspace-card glass-card rounded-2xl border border-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-primary dark:bg-primary/10">
              <PhoneCall size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">Dialpad</h2>
              <p className="text-xs text-muted-foreground">
                Make calls directly
              </p>
            </div>
          </div>

          <div className="contact-workspace-soft mb-4 rounded-xl border border-violet-100 bg-white p-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Selected Number
            </p>

            <div className="flex items-center gap-2">
              <input
                value={dialNumber}
                onChange={handleDialInputChange}
                placeholder="Enter number"
                className="contact-dial-number-input w-full rounded-lg border px-3 py-2 text-center text-base font-bold outline-none transition"
              />

              <button
                onClick={handleBackspace}
                disabled={!dialNumber}
                className="contact-dial-delete-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
                title="Delete last digit"
              >
                ⌫
              </button>
            </div>

            {dialNumberError && (
              <p className="mt-2 text-xs font-semibold text-red-500">
                {dialNumberError}
              </p>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              {selectedContact
                ? `Selected: ${selectedContact.name}`
                : "Selected from contact list"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {dialPadKeys.map((key) => (
              <button
                key={key.number}
                onClick={() => handleDialKey(key.number)}
                className="contact-dial-key flex h-14 w-14 flex-col items-center justify-center rounded-full border border-violet-100 bg-white text-foreground shadow-sm transition hover:scale-105 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
              >
                <span className="text-lg font-bold">{key.number}</span>

                {key.letters && (
                  <span className="text-[9px] font-semibold text-muted-foreground">
                    {key.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            <button
              onClick={() => setIsCalling(true)}
              disabled={isCalling || !dialNumber || Boolean(dialNumberError)}
              className={`contact-call-ready-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${
                isCalling || !dialNumber || Boolean(dialNumberError)
                  ? "cursor-not-allowed bg-gray-400"
                  : "animate-pulse bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] hover:bg-emerald-600"
              }`}
            >
              <PhoneCall size={17} />
              Call
            </button>

            <button
              onClick={() => setIsCalling(false)}
              disabled={!isCalling}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isCalling
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:scale-[1.02] hover:bg-red-600"
                  : "cursor-not-allowed border border-red-100 bg-red-50 text-red-300 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400/60"
              }`}
            >
              <PhoneOff size={17} />
              End Call
            </button>
          </div>
        </div>

        {/* Contacts */}
        <div className="contact-workspace-card glass-card rounded-2xl border border-border p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Assigned Contacts
            </h2>

            <p className="text-xs text-muted-foreground">
              Manage and track your assigned leads
            </p>
          </div>

          <div className="mb-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search contacts by name, number or email..."
                className="contact-search-input w-full rounded-xl border border-violet-100 bg-white py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>

          <div className="contact-table-wrap overflow-hidden rounded-xl border border-violet-100 dark:border-slate-700">
            <table className="w-full table-fixed text-left">
              <thead className="contact-table-head border-b border-violet-100 bg-violet-50/70 text-[11px] uppercase tracking-wider text-black dark:border-slate-700 dark:bg-slate-900/70 dark:text-muted-foreground">
                <tr>
                  <th className="w-[64px] px-3 py-3">S.No.</th>
                  <th className="w-[20%] px-3 py-3">Name</th>
                  <th className="w-[20%] px-3 py-3">Contact</th>
                  <th className="w-[34%] px-3 py-3">Email</th>
                  <th className="w-[22%] px-3 py-3">Call Status</th>
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
                    <td className="px-3 py-3 text-xs font-semibold text-foreground">
                      {(safeCurrentPage - 1) * contactsPerPage + index + 1}
                    </td>

                    <td className="px-3 py-3 text-sm font-bold text-foreground">
                      <span className="block truncate">{contact.name}</span>
                    </td>

                    <td className="px-3 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleSelectContactForCall(contact)}
                        className="block w-full truncate text-left font-semibold text-primary transition hover:underline"
                        title="Click to fill dialpad"
                      >
                        {contact.contact}
                      </button>
                    </td>

                    <td className="px-3 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleEmailClick(contact)}
                        className="block w-full truncate text-left font-semibold text-primary transition hover:underline"
                        title="Click to compose email"
                      >
                        {contact.email}
                      </button>
                    </td>

                    <td className="px-3 py-3">
                      {contact.status ? (
                        <button
                          onClick={() => openStatusModal(contact)}
                          className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClass(
                            contact.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                          <span className="truncate">{contact.status}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openStatusModal(contact)}
                          className="contact-mark-status rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm transition hover:bg-violet-100 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-primary/10"
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

          <div className="mt-3 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
                  className="contact-pagination-btn h-8 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
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
                  className="contact-pagination-btn h-8 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="contact-status-header flex items-start justify-between border-b border-violet-100 px-6 py-5 dark:border-slate-700">
              <div>
                <h2 className="contact-status-title text-xl font-bold text-foreground">
                  Update Call Status
                </h2>

                <p className="contact-status-subtitle mt-1 text-sm text-muted-foreground">
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

            <div className="contact-status-body space-y-4 px-6 py-5">
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
                <label className="contact-status-label mb-2 block text-sm font-semibold text-foreground">
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

      <GmailComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialTo={composerTo}
        initialSubject={composerSubject}
        onSuccess={() => {}}
      />
    </div>
  );
}