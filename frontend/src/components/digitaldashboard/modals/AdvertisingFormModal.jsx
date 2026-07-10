import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import Modal from "../ui/Modal";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white";

const initialData = {
  name: "",
  sub: "",
  budget: "",
  reach: "",
  clicks: "",
  ctr: "",
  revenue: "",
  roi: "",
};

export default function AdvertisingFormModal({
  open,
  onClose,
  editingPlatform,
  onSave,
}) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    if (editingPlatform) {
      setForm(editingPlatform);
    } else {
      setForm(initialData);
    }
  }, [editingPlatform]);

  const update = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const submit = () => {
    onSave({
      ...form,
      budget: Number(form.budget),
      reach: Number(form.reach),
      clicks: Number(form.clicks),
      ctr: Number(form.ctr),
      revenue: Number(form.revenue),
      roi: Number(form.roi),
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingPlatform ? "Edit Advertising" : "Add Advertising"}
      subtitle="Manage advertising platform"
      icon={<Megaphone size={22} />}
      iconBg="bg-blue-500"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {editingPlatform ? "Update" : "Add"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">

        <input
          className={inputClass}
          placeholder="Platform"
          value={form.name}
          onChange={update("name")}
        />

        <input
          className={inputClass}
          placeholder="Campaign Type"
          value={form.sub}
          onChange={update("sub")}
        />

        <input
          className={inputClass}
          placeholder="Budget"
          value={form.budget}
          onChange={update("budget")}
        />

        <input
          className={inputClass}
          placeholder="Reach"
          value={form.reach}
          onChange={update("reach")}
        />

        <input
          className={inputClass}
          placeholder="Clicks"
          value={form.clicks}
          onChange={update("clicks")}
        />

        <input
          className={inputClass}
          placeholder="CTR"
          value={form.ctr}
          onChange={update("ctr")}
        />

        <input
          className={inputClass}
          placeholder="Revenue"
          value={form.revenue}
          onChange={update("revenue")}
        />

        <input
          className={inputClass}
          placeholder="ROI"
          value={form.roi}
          onChange={update("roi")}
        />

      </div>
    </Modal>
  );
}