"use client";

import { useState, useEffect } from "react";
import { Search, QrCode, Mail } from "lucide-react";

const STATUS_COLORS = {
  Answered:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

  Unanswered:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",

  Rejected:
    "bg-red-500/10 text-red-400 border border-red-500/20",

  Busy:
    "bg-blue-500/10 text-blue-400 border border-blue-500/20",

  "Not Connected":
    "bg-violet-500/10 text-violet-400 border border-violet-500/20",
};

export default function AssignedContactsTable({
  contacts = [],
  selectedContact,
  onSelect,
  onViewDetails,
  leadCategory = "",
  onLeadCategoryChange,
  onGenerateQr,
  onEmailClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when filtering criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, leadCategory]);

  const filteredContacts = contacts.filter((c) => {
    // Filter by category if selected
    if (leadCategory && c.leadCategory !== leadCategory) {
      return false;
    }
    // Filter by search term
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.phoneNumber?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div
      className="
        rounded-2xl
        border
        border-violet-100
        dark:border-white/10
        bg-white
        dark:bg-[#12121b]
        p-5
        flex
        flex-col
        h-full
      "
    >
      {/* Header with Lead Category dropdown */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#24123B] dark:text-white">
            Assigned Contacts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track your assigned leads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Lead Category:
          </label>
          <select
            value={leadCategory}
            onChange={(e) => onLeadCategoryChange?.(e.target.value)}
            className="rounded-xl border border-violet-200 bg-[#F7F2FF] px-3.5 py-2 text-xs font-bold text-[#24123B] shadow-sm outline-none transition-all focus:border-violet-500 dark:border-white/10 dark:bg-[#1B1B2D] dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Advertising">Advertising</option>
            <option value="Content Creator">Content Creator</option>
            <option value="Heavy Ads">Heavy Ads</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, number or email..."
          className="
            w-full
            rounded-xl
            border
            border-violet-200
            dark:border-white/10
            bg-[#F7F2FF]
            dark:bg-[#1B1B2D]
            pl-11
            pr-4
            py-3
            outline-none
            text-sm
            text-[#24123B]
            dark:text-white
          "
        />
      </div>

      {/* Mobile Tiles View */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedContacts.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No contacts found.
          </div>
        ) : (
          paginatedContacts.map((contact, index) => {
            const globalIndex = startIndex + index;
            const isSelected = selectedContact?.id === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => onSelect(contact)}
                className={`
                  p-4
                  rounded-2xl
                  border
                  transition-all
                  duration-205
                  relative
                  cursor-pointer
                  flex
                  flex-col
                  gap-3
                  ${
                    isSelected
                      ? "bg-violet-500/10 border-violet-400 dark:border-violet-500/50"
                      : "bg-[#F7F2FF]/40 border-violet-100/70 hover:bg-violet-500/5 dark:bg-[#1B1B2D]/40 dark:border-white/5 dark:hover:bg-white/5"
                  }
                `}
              >
                {/* Top Row: Name and S.No */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-violet-100 dark:bg-white/5 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center">
                      {globalIndex + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(contact);
                      }}
                      className="font-bold text-violet-600 dark:text-violet-400 hover:underline text-left text-sm"
                      title="Click to view Customer Information"
                    >
                      {contact.name}
                    </button>
                  </div>

                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-full
                      px-2.5
                      py-0.5
                      text-[10px]
                      font-semibold
                      ${STATUS_COLORS[contact.callStatus || "Not Connected"]}
                    `}
                  >
                    ● {contact.callStatus || "Not Connected"}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-violet-100/60 dark:bg-white/5"></div>

                {/* Details Section */}
                <div className="flex flex-col gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                  {/* Phone Row */}
                  <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <span className="text-gray-400 font-medium">Phone:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelect(contact)}
                        className="font-semibold text-violet-600 dark:text-violet-400 hover:underline text-sm"
                      >
                        {contact.phoneNumber}
                      </button>
                      <button
                        onClick={() => onGenerateQr?.(contact.phoneNumber)}
                        className="rounded-lg p-1 bg-violet-100 hover:bg-violet-200 dark:bg-white/5 dark:hover:bg-white/10 text-violet-700 dark:text-violet-300 transition-all cursor-pointer flex items-center justify-center"
                        title="Scan QR Code"
                      >
                        <QrCode size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <span className="text-gray-400 font-medium">Email:</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate max-w-[150px] font-medium text-gray-750 dark:text-gray-200">
                        {contact.email}
                      </span>
                      <button
                        onClick={() => onEmailClick?.(contact.email)}
                        className="rounded-lg p-1 bg-violet-100 hover:bg-violet-200 dark:bg-white/5 dark:hover:bg-white/10 text-violet-700 dark:text-violet-300 transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="Send Email"
                      >
                        <Mail size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: View Details Link */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(contact);
                    }}
                    className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-violet-100 dark:border-white/10">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F2FF] dark:bg-[#1B1B2D] whitespace-nowrap">
              <th className="px-4 py-3 text-left text-xs uppercase">S.No.</th>
              <th className="px-4 py-3 text-left text-xs uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs uppercase">Call Status</th>
              <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                  No contacts found.
                </td>
              </tr>
            ) : (
              paginatedContacts.map((contact, index) => {
                const globalIndex = startIndex + index;
                return (
                  <tr
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    className={`
                      cursor-pointer
                      border-t
                      border-violet-100
                      dark:border-white/10
                      transition-all
                      hover:bg-violet-500/5
                      ${
                        selectedContact?.id === contact.id
                          ? "bg-violet-500/10"
                          : ""
                      }
                    `}
                  >
                    <td className="px-4 py-4">{globalIndex + 1}</td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(contact);
                      }}
                      className="px-4 py-4 font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                      title="Click to view Customer Information"
                    >
                      {contact.name}
                    </td>
                    <td className="px-4 py-4 text-violet-500">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelect(contact)}
                          className="font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer text-sm"
                          title="Load into Dialer"
                        >
                          {contact.phoneNumber}
                        </button>

                        <button
                          onClick={() => onGenerateQr?.(contact.phoneNumber)}
                          className="rounded-lg p-1 bg-violet-100 hover:bg-violet-200 dark:bg-white/5 dark:hover:bg-white/10 text-violet-700 dark:text-violet-300 transition-all cursor-pointer flex items-center justify-center shrink-0"
                          title="Scan QR Code"
                        >
                          <QrCode size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="truncate max-w-[150px]" title={contact.email}>
                          {contact.email}
                        </span>

                        <button
                          onClick={() => onEmailClick?.(contact.email)}
                          className="rounded-lg p-1 bg-violet-100 hover:bg-violet-200 dark:bg-white/5 dark:hover:bg-white/10 text-violet-700 dark:text-violet-300 transition-all cursor-pointer flex items-center justify-center shrink-0"
                          title="Send Email"
                        >
                          <Mail size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`
                          inline-flex
                          items-center
                          whitespace-nowrap
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            STATUS_COLORS[
                              contact.callStatus || "Not Connected"
                            ]
                          }
                        `}
                      >
                        ● {contact.callStatus || "Not Connected"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(contact);
                        }}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
        <p className="text-sm text-gray-500">
          Showing {filteredContacts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={activePage === 1}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              activePage === 1
                ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/5"
                : "border-violet-200 hover:bg-violet-50 text-violet-700 dark:border-white/10 dark:text-violet-300 dark:hover:bg-white/5 cursor-pointer"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                activePage === pageNum
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "border border-violet-200 hover:bg-violet-50 text-violet-700 dark:border-white/10 dark:text-violet-300 dark:hover:bg-white/5"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={activePage === totalPages}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              activePage === totalPages
                ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/5"
                : "border-violet-200 hover:bg-violet-50 text-violet-700 dark:border-white/10 dark:text-violet-300 dark:hover:bg-white/5 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}