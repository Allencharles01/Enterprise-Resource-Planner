"use client";

import { useEffect, useState } from "react";

const LEAD_CATEGORIES = [
  {
    value: "Advertising",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  {
    value: "Content Creator",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
  },
  {
    value: "Heavy Ads",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
];

export default function LeadCategory({
  value = "",
  onChange,
  disabled = false,
}) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e) => {
    const category = e.target.value;
    setSelected(category);

    if (onChange) {
      onChange(category);
    }
  };

  const current =
    LEAD_CATEGORIES.find((item) => item.value === selected) || null;

  return (
    <div
      className="
        rounded-2xl
        border
        p-5

        bg-white
        border-violet-100

        dark:bg-[#12121b]
        dark:border-white/5
      "
    >
      <h3 className="font-semibold text-[#24123B] dark:text-white mb-4">
        Lead Category
      </h3>

      <select
        value={selected}
        onChange={handleChange}
        disabled={disabled}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-sm

          bg-[#F7F2FF]
          border-[#DDD6FE]
          text-[#24123B]

          dark:bg-white/5
          dark:border-white/10
          dark:text-white

          focus:outline-none
          focus:ring-2
          focus:ring-violet-400

          disabled:opacity-50
        "
      >
        <option value="">Select Category</option>

        {LEAD_CATEGORIES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>

      {current && (
        <div className="mt-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${current.color}`}
          >
            {current.value}
          </span>
        </div>
      )}

      <div className="mt-5 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Select the category that best matches this customer's
          requirements. The selected category will be saved
          automatically.
        </p>
      </div>
    </div>
  );
}