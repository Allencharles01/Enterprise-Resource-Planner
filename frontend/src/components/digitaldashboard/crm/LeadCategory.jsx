"use client";

import { useEffect, useState } from "react";

const categories = [
  "Advertising",
  "Content Creator",
  "Heavy Ads",
];

export default function LeadCategory({
  value = "",
  onChange,
}) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#0B1224]">
      <h3 className="mb-4 text-lg font-semibold">
        Lead Category
      </h3>

      <select
        value={selected}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-[#111827]"
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}