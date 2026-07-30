import { useState } from "react";
import { UserPlus, Pencil, CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-500/20";
const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

const initialForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  campaignType: "",
  budget: "",
  deadline: "",
  notes: "",
};

const campaignTypes = [
  "Advertising",
  "Content Creators",
  "Heavy Ads",
];

export default function NewLeadModal({ open, onClose }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState(initialForm);

  const formatIndianNumber = (value) => {
    value = value.replace(/\D/g, "");

    if (!value) return "";

    const lastThree = value.slice(-3);
    const otherNumbers = value.slice(0, -3);

    if (!otherNumbers) return lastThree;

    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      "," +
      lastThree
    );
  };

  const update = (key) => (e) => {
    let value = e.target.value;

    if (key === "budget") {
      value = formatIndianNumber(value);
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    setForm(initialForm);
    setStep("form");
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = () => {
    handleClose();
  };

  const fields = [
    { key: "companyName", label: "Company Name", placeholder: "e.g. Nike India" },
    { key: "contactPerson", label: "Contact Person", placeholder: "e.g. Ananya Rao" },
    { key: "email", label: "Email", placeholder: "name@company.com", type: "email" },
    { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
    { key: "budget", label: "Budget", placeholder: "e.g. 2,50,000", type: "text" },
    { key: "deadline", label: "Deadline", type: "date" },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      icon={step === "form" ? <UserPlus size={22} /> : <CheckCircle2 size={22} />}
      iconBg="bg-blue-500"
      title={step === "form" ? "New Lead" : "Preview Lead"}
      subtitle={step === "form" ? "Add a new client lead to the pipeline." : "Review the details before submitting."}
      maxWidth="max-w-2xl"
      footer={
        step === "form" ? (
          <>
            <button
              onClick={handleClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep("preview")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Save and Preview
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("form")}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Submit
            </button>
          </>
        )
      }
    >
      {step === "form" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type={f.type || "text"}
                  className={inputCls}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={update(f.key)}
                />
              </div>
            ))}
            <div>
              <label className={labelCls}>Campaign Type</label>
              <select className={`${inputCls} bg-white text-gray-900 dark:bg-[#0B1224] dark:text-white`} value={form.campaignType} onChange={update("campaignType")}>
                <option
                  value=""
                  className="bg-white text-gray-900 dark:bg-[#0B1224] dark:text-white"
                >
                  Select campaign type
                </option>

                {campaignTypes.map((c) => (
                  <option
                    key={c}
                    value={c}
                    className="bg-white text-gray-900 dark:bg-[#0B1224] dark:text-white"
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={3}
              className={inputCls}
              placeholder="Additional context about this lead..."
              value={form.notes}
              onChange={update("notes")}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {[
            ["Company Name", form.companyName || "—"],
            ["Contact Person", form.contactPerson || "—"],
            ["Email", form.email || "—"],
            ["Phone Number", form.phone || "—"],
            ["Campaign Type", form.campaignType || "—"],
            ["Budget", form.budget ? `₹${Number(form.budget).toLocaleString("en-IN")}` : "—"],
            ["Deadline", form.deadline || "—"],
            ["Notes", form.notes || "—"],
          ].map(([label, value]) => (
<div
  key={label}
  className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm last:border-0 dark:border-white/5"
>              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
