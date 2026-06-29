"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  X,
  PlusCircle,
  Edit3,
  Trash2,
  UserPlus,
  UserCheck,
  UserMinus,
  Loader2,
  BookOpen,
  DollarSign,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for Indian number formatting
const formatNumberInput = (val) => {
  if (!val) return "";
  const clean = String(val).replace(/[^0-9]/g, "");
  if (!clean) return "";
  return Number(clean).toLocaleString("en-IN");
};

// --- MODAL COMPONENTS ---

// 1. ADD COURSE
function AddCourseModal({ onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR (₹)");
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (e) => {
    setPrice(formatNumberInput(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/training/courses", {
        name,
        price,
        currency,
      });
      alert("Training course created successfully!");
      onClose();
    } catch (err) {
      alert("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Add a New Training Course</h2>
          <p className="text-sm text-muted-foreground">Define curriculum pathways and financial structure</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Course Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Enterprise Cloud Architecture"
            className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Price</label>
            <input
              required
              value={price}
              onChange={handlePriceChange}
              placeholder="25,000"
              className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition text-foreground font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition text-foreground font-semibold"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />} Save Course
        </button>
      </div>
    </form>
  );
}

// 2. EDIT COURSE
function EditCourseModal({ onClose }) {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/training/courses").then((res) => {
      const list = res.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedId(list[0]._id);
        setFormData({ ...list[0] });
      }
    });
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const item = courses.find((c) => c._id === id);
    if (item) setFormData({ ...item });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setFormData({ ...formData, price: formatNumberInput(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      await api.put(`/api/training/courses/${formData._id}`, formData);
      alert("Course updated successfully!");
      onClose();
    } catch (err) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <Edit3 size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Edit an Existing Course</h2>
          <p className="text-sm text-muted-foreground">Select course curriculum to modify</p>
        </div>
        {courses.length > 0 && (
          <select value={selectedId} onChange={handleSelect} className="bg-zinc-800 border border-amber-500/40 text-amber-400 font-semibold rounded-xl px-4 py-2 text-sm outline-none">
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {!formData ? (
        <p className="text-center py-12 text-muted-foreground">No training courses found in database.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Course Name</label>
              <input required name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none text-foreground font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Price</label>
                <input required name="price" value={formData.price || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none text-foreground font-semibold" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Currency</label>
                <select name="currency" value={formData.currency || "INR (₹)"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none text-foreground font-semibold">
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />} Update Course
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// 3. REMOVE COURSE
function RemoveCourseModal({ onClose }) {
  const [courses, setCourses] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    api.get("/api/training/courses").then((res) => setCourses(res.data || []));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this training course?")) return;
    setLoadingId(id);
    try {
      await api.delete(`/api/training/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete course.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
          <Trash2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Remove a Course</h2>
          <p className="text-sm text-muted-foreground">Permanently delete curriculum modules</p>
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto space-y-3 pr-2">
        {courses.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No courses available to remove.</p>
        ) : (
          courses.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4 bg-zinc-800/80 border border-border/80 rounded-2xl hover:border-red-500/40 transition group">
              <div>
                <h3 className="font-bold text-foreground text-base">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.currency || "INR (₹)"} {c.price}</p>
              </div>
              <button
                type="button"
                disabled={loadingId === c._id}
                onClick={() => handleDelete(c._id)}
                className="p-3 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition shadow-sm"
                title="Delete Course"
              >
                {loadingId === c._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition font-semibold">Done</button>
      </div>
    </div>
  );
}

// 4. ADD CANDIDATE
function AddCandidateModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    university: "",
    courseName: "",
    cost: "",
    paymentMethod: "Bank Transfer",
    salesAgent: "Allen Charles",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
    status: "Active",
    progress: 0,
  });
  const [courses, setCourses] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/training/courses").then((res) => {
      const list = res.data || [];
      setCourses(list);
      if (list.length > 0 && !formData.courseName) {
        setFormData((prev) => ({
          ...prev,
          courseName: list[0].name,
          cost: list[0].price ? `₹ ${formatNumberInput(list[0].price)}` : "",
        }));
      }
    });
    api.get("/api/employees").then((res) => {
      const list = res.data || [];
      const names = list.map((e) => `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim()).filter(Boolean);
      setEmployeeNames(names);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...formData, [name]: value };
    if (name === "cost") {
      const num = formatNumberInput(value);
      next.cost = num ? `₹ ${num}` : "";
    } else if (name === "courseName") {
      const found = courses.find((c) => c.name === value);
      if (found) next.cost = `₹ ${formatNumberInput(found.price)}`;
    }
    setFormData(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/training/candidates", formData);
      alert("Training candidate enrolled successfully!");
      onClose();
    } catch (err) {
      alert("Failed to enroll trainee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Enroll Training Candidate</h2>
          <p className="text-sm text-muted-foreground">Register participant and assign curriculum pathway</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Personal Info */}
        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
          <h3 className="text-base font-bold text-amber-400 border-b border-border/40 pb-2 flex items-center gap-2">
            <UserCheck size={18} /> Personal Info
          </h3>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="Participant Name" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Email ID</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="name@company.com" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Education</label>
            <input name="education" value={formData.education} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="B.Tech / MCA / MBA" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">University / Company</label>
            <input name="university" value={formData.university} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="Organization or Institution" />
          </div>
        </div>

        {/* Section 2: Program Detail */}
        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
          <h3 className="text-base font-bold text-amber-400 border-b border-border/40 pb-2 flex items-center gap-2">
            <BookOpen size={18} /> Program Detail
          </h3>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
            {courses.length > 0 ? (
              <select name="courseName" value={formData.courseName} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500 font-medium">
                {courses.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            ) : (
              <input required name="courseName" value={formData.courseName} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="Course Title" />
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Cost</label>
            <input name="cost" value={formData.cost} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500 font-semibold text-emerald-400" placeholder="₹ 25,000" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <datalist id="trainEmpSuggest">
            {employeeNames.map((n, idx) => <option key={idx} value={n} />)}
          </datalist>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Sales Agent</label>
            <input list="trainEmpSuggest" name="salesAgent" value={formData.salesAgent} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none focus:border-amber-500" placeholder="Representative Name" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />} Enroll Candidate
        </button>
      </div>
    </form>
  );
}

// 5. EDIT CANDIDATE PROFILE
function EditCandidateModal({ onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(null);
  const [statusTab, setStatusTab] = useState("Active");
  const [courses, setCourses] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredCandidates = candidates.filter((c) => {
    const st = (c.status || "Active").toLowerCase();
    if (statusTab === "Active") return st === "active";
    return st !== "active";
  });

  useEffect(() => {
    api.get("/api/training/courses").then((res) => setCourses(res.data || []));
    api.get("/api/employees").then((res) => {
      const list = res.data || [];
      const names = list.map((e) => `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim()).filter(Boolean);
      setEmployeeNames(names);
    }).catch(() => {});
    api.get("/api/training/candidates").then((res) => {
      setCandidates(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (filteredCandidates.length > 0) {
      if (!filteredCandidates.some((c) => c._id === selectedId)) {
        const first = filteredCandidates[0];
        setSelectedId(first._id);
        setFormData({
          ...first,
          cost: first.cost ? (String(first.cost).includes("₹") ? first.cost : `₹ ${formatNumberInput(first.cost)}`) : "",
          startDate: first.startDate ? first.startDate.split("T")[0] : "",
          endDate: first.endDate ? first.endDate.split("T")[0] : "",
        });
      }
    } else {
      setSelectedId("");
      setFormData(null);
    }
  }, [statusTab, candidates]);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const item = candidates.find((c) => c._id === id);
    if (item) {
      setFormData({
        ...item,
        cost: item.cost ? (String(item.cost).includes("₹") ? item.cost : `₹ ${formatNumberInput(item.cost)}`) : "",
        startDate: item.startDate ? item.startDate.split("T")[0] : "",
        endDate: item.endDate ? item.endDate.split("T")[0] : "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...formData, [name]: value };
    if (name === "cost") {
      const num = formatNumberInput(value);
      next.cost = num ? `₹ ${num}` : "";
    } else if (name === "courseName") {
      const found = courses.find((c) => c.name === value);
      if (found) next.cost = `₹ ${formatNumberInput(found.price)}`;
    }
    setFormData(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      await api.put(`/api/training/candidates/${formData._id}`, formData);
      alert("Trainee profile updated successfully!");
      onClose();
    } catch (err) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
          <Edit3 size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Edit Candidate's Profile</h2>
          <p className="text-sm text-muted-foreground">Modify trainee enrollment parameters</p>
        </div>
        {filteredCandidates.length > 0 && (
          <select value={selectedId} onChange={handleSelect} className="bg-zinc-800 border border-amber-500/40 text-amber-400 font-semibold rounded-xl px-4 py-2 text-sm outline-none">
            {filteredCandidates.map((c) => (
              <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-2 p-1.5 bg-zinc-800 rounded-2xl border border-border/60">
        {["Active", "Inactive"].map((tName) => (
          <button
            key={tName}
            type="button"
            onClick={() => setStatusTab(tName)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
              statusTab === tName ? "bg-amber-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tName} Trainees ({candidates.filter(c => tName === "Active" ? (c.status || "Active").toLowerCase() === "active" : (c.status || "Active").toLowerCase() !== "active").length})
          </button>
        ))}
      </div>

      {!formData ? (
        <p className="text-center py-12 text-muted-foreground">No {statusTab.toLowerCase()} candidates found.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Personal Info */}
            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-base font-bold text-amber-400 border-b border-border/40 pb-2">Personal Info</h3>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
                <input required name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email ID</label>
                <input required type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Phone Number</label>
                <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Education</label>
                <input name="education" value={formData.education || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">University / Company</label>
                <input name="university" value={formData.university || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
            </div>

            {/* Section 2: Program details */}
            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-base font-bold text-amber-400 border-b border-border/40 pb-2">Program details</h3>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
                <input required name="courseName" value={formData.courseName || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Duration</label>
                  <input name="duration" value={formData.duration || "4 weeks"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" placeholder="e.g. 6 weeks" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Cost</label>
                  <input name="cost" value={formData.cost || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none font-semibold text-emerald-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod || "Bank Transfer"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <datalist id="trainEditEmpSuggest">
                {employeeNames.map((n, idx) => <option key={idx} value={n} />)}
              </datalist>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sales Agent</label>
                  <input list="trainEditEmpSuggest" name="salesAgent" value={formData.salesAgent || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" placeholder="Agent Name" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Status</label>
                  <select name="status" value={formData.status || "Active"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none font-semibold text-amber-400">
                    <option value="Active" className="text-foreground">Active</option>
                    <option value="Inactive" className="text-foreground">Inactive</option>
                    <option value="Dropped Out" className="text-foreground">Dropped Out</option>
                    <option value="Completed" className="text-foreground">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />} Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// 6. REMOVE CANDIDATE
function RemoveCandidateModal({ onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState("Active"); // 'Active' | 'Inactive'
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    api.get("/api/training/candidates").then((res) => setCandidates(res.data || []));
  }, []);

  const filtered = candidates.filter((c) => {
    const st = (c.status || "Active").toLowerCase();
    if (tab === "Active") return st === "active";
    return st !== "active";
  });

  const handleDelete = async (id) => {
    if (!confirm("Remove this participant record permanently?")) return;
    setLoadingId(id);
    try {
      await api.delete(`/api/training/candidates/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
    } catch (err) {
      alert("Deletion failed.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
          <UserMinus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Remove a Candidate</h2>
          <p className="text-sm text-muted-foreground">Active participants vs trainees who have left</p>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-zinc-800 rounded-2xl border border-border/60">
        {["Active", "Inactive"].map((tName) => (
          <button
            key={tName}
            type="button"
            onClick={() => setTab(tName)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
              tab === tName ? "bg-red-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tName} Side ({candidates.filter(c => tName === "Active" ? (c.status || "Active").toLowerCase() === "active" : (c.status || "Active").toLowerCase() !== "active").length})
          </button>
        ))}
      </div>

      <div className="max-h-[360px] overflow-y-auto space-y-3 pr-2">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No {tab.toLowerCase()} training candidates found.</p>
        ) : (
          filtered.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4 bg-zinc-800/80 border border-border/80 rounded-2xl hover:border-red-500/40 transition group">
              <div>
                <h3 className="font-bold text-foreground text-base">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.courseName} · {c.email}</p>
              </div>
              <button
                type="button"
                disabled={loadingId === c._id}
                onClick={() => handleDelete(c._id)}
                className="p-3 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition shadow-sm"
                title="Delete Trainee"
              >
                {loadingId === c._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition font-semibold">Done</button>
      </div>
    </div>
  );
}

// --- MAIN EXPORT WRAPPER ---
export function TrainingModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-zinc-900 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-foreground"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition z-10"
          >
            <X size={20} />
          </button>

          {activeModal === "add_course" && <AddCourseModal onClose={onClose} />}
          {activeModal === "edit_course" && <EditCourseModal onClose={onClose} />}
          {activeModal === "remove_course" && <RemoveCourseModal onClose={onClose} />}
          {activeModal === "add_candidate" && <AddCandidateModal onClose={onClose} />}
          {activeModal === "edit_candidate" && <EditCandidateModal onClose={onClose} />}
          {activeModal === "remove_candidate" && <RemoveCandidateModal onClose={onClose} />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
