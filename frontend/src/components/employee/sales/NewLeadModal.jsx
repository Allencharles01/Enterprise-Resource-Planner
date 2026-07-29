"use client";

import { useEffect, useState } from "react";
import { X, Upload, Pencil, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

const labelClass = "new-lead-label";

const inputClass = "new-lead-input";

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
  const [internshipCourses, setInternshipCourses] = useState([]);
  const [trainingCourses, setTrainingCourses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/api/internships/courses")
        .then((res) => setInternshipCourses(res.data || []))
        .catch((err) =>
          console.error("Failed to fetch internship courses", err)
        );

      api
        .get("/api/training/courses")
        .then((res) => setTrainingCourses(res.data || []))
        .catch((err) => console.error("Failed to fetch training courses", err));
    }
  }, [isOpen]);

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
        prevFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
      );

      const newFiles = selectedFiles.filter(
        (file) =>
          !existingFiles.has(`${file.name}-${file.size}-${file.lastModified}`)
      );

      return [...prevFiles, ...newFiles];
    });

    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handlePreview = () => {
    setStep("preview");
  };

  const handleSubmit = async () => {
    try {
      const agentName = localStorage.getItem("userName") || "Rahul Sharma";

      if (activeTab === "Internships") {
        const payload = {
          name: formData.candidateName,
          email: formData.email,
          phone: formData.phone,
          education: formData.education || "Undergraduate",
          university: formData.college || "N/A",
          courseName: formData.internshipProgram,
          duration: formData.internshipDuration,
          cost: formData.courseFee,
          salesAgent: agentName,
          status: "Active",
          progress: 0,
        };

        await api.post("/api/internships/candidates", payload);
      } else if (activeTab === "Training") {
        const payload = {
          name: formData.contactPersonName,
          email: formData.email,
          phone: formData.phone,
          courseName: formData.trainingProgram,
          duration: formData.trainingDuration,
          cost: formData.trainingFee,
          salesAgent: agentName,
          status: "Active",
          progress: 0,
        };

        await api.post("/api/training/candidates", payload);
      } else {
        const payload = {
          basicDetails: {
            projectTitle: formData.name,
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            projectLead: {
              personal: {
                firstName: agentName,
                lastName: "",
              },
            },
            budget: formData.budgetRange,
            deadline: formData.deadline,
          },
        };

        await api.post("/api/projects", payload);
      }

      alert("Lead submitted successfully for admin approval.");
      window.dispatchEvent(new Event("leadCreated"));
      handleClose();
    } catch (err) {
      console.error("Failed to submit lead:", err);
      alert("Failed to submit lead. Please try again.");
    }
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

  const FileUploadSection = () => (
    <div>
      <label className={labelClass}>{getUploadLabel()}</label>

      <label className="new-lead-upload-box">
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
            <div key={`${file.name}-${index}`} className="new-lead-file-row">
              <span
                title={file.name}
                className="new-lead-preview-value min-w-0 flex-1 break-all text-sm font-medium"
              >
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500 transition hover:bg-red-500 hover:text-white dark:text-red-400"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderClientProjectForm = () => (
    <>
      <div>
        <label className={labelClass}>Name *</label>
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
          <label className={labelClass}>Email ID *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="primary@company.com"
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className={labelClass}>Additional Phone</label>
          <input
            name="additionalPhone"
            value={formData.additionalPhone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX optional"
          />
        </div>

        <div>
          <label className={labelClass}>Additional Email</label>
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
        <label className={labelClass}>Project Details</label>
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
          <label className={labelClass}>Budget Range</label>
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
          <label className={labelClass}>Preferable Deadline</label>
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
        <label className={labelClass}>Candidate Name *</label>
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
          <label className={labelClass}>Email ID *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="candidate@email.com"
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className={labelClass}>College / University</label>
          <input
            name="college"
            value={formData.college}
            onChange={handleChange}
            className={inputClass}
            placeholder="College or university name"
          />
        </div>

        <div>
          <label className={labelClass}>Course / Branch</label>
          <input
            name="courseBranch"
            value={formData.courseBranch}
            onChange={handleChange}
            className={inputClass}
            placeholder="B.Tech CSE / MBA / BCA etc."
          />
        </div>

        <div>
          <label className={labelClass}>Internship Program</label>
          <select
            name="internshipProgram"
            value={formData.internshipProgram}
            onChange={(e) => {
              handleChange(e);

              setFormData((prev) => ({
                ...prev,
                internshipProgram: e.target.value,
                internshipDuration: "",
                courseFee: "",
              }));
            }}
            className={inputClass}
          >
            <option value="">Select program</option>
            {internshipCourses.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Internship Duration</label>
          <select
            name="internshipDuration"
            value={formData.internshipDuration}
            onChange={(e) => {
              handleChange(e);

              const selectedCourse = internshipCourses.find(
                (c) => c.name === formData.internshipProgram
              );

              if (selectedCourse?.prices) {
                const durationKey =
                  e.target.value === "1 Month"
                    ? "month1"
                    : e.target.value === "2 Months"
                      ? "month2"
                      : e.target.value === "3 Months"
                        ? "month3"
                        : e.target.value === "6 Months"
                          ? "month6"
                          : e.target.value === "12 Months"
                            ? "month12"
                            : "";

                const fee =
                  selectedCourse.prices[durationKey] ||
                  selectedCourse.price ||
                  "";

                setFormData((prev) => ({
                  ...prev,
                  internshipDuration: e.target.value,
                  courseFee: fee ? `₹ ${fee}` : "",
                }));
              }
            }}
            className={inputClass}
          >
            <option value="">Select duration</option>
            {(() => {
              const selectedCourse = internshipCourses.find(
                (c) => c.name === formData.internshipProgram
              );

              const availableDurations = [];

              if (selectedCourse?.prices) {
                if (selectedCourse.prices.month1)
                  availableDurations.push("1 Month");
                if (selectedCourse.prices.month2)
                  availableDurations.push("2 Months");
                if (selectedCourse.prices.month3)
                  availableDurations.push("3 Months");
                if (selectedCourse.prices.month6)
                  availableDurations.push("6 Months");
                if (selectedCourse.prices.month12)
                  availableDurations.push("12 Months");
              }

              return availableDurations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ));
            })()}
          </select>
        </div>

        <div>
          <label className={labelClass}>Course Fee</label>
          <input
            name="courseFee"
            value={formData.courseFee}
            onChange={handleChange}
            className={inputClass}
            placeholder="₹25,000"
          />
        </div>

        <div>
          <label className={labelClass}>Preferred Start Date</label>
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
        <label className={labelClass}>Additional Notes</label>
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
        <label className={labelClass}>Client / Organization Name *</label>
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
          <label className={labelClass}>Contact Person Name *</label>
          <input
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Contact person full name"
          />
        </div>

        <div>
          <label className={labelClass}>Email ID *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="contact@company.com"
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className={labelClass}>Training Program</label>
          <select
            name="trainingProgram"
            value={formData.trainingProgram ?? ""}
            onChange={(e) => {
              handleChange(e);

              const selectedCourse = trainingCourses.find(
                (c) => c.name === e.target.value
              );

              if (selectedCourse) {
                setFormData((prev) => ({
                  ...prev,
                  trainingProgram: e.target.value,
                  trainingFee: selectedCourse.price
                    ? `₹ ${selectedCourse.price}`
                    : "",
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  trainingProgram: e.target.value,
                  trainingFee: "",
                }));
              }
            }}
            className={inputClass}
          >
            <option value="">Select program</option>
            {trainingCourses.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Number of Participants</label>
          <input
            name="participantsCount"
            value={formData.participantsCount}
            onChange={handleChange}
            className={inputClass}
            placeholder="25"
          />
        </div>

        <div>
          <label className={labelClass}>Training Mode</label>
          <select
            name="trainingMode"
            value={formData.trainingMode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select mode</option>
            <option value="online">online</option>
            <option value="offline">offline</option>
            <option value="hybrid">hybrid</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Training Duration</label>
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
          <label className={labelClass}>Preferred Start Date</label>
          <input
            type="date"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Training Fee / Budget</label>
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
        <label className={labelClass}>Training Requirements</label>
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
        <label className={labelClass}>Additional Notes</label>
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      {step === "form" && (
        <div className="new-lead-modal-card w-full max-w-xl max-h-[88vh] overflow-hidden rounded-2xl">
          <div className="new-lead-modal-header flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="new-lead-title text-lg font-bold">
                {getModalTitle()}
              </h2>

              <p className="new-lead-subtitle mt-1 text-sm">
                {getModalDescription()}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:bg-red-400 active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          <div className="new-lead-modal-body max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              {activeTab === "Internships"
                ? renderInternshipForm()
                : activeTab === "Training"
                  ? renderTrainingForm()
                  : renderClientProjectForm()}
            </div>
          </div>

          <div className="new-lead-modal-footer grid grid-cols-2 gap-3 px-6 py-5">
            <button
              onClick={handleClose}
              className="new-lead-secondary-btn rounded-2xl px-5 py-3 text-sm font-bold transition"
            >
              Cancel
            </button>

            <button
              onClick={handlePreview}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-90 dark:bg-indigo-600 dark:shadow-indigo-500/25 dark:hover:bg-indigo-500"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="new-lead-modal-card w-full max-w-xl overflow-hidden rounded-2xl">
          <div className="new-lead-modal-header flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="new-lead-title text-2xl font-bold">
                Preview Lead Details
              </h2>

              <p className="new-lead-subtitle mt-1 text-sm">
                Review before submitting for approval
              </p>
            </div>

            <button
              onClick={handleClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:bg-red-400 active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          <div className="new-lead-modal-body px-6 py-7">
            <div className="new-lead-preview-card">
              <div className="space-y-4 text-sm">
                {getPreviewRows().map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-4"
                  >
                    <span className="new-lead-preview-label font-bold">
                      {label}
                    </span>

                    <span className="new-lead-preview-value min-w-0 break-words font-semibold">
                      {value || "none"}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-4">
                  <span className="new-lead-preview-label font-bold">
                    Uploaded Files
                  </span>

                  <div className="min-w-0 space-y-2">
                    {files.length > 0 ? (
                      files.map((file, index) => (
                        <div
                          key={`${file.name}-preview-${index}`}
                          className="new-lead-file-row"
                        >
                          <span
                            title={file.name}
                            className="new-lead-preview-value min-w-0 flex-1 break-all font-semibold"
                          >
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500 transition hover:bg-red-500 hover:text-white dark:text-red-400"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="new-lead-preview-value font-semibold">
                        none
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="new-lead-modal-footer grid grid-cols-2 gap-3 px-6 pb-7 pt-5">
            <button
              onClick={() => setStep("form")}
              className="new-lead-secondary-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition"
            >
              <Pencil size={17} />
              Edit
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-90 dark:bg-indigo-600 dark:shadow-indigo-500/25 dark:hover:bg-indigo-500"
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