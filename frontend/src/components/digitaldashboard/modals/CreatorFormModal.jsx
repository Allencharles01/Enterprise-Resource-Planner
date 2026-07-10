import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Modal from "../ui/Modal";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";

const initialData = {
  name: "",
  handle: "",
  platform: "Instagram",
  followers: "",
  contentType: "",
  amount: "",
  status: "Pending",
};

export default function CreatorFormModal({
  open,
  onClose,
  onSave,
  editingCreator,
}) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    if (editingCreator) {
      setForm(editingCreator);
    } else {
      setForm(initialData);
    }
  }, [editingCreator]);

  const update = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const submit = () => {
    onSave({
      ...form,
      amount: Number(form.amount),
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingCreator ? "Edit Creator" : "Add Creator"}
      subtitle="Manage creator information"
      icon={<Users size={22} />}
      iconBg="bg-purple-500"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 dark:border-white/10"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
          >
            {editingCreator ? "Update" : "Add Creator"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">

        <input
          className={inputClass}
          placeholder="Creator Name"
          value={form.name}
          onChange={update("name")}
        />

        <input
          className={inputClass}
          placeholder="@username"
          value={form.handle}
          onChange={update("handle")}
        />

        <select
  className={`${inputClass} appearance-none`}
  value={form.status}
  onChange={update("status")}
>
  <option className="bg-[#111827] text-white">
    Paid
  </option>

  <option className="bg-[#111827] text-white">
    Pending
  </option>

  <option className="bg-[#111827] text-white">
    Active
  </option>
</select>

        <input
          className={inputClass}
          placeholder="Followers"
          value={form.followers}
          onChange={update("followers")}
        />

        <input
          className={inputClass}
          placeholder="Content Type"
          value={form.contentType}
          onChange={update("contentType")}
        />

        <input
          className={inputClass}
          placeholder="Amount Paid"
          value={form.amount}
          onChange={update("amount")}
        />

        <select
  className={`${inputClass} appearance-none`}
  value={form.platform}
  onChange={update("platform")}
>
  <option className="bg-[#111827] text-white">
    Instagram
  </option>

  <option className="bg-[#111827] text-white">
    YouTube
  </option>
</select>

      </div>
    </Modal>
  );
}