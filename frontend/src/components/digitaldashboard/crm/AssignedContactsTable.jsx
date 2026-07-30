"use client";

import { Search } from "lucide-react";

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
}) {
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
      "
    >
      {/* Header */}

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-[#24123B] dark:text-white">
          Assigned Contacts
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage and track your assigned leads
        </p>

      </div>

      {/* Search */}

      <div className="relative mb-5">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
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
          "
        />

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-violet-100 dark:border-white/10">

        <table className="w-full">

          <thead>

            <tr className="bg-[#F7F2FF] dark:bg-[#1B1B2D]">

              <th className="px-4 py-3 text-left text-xs uppercase">
                S.No.
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Name
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Contact
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Email
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Call Status
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
  Actions
</th>

            </tr>

          </thead>

          <tbody>

            {contacts.map((contact, index) => (

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

                <td className="px-4 py-4">
                  {index + 1}
                </td>

                <td className="px-4 py-4 font-semibold">
                  {contact.name}
                </td>

                <td className="px-4 py-4 text-violet-500">
                  {contact.phoneNumber}
                </td>

                <td className="px-4 py-4">
                  {contact.email}
                </td>

                <td className="px-4 py-4">

                  <span
                    className={`
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
    className="text-violet-500 hover:text-violet-600 hover:underline"
  >
    View Details
  </button>
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between mt-5">

        <p className="text-sm text-gray-500">
          Showing 1 - {contacts.length} contacts
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 rounded-xl border">
            Prev
          </button>

          <button className="h-10 w-10 rounded-full bg-violet-500 text-white">
            1
          </button>

          <button className="h-10 w-10 rounded-full border">
            2
          </button>

          <button className="px-4 py-2 rounded-xl border">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}