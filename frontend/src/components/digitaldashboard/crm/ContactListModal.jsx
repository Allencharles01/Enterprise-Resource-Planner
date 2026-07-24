"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  Phone,
  CalendarDays,
  Filter,
} from "lucide-react";

export default function ContactListModal({
  open,
  contacts = [],
  onClose,
  onSelect,
}) {

  /* ===============================
        HOOKS
  =============================== */

  const [search, setSearch] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("All");

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  /* ===============================
        FILTER OPTIONS
  =============================== */

  const months = [
    "All",
    "July 2026",
    "June 2026",
    "May 2026",
    "April 2026",
  ];

  const callStatuses = [
    "All",
    "Interested",
    "Busy",
    "No Answer",
    "Call Later",
    "Follow Up",
    "Wrong Number",
    "Not Interested",
  ];

  /* ===============================
        DUMMY CALL HISTORY
  =============================== */

  const history = useMemo(() => {

    return contacts.map((contact, index) => ({

      ...contact,

      srNo: index + 1,

      month:
        index % 2 === 0
          ? "July 2026"
          : "June 2026",

      callStatus:
        [
          "Interested",
          "Busy",
          "No Answer",
          "Follow Up",
          "Call Later",
          "Wrong Number",
        ][index % 6],

      employment:
        contact.employmentStatus ||
        "Student",

    }));

  }, [contacts]);

  /* ===============================
        FILTERED DATA
  =============================== */

  const filteredHistory = useMemo(() => {

    return history.filter((item) => {

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        item.phoneNumber?.includes(search) ||

        item.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesMonth =
        selectedMonth === "All" ||
        item.month === selectedMonth;

      const matchesStatus =
        selectedStatus === "All" ||
        item.callStatus === selectedStatus;

      return (
        matchesSearch &&
        matchesMonth &&
        matchesStatus
      );

    });

  }, [
    history,
    search,
    selectedMonth,
    selectedStatus,
  ]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div
        className="
        w-[95%]
        max-w-7xl
        rounded-2xl
        bg-white
        dark:bg-[#161622]
        border
        border-violet-100
        dark:border-white/10
        shadow-2xl
        "
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b border-violet-100 dark:border-white/10">

          <div>

            <h2 className="text-2xl font-bold flex items-center gap-3">

              <Phone
                className="text-violet-600"
                size={24}
              />

              Call History

            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View previous customer interactions
            </p>

          </div>

          <button
            onClick={onClose}
            className="
            h-10
            w-10
            rounded-lg
            hover:bg-violet-100
            dark:hover:bg-white/5
            flex
            items-center
            justify-center
            "
          >
            <X />
          </button>

        </div>

        {/* FILTER BAR */}

        <div className="grid grid-cols-3 gap-4 p-6 border-b border-violet-100 dark:border-white/10">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search..."
              className="
              w-full
              rounded-xl
              border
              border-violet-200
              pl-11
              pr-4
              py-3
              bg-white
              dark:bg-[#1F1F2F]
              dark:border-white/10
              "
            />

          </div>

          {/* Month */}

          <div className="relative">

            <CalendarDays
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-violet-200
              pl-11
              pr-4
              py-3
              bg-white
              dark:bg-[#1F1F2F]
              dark:border-white/10
              "
            >

              {months.map((month) => (

                <option key={month}>
                  {month}
                </option>

              ))}

            </select>

          </div>

          {/* Call Status */}

          <div className="relative">

            <Filter
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-violet-200
              pl-11
              pr-4
              py-3
              bg-white
              dark:bg-[#1F1F2F]
              dark:border-white/10
              "
            >

              {callStatuses.map((status) => (

                <option key={status}>
                  {status}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* TABLE START */}

        <div className="overflow-auto max-h-[500px]">

          <table className="w-full">

            <thead className="sticky top-0 bg-violet-50 dark:bg-[#1B1B2D]">

              <tr className="text-left">

                <th className="px-6 py-4">
                  Sr.
                </th>

                <th className="px-6 py-4">
                  Name
                </th>

                <th className="px-6 py-4">
                  Phone
                </th>

                <th className="px-6 py-4">
                  Email
                </th>

                <th className="px-6 py-4">
                  Employment
                </th>

                <th className="px-6 py-4">
                  Call Status
                </th>

              </tr>

            </thead>

            <tbody>
                            {filteredHistory.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-16 text-center text-gray-500"
                  >
                    No Call History Found
                  </td>

                </tr>

              ) : (

                filteredHistory.map((item) => (

                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelect?.(item);
                      onClose?.();
                    }}
                    className="
                    cursor-pointer
                    border-b
                    border-violet-100
                    dark:border-white/5
                    hover:bg-violet-50
                    dark:hover:bg-white/5
                    transition
                    "
                  >

                    {/* Sr No */}

                    <td className="px-6 py-5 font-medium">
                      {item.srNo}
                    </td>

                    {/* Name */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {item.company}
                        </p>

                      </div>

                    </td>

                    {/* Phone */}

                    <td className="px-6 py-5">
                      {item.phoneNumber}
                    </td>

                    {/* Email */}

                    <td className="px-6 py-5">
                      {item.email}
                    </td>

                    {/* Employment */}

                    <td className="px-6 py-5">

                      <span
                        className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium

                        ${
                          item.employment === "Student"
                            ? "bg-blue-100 text-blue-700"

                          : item.employment === "Working"
                            ? "bg-green-100 text-green-700"

                          : "bg-orange-100 text-orange-700"
                        }
                        `}
                      >
                        {item.employment}
                      </span>

                    </td>

                    {/* Call Status */}

                    <td className="px-6 py-5">

                      <span
                        className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold

                        ${
                          item.callStatus === "Interested"

                            ? "bg-green-100 text-green-700"

                          : item.callStatus === "Busy"

                            ? "bg-yellow-100 text-yellow-700"

                          : item.callStatus === "No Answer"

                            ? "bg-red-100 text-red-700"

                          : item.callStatus === "Follow Up"

                            ? "bg-blue-100 text-blue-700"

                          : item.callStatus === "Call Later"

                            ? "bg-orange-100 text-orange-700"

                          : "bg-gray-100 text-gray-700"
                        }
                        `}
                      >
                        {item.callStatus}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}

        <div
          className="
          flex
          items-center
          justify-between
          border-t
          border-violet-100
          dark:border-white/10
          px-6
          py-4
          "
        >

          <p className="text-sm text-gray-500">

            Showing

            <span className="font-semibold mx-1">
              {filteredHistory.length}
            </span>

            records

          </p>

          <button
            onClick={onClose}
            className="
            rounded-xl
            bg-violet-600
            hover:bg-violet-700
            text-white
            px-6
            py-2.5
            transition
            "
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}