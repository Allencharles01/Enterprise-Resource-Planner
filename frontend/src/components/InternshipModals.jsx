"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  UserPlus,
  Edit3,
  UserMinus,
  PlusCircle,
  BookOpen,
  Trash2,
  CheckCircle2,
  Calendar,
  CreditCard,
  DollarSign,
  GraduationCap,
  Building,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

const formatNumberInput = (val) => {
  if (!val) return "";
  const raw = String(val).replace(/\D/g, "");
  return raw ? parseInt(raw, 10).toLocaleString("en-IN") : "";
};

const getCalcTierCost = (courseName, duration, courseList) => {
  if (!courseList || !courseList.length) return "";
  const course = courseList.find((c) => c.name === courseName) || courseList[0];
  if (!course) return "";
  const durMap = {
    "1 month": "month1",
    "2 months": "month2",
    "3 months": "month3",
    "6 months": "month6",
    "12 months": "month12",
  };
  const key = durMap[duration] || "month3";
  const raw = course?.prices?.[key] || course?.price || "";
  const num = formatNumberInput(raw);
  return num ? `₹ ${num}` : "";
};

export function InternshipModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-foreground"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X size={20} />
          </button>

          {activeModal === "addCandidate" && <AddCandidateModal onClose={onClose} />}
          {activeModal === "editCandidate" && <EditCandidateModal onClose={onClose} />}
          {activeModal === "removeCandidate" && <RemoveCandidateModal onClose={onClose} />}
          {activeModal === "addCourse" && <AddCourseModal onClose={onClose} />}
          {activeModal === "editCourse" && <EditCourseModal onClose={onClose} />}
          {activeModal === "removeCourse" && <RemoveCourseModal onClose={onClose} />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// 1. ADD CANDIDATE
function AddCandidateModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    university: "",
    courseName: "",
    duration: "3 months",
    cost: "₹ 15,000",
    paymentMethod: "UPI",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
    salesAgent: "Allen Charles",
    mentor: "Noah",
    progress: 0,
    status: "Active",
  });
  const [courses, setCourses] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/internships/courses").then((res) => {
      const data = res.data || [];
      setCourses(data);
      if (data.length > 0 && !formData.courseName) {
        const cName = data[0].name;
        const calc = getCalcTierCost(cName, formData.duration, data);
        setFormData((prev) => ({ ...prev, courseName: cName, cost: calc || prev.cost }));
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
    let nextForm = { ...formData, [name]: value };
    if (name === "cost") {
      const num = formatNumberInput(value);
      nextForm.cost = num ? `₹ ${num}` : "";
    } else if (name === "courseName" || name === "duration") {
      const cName = name === "courseName" ? value : formData.courseName;
      const cDur = name === "duration" ? value : formData.duration;
      const calc = getCalcTierCost(cName, cDur, courses);
      if (calc) nextForm.cost = calc;
    }
    setFormData(nextForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/internships/candidates", formData);
      alert("Internship candidate added successfully!");
      onClose();
    } catch (err) {
      alert("Failed to add candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Add a Candidate</h2>
          <p className="text-sm text-muted-foreground">Enlist a new candidate into the internship directory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1 */}
        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <User size={18} /> Personal Info
          </h3>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="e.g. Rahul Sharma" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Email ID</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="rahul@example.com" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Education</label>
            <input name="education" value={formData.education} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="B.Tech Computer Science" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">University</label>
            <input name="university" value={formData.university} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="IIT Delhi" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <GraduationCap size={18} /> Internship Details
          </h3>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
            {courses.length > 0 ? (
              <select name="courseName" value={formData.courseName} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none">
                {courses.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            ) : (
              <input required name="courseName" value={formData.courseName} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="Fullstack Web Dev" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Duration</label>
              <select name="duration" value={formData.duration || "3 months"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none">
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Cost (₹/$)</label>
              <input name="cost" value={formData.cost} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="15,000" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <datalist id="employeeSuggestionsList">
            {employeeNames.map((n, idx) => <option key={idx} value={n} />)}
          </datalist>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm text-foreground [color-scheme:dark] focus:border-emerald-500 outline-none cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm text-foreground [color-scheme:dark] focus:border-emerald-500 outline-none cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Sales Agent</label>
              <input list="employeeSuggestionsList" name="salesAgent" value={formData.salesAgent} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="Agent Name" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Mentor</label>
              <input list="employeeSuggestionsList" name="mentor" value={formData.mentor || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="Mentor Name" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />} Enroll Candidate
        </button>
      </div>
    </form>
  );
}

// 2. EDIT CANDIDATE
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
    api.get("/api/internships/courses").then((res) => setCourses(res.data || []));
    api.get("/api/employees").then((res) => {
      const list = res.data || [];
      const names = list.map((e) => `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim()).filter(Boolean);
      setEmployeeNames(names);
    }).catch(() => {});
    api.get("/api/internships/candidates").then((res) => {
      setCandidates(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (filteredCandidates.length > 0) {
      if (!filteredCandidates.some((c) => c._id === selectedId)) {
        const first = filteredCandidates[0];
        setSelectedId(first._id);
        setFormData({ ...first, cost: first.cost ? (String(first.cost).includes("₹") ? first.cost : `₹ ${formatNumberInput(first.cost)}`) : "", startDate: first.startDate ? first.startDate.split("T")[0] : "", endDate: first.endDate ? first.endDate.split("T")[0] : "" });
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
    if (item) setFormData({ ...item, cost: item.cost ? (String(item.cost).includes("₹") ? item.cost : `₹ ${formatNumberInput(item.cost)}`) : "", startDate: item.startDate ? item.startDate.split("T")[0] : "", endDate: item.endDate ? item.endDate.split("T")[0] : "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextForm = { ...formData, [name]: value };
    if (name === "cost") {
      const num = formatNumberInput(value);
      nextForm.cost = num ? `₹ ${num}` : "";
    } else if (name === "courseName" || name === "duration") {
      const cName = name === "courseName" ? value : formData.courseName;
      const cDur = name === "duration" ? value : formData.duration;
      const calc = getCalcTierCost(cName, cDur, courses);
      if (calc) nextForm.cost = calc;
    }
    setFormData(nextForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      await api.put(`/api/internships/candidates/${formData._id}`, formData);
      alert("Candidate profile updated successfully!");
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
          <h2 className="text-2xl font-bold">Edit Candidate Profile</h2>
          <p className="text-sm text-muted-foreground">Select and modify enrolled intern information</p>
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
            {tName} Interns ({candidates.filter(c => tName === "Active" ? (c.status || "Active").toLowerCase() === "active" : (c.status || "Active").toLowerCase() !== "active").length})
          </button>
        ))}
      </div>

      {!formData ? (
        <p className="text-center py-12 text-muted-foreground">No {statusTab.toLowerCase()} candidates found.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-base font-bold text-amber-400">Personal Info</h3>
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
                <label className="text-xs text-muted-foreground block mb-1">University</label>
                <input name="university" value={formData.university || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
            </div>

            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
              <h3 className="text-base font-bold text-amber-400">Internship Details</h3>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
                <input required name="courseName" value={formData.courseName || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Duration</label>
                  <select name="duration" value={formData.duration || "3 months"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none">
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Cost</label>
                  <input name="cost" value={formData.cost || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" />
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
              <datalist id="editEmpSuggestionsList">
                {employeeNames.map((n, idx) => <option key={idx} value={n} />)}
              </datalist>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm text-foreground [color-scheme:dark] outline-none cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm text-foreground [color-scheme:dark] outline-none cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sales Agent</label>
                  <input list="editEmpSuggestionsList" name="salesAgent" value={formData.salesAgent || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" placeholder="Agent Name" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Mentor</label>
                  <input list="editEmpSuggestionsList" name="mentor" value={formData.mentor || ""} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none" placeholder="Mentor Name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Candidate Status</label>
                  <select name="status" value={formData.status || "Active"} onChange={handleChange} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-sm outline-none font-semibold text-amber-400">
                    <option value="Active" className="text-foreground">Active</option>
                    <option value="Inactive" className="text-foreground">Inactive</option>
                    <option value="Dropped Out" className="text-foreground">Dropped Out</option>
                    <option value="Completed" className="text-foreground">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Progress ({formData.progress || 0}%)</label>
                  <input type="range" min="0" max="100" name="progress" value={formData.progress || 0} onChange={handleChange} className="w-full mt-2 accent-emerald-500 cursor-pointer" />
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

// 3. REMOVE CANDIDATE
function RemoveCandidateModal({ onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState("Active"); // 'Active' | 'Inactive'
  const [deletingId, setDeletingId] = useState(null);

  const loadCandidates = () => {
    api.get("/api/internships/candidates").then((res) => setCandidates(res.data || []));
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filtered = candidates.filter((c) => {
    const st = (c.status || "Active").toLowerCase();
    if (tab === "Active") return st === "active";
    return st !== "active";
  });

  const handleDelete = async (item) => {
    if (!confirm(`Remove "${item.name}" from candidate directory?`)) return;
    setDeletingId(item._id);
    try {
      await api.delete(`/api/internships/candidates/${item._id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== item._id));
    } catch (err) {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
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
          <p className="text-sm text-muted-foreground">Audit and offboard active or inactive candidates</p>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-zinc-800 rounded-2xl border border-border/60">
        {["Active", "Inactive"].map((tName) => (
          <button
            key={tName}
            onClick={() => setTab(tName)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
              tab === tName ? "bg-red-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tName} Interns
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No {tab.toLowerCase()} candidates found.</p>
        ) : (
          filtered.map((c) => (
            <div key={c._id} className="p-4 rounded-2xl bg-zinc-800/80 border border-border flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">{c.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{c.courseName} · Enrolled: {c.startDate ? c.startDate.split("T")[0] : "N/A"} · Agent: {c.salesAgent}</p>
              </div>
              <button
                disabled={deletingId === c._id}
                onClick={() => handleDelete(c)}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition shadow-sm flex items-center gap-1.5 text-xs font-bold"
              >
                {deletingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 4. ADD COURSE
function AddCourseModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "USD ($)",
    prices: {
      month1: "",
      month2: "",
      month3: "",
      month6: "",
      month12: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handlePriceTier = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [field]: formatNumberInput(val) },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/internships/courses", formData);
      alert("New internship course published successfully!");
      onClose();
    } catch (err) {
      alert("Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Add a New Course</h2>
          <p className="text-sm text-muted-foreground">Configure curriculum pricing parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
          <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none focus:border-indigo-500" placeholder="e.g. Advanced AI & Machine Learning" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Currency</label>
          <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none">
            <option value="USD ($)">USD ($)</option>
            <option value="INR (₹)">INR (₹)</option>
            <option value="EUR (€)">EUR (€)</option>
            <option value="GBP (£)">GBP (£)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1">Standard Base Price</label>
        <input required value={formData.price} onChange={(e) => setFormData({ ...formData, price: formatNumberInput(e.target.value) })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none focus:border-indigo-500" placeholder="e.g. 500" />
      </div>

      <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Duration Pricing Matrix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: "month1", label: "1 Month" },
            { key: "month2", label: "2 Months" },
            { key: "month3", label: "3 Months" },
            { key: "month6", label: "6 Months" },
            { key: "month12", label: "12 Months" },
          ].map((mTier) => (
            <div key={mTier.key}>
              <label className="text-[11px] text-muted-foreground block mb-1">{mTier.label}</label>
              <input value={formData.prices[mTier.key]} onChange={(e) => handlePriceTier(mTier.key, e.target.value)} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-xs outline-none" placeholder="Price" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />} Create Course
        </button>
      </div>
    </form>
  );
}

// 5. EDIT COURSE
function EditCourseModal({ onClose }) {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/internships/courses").then((res) => {
      const list = res.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedId(list[0]._id);
        setFormData(list[0]);
      }
    });
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const item = courses.find((c) => c._id === id);
    if (item) setFormData({ ...item, prices: item.prices || {} });
  };

  const handlePriceTier = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      prices: { ...prev.prices, [field]: formatNumberInput(val) },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      await api.put(`/api/internships/courses/${formData._id}`, formData);
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
        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
          <BookOpen size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Edit Course Curriculum</h2>
          <p className="text-sm text-muted-foreground">Select course to modify pricing and tiers</p>
        </div>
        {courses.length > 0 && (
          <select value={selectedId} onChange={handleSelect} className="bg-zinc-800 border border-cyan-500/40 text-cyan-400 font-semibold rounded-xl px-4 py-2 text-sm outline-none">
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {!formData ? (
        <p className="text-center py-12 text-muted-foreground">No internship courses available.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Course Name</label>
              <input required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Currency</label>
              <select value={formData.currency || "USD ($)"} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none">
                <option value="USD ($)">USD ($)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Standard Base Price</label>
            <input required value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: formatNumberInput(e.target.value) })} className="w-full bg-zinc-800 border border-border rounded-xl p-3 text-sm outline-none" />
          </div>

          <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Duration Pricing Tiers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: "month1", label: "1 Month" },
                { key: "month2", label: "2 Months" },
                { key: "month3", label: "3 Months" },
                { key: "month6", label: "6 Months" },
                { key: "month12", label: "12 Months" },
              ].map((mTier) => (
                <div key={mTier.key}>
                  <label className="text-[11px] text-muted-foreground block mb-1">{mTier.label}</label>
                  <input value={(formData.prices && formData.prices[mTier.key]) || ""} onChange={(e) => handlePriceTier(mTier.key, e.target.value)} className="w-full bg-zinc-800 border border-border rounded-xl p-2.5 text-xs outline-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />} Update Course
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// 6. REMOVE COURSE
function RemoveCourseModal({ onClose }) {
  const [courses, setCourses] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api.get("/api/internships/courses").then((res) => setCourses(res.data || []));
  }, []);

  const handleDelete = async (course) => {
    if (!confirm(`Delete course "${course.name}"?`)) return;
    setDeletingId(course._id);
    try {
      await api.delete(`/api/internships/courses/${course._id}`);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch (err) {
      alert("Failed to delete course.");
    } finally {
      setDeletingId(null);
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
          <p className="text-sm text-muted-foreground">List of all available courses that can be deleted</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {courses.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No courses found in directory.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="p-4 rounded-2xl bg-zinc-800/80 border border-border flex items-center justify-between gap-4 transition hover:border-red-500/30">
              <div>
                <h4 className="font-bold text-base text-foreground">{course.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Base Price: {course.currency} {course.price}</p>
              </div>
              <button
                disabled={deletingId === course._id}
                onClick={() => handleDelete(course)}
                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition shadow-sm flex items-center gap-2 text-xs font-bold"
                title="Delete Course"
              >
                {deletingId === course._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
