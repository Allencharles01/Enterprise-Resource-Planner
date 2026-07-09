"use client";

import { useEffect, useState } from "react";
import { X, Upload, Pencil, CheckCircle } from "lucide-react";

const inputClass =
  "w-full rounded-2xl bg-[#1b2333] border border-slate-700/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition";

const getInitialFormData = (activeTab) => {
  if (activeTab === "Internships") {
    return {
      candidateName: "",
      email: "",
      phone: "",
      college: "",
      courseBranch: "",
      internshipProgram: "",
      internshipDuration: "",
      courseFee: "",
      preferredStartDate: "",
      additionalNotes: "",
    };
  }

  if (activeTab === "Training") {
    return {
      organizationName: "",
      contactPersonName: "",
      email: "",
      phone: "",
      trainingProgram: "",
      participantsCount: "",
      trainingMode: "",
      trainingDuration: "",
      preferredStartDate: "",
      trainingFee: "",
      trainingRequirements: "",
      additionalNotes: "",
    };
  }

  return {
    name: "",
    email: "",
    phone: "",
    additionalPhone: "",
    additionalEmail: "",
    projectDetails: "",
    budgetRange: "",
    deadline: "",
  };
};

export default function NewLeadModal({
  isOpen,
  onClose,
  activeTab = "Client Projects",
}) {
  const [step, setStep] = useState("form");
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(getInitialFormData(activeTab));

  const resetModal = () => {
    setStep("form");
    setFiles([]);
    setFormData(getInitialFormData(activeTab));
  };

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        resetModal();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, activeTab]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getValue = (field) => formData[field] ?? "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    setFiles((prevFiles) => {
      const existingFiles = new Set(
        prevFiles.map(
          (file) => `${file.name}-${file.size}-${file.lastModified}`,
        ),
      );

      const newFiles = selectedFiles.filter(
        (file) =>
          !existingFiles.has(`${file.name}-${file.size}-${file.lastModified}`),
      );

      return [...prevFiles, ...newFiles];
    });

    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const handlePreview = () => {
    setStep("preview");
  };

  const handleSubmit = () => {
    alert("Lead submitted successfully for admin approval.");
    handleClose();
  };

  const getModalTitle = () => {
    if (activeTab === "Internships") return "New Internship Lead";
    if (activeTab === "Training") return "New Training Lead";
    return "New Lead";
  };

  const getModalDescription = () => {
    if (activeTab === "Internships") {
      return "Fill in the candidate details to submit a new internship lead";
    }

    if (activeTab === "Training") {
      return "Fill in the training details to submit a new training lead";
    }

    return "Fill in the details to submit a new lead";
  };

  const getUploadLabel = () => {
    if (activeTab === "Internships") return "Upload Resume";
    if (activeTab === "Training") return "Upload Requirement Document";
    return "Upload Project Files";
  };

  const getUploadText = () => {
    if (activeTab === "Internships") {
      return "Upload resume — PDF, DOC, DOCX";
    }

    if (activeTab === "Training") {
      return "Upload training requirement document — PDF, PPT, DOC, DOCX";
    }

    return "Upload PDF, PPT, DOC, DOCX — proposal or deck";
  };

  const getPreviewRows = () => {
    if (activeTab === "Internships") {
      return [
        ["Candidate Name", formData.candidateName],
        ["Email", formData.email],
        ["Phone", formData.phone],
        ["College", formData.college],
        ["Course / Branch", formData.courseBranch],
        ["Internship Program", formData.internshipProgram],
        ["Duration", formData.internshipDuration],
        ["Course Fee", formData.courseFee],
        ["Start Date", formData.preferredStartDate],
        ["Additional Notes", formData.additionalNotes],
      ];
    }

    if (activeTab === "Training") {
      return [
        ["Organization", formData.organizationName],
        ["Contact Person", formData.contactPersonName],
        ["Email", formData.email],
        ["Phone", formData.phone],
        ["Training Program", formData.trainingProgram],
        ["Participants", formData.participantsCount],
        ["Training Mode", formData.trainingMode],
        ["Duration", formData.trainingDuration],
        ["Start Date", formData.preferredStartDate],
        ["Training Fee", formData.trainingFee],
        ["Requirements", formData.trainingRequirements],
        ["Additional Notes", formData.additionalNotes],
      ];
    }

    return [
      ["Name", formData.name],
      ["Email", formData.email],
      ["Phone", formData.phone],
      ["Alt Phone", formData.additionalPhone],
      ["Alt Email", formData.additionalEmail],
      ["Project Details", formData.projectDetails],
      ["Budget Range", formData.budgetRange],
      ["Deadline", formData.deadline],
    ];
  };

  const renderClientProjectForm = () => (
    <>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Name *
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Client / Lead full name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Email ID *
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="primary@company.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Phone Number *
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Additional Phone
          </label>
          <input
            name="additionalPhone"
            value={formData.additionalPhone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX optional"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Additional Email
          </label>
          <input
            name="additionalEmail"
            value={formData.additionalEmail}
            onChange={handleChange}
            className={inputClass}
            placeholder="secondary@email.com optional"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Project Details
        </label>
        <textarea
          name="projectDetails"
          value={formData.projectDetails}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Describe the project requirements, scope, and objectives..."
        />
      </div>

      <FileUploadSection />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Budget Range
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select range</option>
            <option value="Below ₹50,000">Below ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
            <option value="Above ₹5,00,000">Above ₹5,00,000</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Preferable Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
    </>
  );

  const renderInternshipForm = () => (
    <>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Candidate Name *
        </label>
        <input
          name="candidateName"
          value={getValue("candidateName")}
          onChange={handleChange}
          className={inputClass}
          placeholder="Candidate full name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Email ID *
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="candidate@email.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Phone Number *
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            College / University
          </label>
          <input
            name="college"
            value={formData.college}
            onChange={handleChange}
            className={inputClass}
            placeholder="College or university name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Course / Branch
          </label>
          <input
            name="courseBranch"
            value={formData.courseBranch}
            onChange={handleChange}
            className={inputClass}
            placeholder="B.Tech CSE / MBA / BCA etc."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Internship Program
          </label>
          <select
            name="internshipProgram"
            value={formData.internshipProgram}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select program</option>
            <option value="Full Stack Development">Full Stack Development</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Data Science & ML">Data Science & ML</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Cyber Security">Cyber Security</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Internship Duration
          </label>
          <select
            name="internshipDuration"
            value={formData.internshipDuration}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select duration</option>
            <option value="1 Month">1 Month</option>
            <option value="2 Months">2 Months</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Course Fee
          </label>
          <input
            name="courseFee"
            value={formData.courseFee}
            onChange={handleChange}
            className={inputClass}
            placeholder="₹25,000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Preferred Start Date
          </label>
          <input
            type="date"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <FileUploadSection />

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Any additional details about the candidate..."
        />
      </div>
    </>
  );

  const renderTrainingForm = () => (
    <>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Client / Organization Name *
        </label>
        <input
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          className={inputClass}
          placeholder="Organization name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Contact Person Name *
          </label>
          <input
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Contact person full name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Email ID *
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="contact@company.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Phone Number *
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Training Program
          </label>
          <input
            name="trainingProgram"
            value={formData.trainingProgram ?? ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Corporate Sales Training"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Number of Participants
          </label>
          <input
            name="participantsCount"
            value={formData.participantsCount}
            onChange={handleChange}
            className={inputClass}
            placeholder="25"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Training Mode
          </label>
          <select
            name="trainingMode"
            value={formData.trainingMode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Training Duration
          </label>
          <select
            name="trainingDuration"
            value={formData.trainingDuration}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select duration</option>
            <option value="1 Day">1 Day</option>
            <option value="3 Days">3 Days</option>
            <option value="1 Week">1 Week</option>
            <option value="2 Weeks">2 Weeks</option>
            <option value="1 Month">1 Month</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Preferred Start Date
          </label>
          <input
            type="date"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Training Fee / Budget
          </label>
          <input
            name="trainingFee"
            value={formData.trainingFee}
            onChange={handleChange}
            className={inputClass}
            placeholder="₹1,20,000"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Training Requirements
        </label>
        <textarea
          name="trainingRequirements"
          value={formData.trainingRequirements}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Mention training goals, topics, participant level, and requirements..."
        />
      </div>

      <FileUploadSection />

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Any additional details..."
        />
      </div>
    </>
  );

  const FileUploadSection = () => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {getUploadLabel()}
      </label>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-600 bg-[#151e2e] px-4 py-4 text-sm text-slate-400 hover:border-indigo-500 hover:text-indigo-300 transition">
        <Upload size={18} />
        <span>{getUploadText()}</span>

        <input
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-[#1b2333] px-4 py-2"
            >
              <span
                title={file.name}
                className="min-w-0 flex-1 break-all text-sm font-medium text-slate-200"
              >
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      {step === "form" && (
        <div className="w-full max-w-xl max-h-[88vh] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between border-b border-slate-700/60 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-white">
                {getModalTitle()}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {getModalDescription()}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 hover:scale-105 active:scale-95 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              {activeTab === "Internships"
                ? renderInternshipForm()
                : activeTab === "Training"
                  ? renderTrainingForm()
                  : renderClientProjectForm()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-700/60 px-6 py-5">
            <button
              onClick={handleClose}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handlePreview}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between border-b border-slate-700/60 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Preview Lead Details
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Review before submitting for approval
              </p>
            </div>

            <button
              onClick={handleClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 hover:scale-105 active:scale-95 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-6 py-7">
            <div className="rounded-2xl bg-[#182132] px-5 py-5">
              <div className="space-y-4 text-sm">
                {getPreviewRows().map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 items-start"
                  >
                    <span className="font-bold text-slate-400">{label}</span>
                    <span className="min-w-0 break-words font-semibold text-slate-100">
                      {value || "none"}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 items-start">
                  <span className="font-bold text-slate-400">
                    Uploaded Files
                  </span>

                  <div className="min-w-0 space-y-2">
                    {files.length > 0 ? (
                      files.map((file, index) => (
                        <div
                          key={`${file.name}-preview-${index}`}
                          className="flex items-start justify-between gap-2 rounded-lg bg-[#111827] px-3 py-2"
                        >
                          <span
                            title={file.name}
                            className="min-w-0 flex-1 break-all font-semibold text-slate-100"
                          >
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="font-semibold text-slate-100">
                        none
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-6 pb-7">
            <button
              onClick={() => setStep("form")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
            >
              <Pencil size={17} />
              Edit
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition"
            >
              <CheckCircle size={17} />
              Submit for Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
}