import { useEffect, useState } from "react";
import { Tv } from "lucide-react";
import Modal from "../ui/Modal";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white";

const initialForm = {
  name: "",
  type: "Billboards",
  location: "",
  spent: "",
  profit: "",
  reach: "",
  roi: "",
  status: "Active",
};

export default function HeavyAdsFormModal({
  open,
  onClose,
  editingCampaign,
  onSave,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingCampaign) {
      setForm(editingCampaign);
    } else {
      setForm(initialForm);
    }
  }, [editingCampaign]);

  const update = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const submit = () => {
    onSave({
      ...form,
      spent: Number(form.spent),
      profit: Number(form.profit),
      reach: Number(form.reach),
      roi: Number(form.roi),
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingCampaign ? "Edit Campaign" : "Add Campaign"}
      subtitle="Manage heavy advertisement campaigns"
      icon={<Tv size={22} />}
      iconBg="bg-orange-500"
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
            className="rounded-lg bg-orange-500 px-4 py-2 text-white"
          >
            {editingCampaign ? "Update" : "Add Campaign"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">

        <input
          className={inputClass}
          placeholder="Campaign Name"
          value={form.name}
          onChange={update("name")}
        />

        <input
          className={inputClass}
          placeholder="Campaign Type"
          value={form.type}
          onChange={update("type")}
        />

        <input
          className={inputClass}
          placeholder="Location"
          value={form.location}
          onChange={update("location")}
        />

        <input
          className={inputClass}
          placeholder="Amount Spent"
          value={form.spent}
          onChange={update("spent")}
        />

        <input
          className={inputClass}
          placeholder="Profit"
          value={form.profit}
          onChange={update("profit")}
        />

        <input
          className={inputClass}
          placeholder="Reach"
          value={form.reach}
          onChange={update("reach")}
        />

        <input
          className={inputClass}
          placeholder="ROI"
          value={form.roi}
          onChange={update("roi")}
        />

        <select
          className={`${inputClass} appearance-none`}
          value={form.status}
          onChange={update("status")}
        >
          <option>Active</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

      </div>
    </Modal>
  );
}