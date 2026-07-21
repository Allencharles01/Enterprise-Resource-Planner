"use client";

import { useMemo, useState } from "react";
import {
  Upload,
  X,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  RefreshCw,
  GitCompare,
  Lock,
} from "lucide-react";

const employees = [
  {
    id: 1,
    empId: "EMP-001",
    name: "Layla Sow",
    initials: "LS",
    designation: "Sales Executive",
    department: "Sales",
    email: "layla.sow@corp.com",
    contact: "+91 99001 11111",
  },
  {
    id: 2,
    empId: "EMP-002",
    name: "Ekta Chauhan",
    initials: "EC",
    designation: "Digital Strategist",
    department: "Digital Marketing",
    email: "ekta.chauhan@corp.com",
    contact: "+91 99002 22222",
  },
  {
    id: 3,
    empId: "EMP-003",
    name: "Rohit Kumar",
    initials: "RK",
    designation: "Account Manager",
    department: "Sales",
    email: "rohit.kumar@corp.com",
    contact: "+91 99003 33333",
  },
  {
    id: 4,
    empId: "EMP-004",
    name: "Meera Joshi",
    initials: "MJ",
    designation: "SEO Specialist",
    department: "Digital Marketing",
    email: "meera.joshi@corp.com",
    contact: "+91 99004 44444",
  },
];

const existingDatabaseRecords = [
  {
    name: "Aarav Sharma",
    contact: "+91 98765 43210",
    email: "aarav.sharma@gmail.com",
    status: "Student",
  },
  {
    name: "Priya Mehta",
    contact: "+91 98765 12345",
    email: "priya.mehta@gmail.com",
    status: "Employed",
  },
  {
    name: "Aarav S.",
    contact: "+91 98765 43210",
    email: "different.aarav@gmail.com",
    status: "Student",
  },
  {
    name: "Different Priya",
    contact: "+91 98765 00000",
    email: "priya.mehta@gmail.com",
    status: "Employed",
  },
];

const normalize = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

const cleanPhone = (value = "") => String(value).replace(/\D/g, "");

const getFieldValue = (record, possibleKeys) => {
  const keys = Object.keys(record || {});

  const exactKey = keys.find((key) =>
    possibleKeys.some((possibleKey) => normalize(key) === normalize(possibleKey))
  );

  if (exactKey) return record[exactKey];

  const partialKey = keys.find((key) =>
    possibleKeys.some((possibleKey) =>
      normalize(key).includes(normalize(possibleKey))
    )
  );

  return partialKey ? record[partialKey] : "";
};

const getName = (record) =>
  getFieldValue(record, [
    "name",
    "full name",
    "client name",
    "candidate name",
    "student name",
  ]);

const getEmail = (record) =>
  getFieldValue(record, ["email", "email id", "email address", "mail"]);

const getContact = (record) =>
  getFieldValue(record, [
    "contact",
    "phone",
    "phone number",
    "mobile",
    "mobile number",
    "contact number",
  ]);

const getStatus = (record) =>
  getFieldValue(record, ["status", "employment status", "current status"]);

const parseCsvLine = (line) => {
  const result = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  result.push(currentValue.trim());
  return result;
};

const parseCsvText = (text) => {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
    };
  }

  const headers = parseCsvLine(lines[0]).map(
    (header, index) => header || `Column ${index + 1}`
  );

  const rows = lines.slice(1).map((line, rowIndex) => {
    const values = parseCsvLine(line);

    const record = {
      id: rowIndex + 1,
    };

    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });

    return record;
  });

  return {
    headers,
    rows,
  };
};

const getExactSyncResults = (records) => {
  return records.map((record, index) => {
    const importedName = normalize(getName(record));
    const importedEmail = normalize(getEmail(record));
    const importedContact = cleanPhone(getContact(record));

    const exactMatch = existingDatabaseRecords.find(
      (existing) =>
        importedName === normalize(existing.name) &&
        importedEmail === normalize(existing.email) &&
        importedContact === cleanPhone(existing.contact)
    );

    return {
      id: index + 1,
      name: getName(record) || "N/A",
      contact: getContact(record) || "N/A",
      email: getEmail(record) || "N/A",
      status: getStatus(record) || "N/A",
      action: exactMatch ? "Skipped Duplicate" : "Ready to Sync",
      note: exactMatch
        ? "Exact same entry already exists, so it will not be added again."
        : "Unique record, safe to sync.",
    };
  });
};

const getCompareResults = (records) => {
  const results = [];

  records.forEach((record, index) => {
    const importedName = normalize(getName(record));
    const importedEmail = normalize(getEmail(record));
    const importedContact = cleanPhone(getContact(record));

    existingDatabaseRecords.forEach((existing) => {
      const sameEmail =
        importedEmail && importedEmail === normalize(existing.email);

      const samePhone =
        importedContact && importedContact === cleanPhone(existing.contact);

      const differentName =
        importedName && importedName !== normalize(existing.name);

      if ((sameEmail || samePhone) && differentName) {
        results.push({
          id: results.length + 1,
          importedRecordNo: index + 1,
          importedName: getName(record) || "N/A",
          existingName: existing.name,
          importedContact: getContact(record) || "N/A",
          existingContact: existing.contact,
          importedEmail: getEmail(record) || "N/A",
          existingEmail: existing.email,
          reason:
            sameEmail && samePhone
              ? "Same email and phone, different name"
              : sameEmail
              ? "Same email, different name"
              : "Same phone, different name",
        });
      }
    });
  });

  return results;
};

const getDuplicateResults = (records) => {
  return records.flatMap((record, index) => {
    const importedName = normalize(getName(record));
    const importedEmail = normalize(getEmail(record));
    const importedContact = cleanPhone(getContact(record));

    const exactMatch = existingDatabaseRecords.find(
      (existing) =>
        importedName === normalize(existing.name) &&
        importedEmail === normalize(existing.email) &&
        importedContact === cleanPhone(existing.contact)
    );

    if (exactMatch) {
      return [
        {
          id: index + 1,
          importedName: getName(record) || "N/A",
          existingName: exactMatch.name,
          importedContact: getContact(record) || "N/A",
          existingContact: exactMatch.contact,
          importedEmail: getEmail(record) || "N/A",
          existingEmail: exactMatch.email,
          matchType: "Exact Duplicate",
        },
      ];
    }

    return [];
  });
};

export default function ImportDataModal({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showSync, setShowSync] = useState(false);

  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewError, setPreviewError] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All Employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const syncResults = useMemo(() => {
    if (previewRows.length === 0) return [];
    return getExactSyncResults(previewRows);
  }, [previewRows]);

  const compareResults = useMemo(() => {
    if (previewRows.length === 0) return [];
    return getCompareResults(previewRows);
  }, [previewRows]);

  const duplicateResults = useMemo(() => {
    if (previewRows.length === 0) return [];
    return getDuplicateResults(previewRows);
  }, [previewRows]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDepartment =
        departmentFilter === "All Employees" ||
        employee.department === departmentFilter;

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.empId.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.designation.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);

      return matchesDepartment && matchesSearch;
    });
  }, [departmentFilter, searchQuery]);

  const detectFileType = (file) => {
    const name = file.name.toLowerCase();

    if (name.endsWith(".csv")) return "csv";
    if (name.endsWith(".pdf")) return "pdf";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "document";

    return "unknown";
  };

  const parseSelectedCsvFile = () => {
    if (!selectedFile || fileType !== "csv") return Promise.resolve([]);

    if (previewRows.length > 0) {
      return Promise.resolve(previewRows);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result || "";
        const parsedData = parseCsvText(String(text));

        setPreviewHeaders(parsedData.headers);
        setPreviewRows(parsedData.rows);

        if (parsedData.rows.length === 0) {
          setPreviewError("No records found in this CSV file.");
        }

        resolve(parsedData.rows);
      };

      reader.onerror = () => {
        setPreviewError("Unable to read this CSV file.");
        resolve([]);
      };

      reader.readAsText(selectedFile);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    const detectedType = detectFileType(file);

    setSelectedFile(file);
    setFileType(detectedType);
    setFileUrl(URL.createObjectURL(file));
    setIsUploaded(false);

    setShowPreview(false);
    setShowDuplicate(false);
    setShowCompare(false);
    setShowSync(false);

    setPreviewHeaders([]);
    setPreviewRows([]);
    setPreviewError("");
    setSelectedEmployees([]);
  };

  const removeFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    setSelectedFile(null);
    setFileUrl("");
    setFileType("");
    setIsUploaded(false);

    setShowPreview(false);
    setShowDuplicate(false);
    setShowCompare(false);
    setShowSync(false);

    setPreviewHeaders([]);
    setPreviewRows([]);
    setPreviewError("");
    setSelectedEmployees([]);
  };

  const handlePreview = async () => {
    if (!selectedFile) return;

    setShowPreview(true);
    setShowDuplicate(false);
    setShowCompare(false);
    setShowSync(false);
    setPreviewError("");

    if (fileType === "csv") {
      await parseSelectedCsvFile();
      return;
    }

    if (fileType === "pdf" || fileType === "document") {
      setPreviewHeaders([]);
      setPreviewRows([]);
      return;
    }

    setPreviewError("Unsupported file format.");
  };

  const handleCheckDuplicate = async () => {
    if (!selectedFile) return;

    if (fileType === "csv") {
      await parseSelectedCsvFile();
    }

    setShowPreview(false);
    setShowDuplicate(true);
    setShowCompare(false);
    setShowSync(false);
  };

  const handleUpload = () => {
    if (!selectedFile || isUploaded) return;
    setIsUploaded(true);
  };

  const handleSync = async () => {
    if (!selectedFile) return;

    if (fileType === "csv") {
      await parseSelectedCsvFile();
    }

    setShowSync(true);
    setShowCompare(false);
    setShowDuplicate(false);
  };

  const handleCompare = async () => {
    if (!selectedFile) return;

    if (fileType === "csv") {
      await parseSelectedCsvFile();
    }

    setShowCompare(true);
    setShowSync(false);
    setShowDuplicate(false);
  };

  const toggleEmployee = (employee) => {
    const alreadySelected = selectedEmployees.some(
      (item) => item.id === employee.id
    );

    if (alreadySelected) {
      setSelectedEmployees((prev) =>
        prev.filter((item) => item.id !== employee.id)
      );
    } else {
      setSelectedEmployees((prev) => [...prev, employee]);
    }
  };

  const handleFinalAssign = () => {
    setShowPasswordPopup(false);
    setPassword("");
    setShowSuccessPopup(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-violet-200 dark:border-primary/30 bg-white dark:bg-background shadow-2xl shadow-violet-200/60 dark:shadow-primary/20">
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-violet-100 dark:border-border bg-white/95 dark:bg-background/95 px-7 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/15 text-violet-500 dark:text-violet-400">
              <Upload size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-foreground">
                Import Data
              </h2>
              <p className="text-sm text-slate-500 dark:text-muted-foreground">
                Upload a file · preview records · check duplicates · assign
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 dark:text-muted-foreground transition hover:bg-violet-50 dark:hover:bg-muted hover:text-slate-900 dark:hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-7">
          {!selectedFile ? (
            <label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-500/30 bg-violet-50/60 dark:bg-violet-500/5 p-8 text-center transition hover:bg-violet-100/60 dark:hover:bg-violet-500/10">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-100 dark:bg-violet-500/15 text-violet-500 dark:text-violet-400">
                <FileText size={28} />
              </div>

              <p className="text-base font-bold text-slate-900 dark:text-foreground">
                Drop file here or{" "}
                <span className="text-violet-500 dark:text-violet-400 underline">browse</span>
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                CSV, PDF, DOC, DOCX — max 20 MB
              </p>

              <div className="mt-4 flex items-center gap-2">
                {["CSV", "PDF", "DOC", "DOCX"].map((type) => (
                  <span
                    key={type}
                    className="rounded-md border border-violet-200 dark:border-violet-500/30 bg-violet-100 dark:bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <input
                type="file"
                accept=".csv,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-500 dark:text-violet-300">
                  <FileText size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-foreground">
                    {selectedFile.name}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-muted-foreground">
                    {selectedFile.type || "Selected file"} ·{" "}
                    {(selectedFile.size / 1024).toFixed(1)} KB
                    {isUploaded ? " · uploaded" : ""}
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                className="rounded-xl p-2 text-slate-400 dark:text-muted-foreground transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ActionButton
              icon={Eye}
              title="Preview"
              subtitle="View selected file data"
              color="indigo"
              disabled={!selectedFile}
              onClick={handlePreview}
            />

            <ActionButton
              icon={AlertTriangle}
              title="Check Duplicate"
              subtitle="Find exact duplicate entries"
              color="rose"
              disabled={!selectedFile}
              onClick={handleCheckDuplicate}
            />

            <ActionButton
              icon={Upload}
              title={isUploaded ? "Uploaded" : "Upload"}
              subtitle={
                isUploaded
                  ? "Upload confirmed successfully"
                  : "Confirm file upload"
              }
              color="emerald"
              disabled={!selectedFile || isUploaded}
              onClick={handleUpload}
              uploaded={isUploaded}
            />
          </div>

          {showPreview && (
            <PreviewSection
              file={selectedFile}
              fileType={fileType}
              fileUrl={fileUrl}
              headers={previewHeaders}
              rows={previewRows}
              error={previewError}
              onClose={() => setShowPreview(false)}
              onSync={handleSync}
              onCompare={handleCompare}
            />
          )}

          {showDuplicate && (
            <DuplicateSection
              results={duplicateResults}
              fileType={fileType}
              onClose={() => setShowDuplicate(false)}
            />
          )}

          {showSync && (
            <SyncSection
              results={syncResults}
              fileType={fileType}
              onClose={() => setShowSync(false)}
            />
          )}

          {showCompare && (
            <CompareSection
              results={compareResults}
              fileType={fileType}
              onClose={() => setShowCompare(false)}
            />
          )}

          <AssignSection
            selectedFile={selectedFile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            filteredEmployees={filteredEmployees}
            selectedEmployees={selectedEmployees}
            toggleEmployee={toggleEmployee}
            onAssign={() => setShowConfirmPopup(true)}
          />
        </div>
      </div>

      {showConfirmPopup && (
        <SmallPopup
          title="Confirm Assignment"
          onClose={() => setShowConfirmPopup(false)}
        >
          <div className="space-y-2">
            {selectedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="rounded-xl border border-violet-100 dark:border-border bg-violet-50/60 dark:bg-muted/20 p-3"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                  {employee.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">
                  {employee.empId} · {employee.designation} ·{" "}
                  {employee.department}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowConfirmPopup(false)}
              className="rounded-xl border border-violet-200 dark:border-border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-foreground hover:bg-violet-50 dark:hover:bg-muted"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                setShowConfirmPopup(false);
                setShowPasswordPopup(true);
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Confirm & Assign
            </button>
          </div>
        </SmallPopup>
      )}

      {showPasswordPopup && (
        <SmallPopup
          title="Admin Password Required"
          onClose={() => setShowPasswordPopup(false)}
        >
          <div className="flex items-center gap-3 rounded-xl border border-violet-200 dark:border-border bg-violet-50/40 dark:bg-muted/20 px-4 py-3">
            <Lock size={18} className="text-slate-400 dark:text-muted-foreground" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-foreground outline-none placeholder:text-slate-400 dark:placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-400 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowPasswordPopup(false)}
              className="rounded-xl border border-violet-200 dark:border-border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-foreground hover:bg-violet-50 dark:hover:bg-muted"
            >
              Cancel
            </button>

            <button
              onClick={handleFinalAssign}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Confirm
            </button>
          </div>
        </SmallPopup>
      )}

      {showSuccessPopup && (
        <SmallPopup title="Successfully Assigned" onClose={onClose}>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-400">
              <CheckCircle2 size={38} />
            </div>

            <p className="text-sm text-slate-500 dark:text-muted-foreground">
              File successfully assigned to:
            </p>

            <div className="mt-4 w-full space-y-2">
              {selectedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-xl border border-violet-100 dark:border-border bg-violet-50/60 dark:bg-muted/20 p-3"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                    {employee.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">
                    {employee.empId}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-foreground hover:bg-emerald-600"
            >
              Close
            </button>
          </div>
        </SmallPopup>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  subtitle,
  color,
  disabled,
  onClick,
  uploaded,
}) {
  const colors = {
    indigo:
      "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20",
    rose:
      "border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20",
    emerald:
      "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        uploaded
          ? "border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/40 text-slate-500 dark:text-slate-300"
          : colors[color]
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-muted-foreground">{subtitle}</p>
    </button>
  );
}

function PreviewSection({
  file,
  fileType,
  fileUrl,
  headers,
  rows,
  error,
  onClose,
  onSync,
  onCompare,
}) {
  return (
    <div className="rounded-2xl border border-violet-100 dark:border-border bg-card p-5 shadow-sm dark:shadow-none">
      <SectionHeader
        icon={Eye}
        iconClass="text-indigo-500 dark:text-indigo-400"
        title="Preview File"
        subtitle={`Showing preview for ${file?.name}`}
        onClose={onClose}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-4 text-xs text-rose-500 dark:text-rose-400">
          {error}
        </div>
      )}

      {!error && fileType === "csv" && (
        <div className="max-h-[380px] overflow-auto rounded-xl border border-violet-100 dark:border-border">
          <table className="min-w-[1100px] w-full border-separate border-spacing-0 text-left text-xs">
            <thead>
              <tr className="text-slate-500 dark:text-muted-foreground">
                <th className="sticky top-0 z-20 w-[90px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4 font-bold">
                  S.No.
                </th>

                {headers.map((header) => (
                  <th
                    key={header}
                    className="sticky top-0 z-20 min-w-[220px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4 font-bold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.length > 0 ? (
                rows.map((record, index) => (
                  <tr key={record.id} className="hover:bg-violet-50/60 dark:hover:bg-muted/20">
                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-500 dark:text-muted-foreground">
                      {index + 1}
                    </td>

                    {headers.map((header) => (
                      <td
                        key={`${record.id}-${header}`}
                        className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground"
                      >
                        {record[header] || "—"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="px-5 py-6 text-center text-xs text-slate-500 dark:text-muted-foreground"
                  >
                    Reading file preview...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!error && fileType === "pdf" && (
        <div className="overflow-hidden rounded-xl border border-violet-100 dark:border-border">
          <iframe
            src={fileUrl}
            title="PDF Preview"
            className="h-[520px] w-full bg-white"
          />
        </div>
      )}

      {!error && fileType === "document" && (
        <div className="rounded-xl border border-violet-100 dark:border-border bg-violet-50/40 dark:bg-muted/20 p-5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-foreground">{file.name}</h4>
          <p className="mt-2 text-xs text-slate-500 dark:text-muted-foreground">
            DOC/DOCX preview requires backend conversion. The selected file is
            ready for upload and assignment.
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-muted-foreground">
            Size: {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={onSync}
          className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-600 dark:text-cyan-400 transition hover:bg-cyan-100 dark:hover:bg-cyan-500/20"
        >
          <RefreshCw size={16} />
          Sync Exact Entries
        </button>

        <button
          onClick={onCompare}
          className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 px-5 py-3 text-sm font-bold text-violet-600 dark:text-violet-300 transition hover:bg-violet-100 dark:hover:bg-violet-500/20"
        >
          <GitCompare size={16} />
          Compare Conflicts
        </button>
      </div>
    </div>
  );
}

function DuplicateSection({ results, fileType, onClose }) {
  return (
    <div className="rounded-2xl border border-violet-100 dark:border-border bg-card p-5 shadow-sm dark:shadow-none">
      <SectionHeader
        icon={AlertTriangle}
        iconClass="text-rose-500 dark:text-rose-400"
        title="Duplicate Records"
        subtitle="Exact duplicate records found in existing data."
        onClose={onClose}
      />

      {fileType !== "csv" ? (
        <WarningBox text="Duplicate checking needs structured CSV data. PDF/DOC duplicate checking should be handled after backend extraction." />
      ) : results.length > 0 ? (
        <DuplicateTable results={results} />
      ) : (
        <SuccessBox text="No exact duplicate records found." />
      )}
    </div>
  );
}

function SyncSection({ results, fileType, onClose }) {
  const skippedCount = results.filter(
    (item) => item.action === "Skipped Duplicate"
  ).length;

  const readyCount = results.filter(
    (item) => item.action === "Ready to Sync"
  ).length;

  return (
    <div className="rounded-2xl border border-violet-100 dark:border-border bg-card p-5 shadow-sm dark:shadow-none">
      <SectionHeader
        icon={RefreshCw}
        iconClass="text-cyan-600 dark:text-cyan-400"
        title="Sync Result"
        subtitle="Exact duplicates are skipped so duplicate entries are not added again."
        onClose={onClose}
      />

      {fileType !== "csv" ? (
        <WarningBox text="Sync needs structured CSV records. PDF/DOC sync should be handled after backend extraction." />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <MiniStat
              label="Skipped Duplicates"
              value={skippedCount}
              color="rose"
            />
            <MiniStat label="Ready to Sync" value={readyCount} color="emerald" />
          </div>

          <SyncTable results={results} />
        </>
      )}
    </div>
  );
}

function CompareSection({ results, fileType, onClose }) {
  return (
    <div className="rounded-2xl border border-violet-100 dark:border-border bg-card p-5 shadow-sm dark:shadow-none">
      <SectionHeader
        icon={GitCompare}
        iconClass="text-violet-600 dark:text-violet-300"
        title="Comparison Result"
        subtitle="Shows records with same email or same phone number but different names."
        onClose={onClose}
      />

      {fileType !== "csv" ? (
        <WarningBox text="Compare needs structured CSV records. PDF/DOC comparison should be handled after backend extraction." />
      ) : results.length > 0 ? (
        <CompareTable results={results} />
      ) : (
        <SuccessBox text="No conflicting records found with same email or phone and different names." />
      )}
    </div>
  );
}

function AssignSection({
  selectedFile,
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  filteredEmployees,
  selectedEmployees,
  toggleEmployee,
  onAssign,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-violet-100 dark:border-border bg-card shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3 border-b border-violet-100 dark:border-border px-6 py-4">
        <Users size={18} className="text-violet-500 dark:text-violet-400" />

        <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">
          Assign to Employees
        </h3>

        {!selectedFile && (
          <span className="text-xs text-slate-400 dark:text-muted-foreground">
            — upload a file first
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-violet-100 dark:border-border bg-violet-50/40 dark:bg-background/60 px-4 py-3">
            <Search size={16} className="text-slate-400 dark:text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, Emp ID, email, designation..."
              className="w-full bg-transparent text-xs text-slate-900 dark:text-foreground outline-none placeholder:text-slate-400 dark:placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex overflow-hidden rounded-2xl border border-violet-100 dark:border-border bg-violet-50/40 dark:bg-background/60">
            {["Sales", "Digital Marketing", "All Employees"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDepartmentFilter(filter)}
                className={`whitespace-nowrap px-5 py-3 text-xs font-semibold transition ${
                  departmentFilter === filter
                    ? "bg-violet-200/70 dark:bg-violet-500/30 text-violet-700 dark:text-violet-200"
                    : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[280px] overflow-auto rounded-2xl border border-violet-100 dark:border-border">
          <table className="min-w-[1150px] w-full border-separate border-spacing-0 text-left text-xs">
            <thead>
              <tr className="text-slate-500 dark:text-muted-foreground">
                <th className="sticky top-0 z-20 w-[70px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4"></th>
                <th className="sticky top-0 z-20 min-w-[120px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Emp ID
                </th>
                <th className="sticky top-0 z-20 min-w-[230px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Name
                </th>
                <th className="sticky top-0 z-20 min-w-[200px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Designation
                </th>
                <th className="sticky top-0 z-20 min-w-[190px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Department
                </th>
                <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Email
                </th>
                <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
                  Contact
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => {
                const isSelected = selectedEmployees.some(
                  (item) => item.id === employee.id
                );

                return (
                  <tr key={employee.id} className="hover:bg-violet-50/60 dark:hover:bg-muted/20">
                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                      <button
                        onClick={() => toggleEmployee(employee)}
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                          isSelected
                            ? "border-violet-400 bg-violet-500"
                            : "border-slate-300 dark:border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 size={13} className="text-foreground" />
                        )}
                      </button>
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 font-mono text-slate-500 dark:text-muted-foreground">
                      {employee.empId}
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-foreground">
                          {employee.initials}
                        </div>

                        <span className="whitespace-nowrap font-bold text-slate-900 dark:text-foreground">
                          {employee.name}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                      {employee.designation}
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          employee.department === "Sales"
                            ? "border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                            : "border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-300"
                        }`}
                      >
                        {employee.department}
                      </span>
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                      {employee.email}
                    </td>

                    <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                      {employee.contact}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          disabled={!selectedFile || selectedEmployees.length === 0}
          onClick={onAssign}
          className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assign Selected Employees
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, iconClass, title, subtitle, onClose }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <Icon size={18} className={iconClass} />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="rounded-full p-2 text-slate-400 dark:text-muted-foreground hover:bg-violet-50 dark:hover:bg-muted hover:text-slate-900 dark:hover:text-foreground"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function DuplicateTable({ results }) {
  return (
    <div className="overflow-auto rounded-xl border border-violet-100 dark:border-border">
      <table className="min-w-[1350px] w-full border-separate border-spacing-0 text-left text-xs">
        <thead>
          <tr className="text-slate-500 dark:text-muted-foreground">
            <th className="sticky top-0 z-20 w-[90px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              S.No.
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Name
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Name
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Contact
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Contact
            </th>
            <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Email
            </th>
            <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Email
            </th>
            <th className="sticky top-0 z-20 min-w-[170px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Type
            </th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-violet-50/60 dark:hover:bg-muted/20">
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-500 dark:text-muted-foreground">
                {result.id}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedName}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingName}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedContact}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingContact}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedEmail}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingEmail}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                <span className="inline-flex whitespace-nowrap rounded-full border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-500 dark:text-rose-400">
                  {result.matchType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SyncTable({ results }) {
  return (
    <div className="overflow-auto rounded-xl border border-violet-100 dark:border-border">
      <table className="min-w-[1250px] w-full border-separate border-spacing-0 text-left text-xs">
        <thead>
          <tr className="text-slate-500 dark:text-muted-foreground">
            <th className="sticky top-0 z-20 w-[90px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              S.No.
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Name
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Contact
            </th>
            <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Email
            </th>
            <th className="sticky top-0 z-20 min-w-[140px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Status
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Sync Action
            </th>
            <th className="sticky top-0 z-20 min-w-[380px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Note
            </th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-violet-50/60 dark:hover:bg-muted/20">
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-500 dark:text-muted-foreground">
                {result.id}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.name}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.contact}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.email}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.status}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${
                    result.action === "Skipped Duplicate"
                      ? "border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400"
                      : "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                  }`}
                >
                  {result.action}
                </span>
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompareTable({ results }) {
  return (
    <div className="overflow-auto rounded-xl border border-violet-100 dark:border-border">
      <table className="min-w-[1450px] w-full border-separate border-spacing-0 text-left text-xs">
        <thead>
          <tr className="text-slate-500 dark:text-muted-foreground">
            <th className="sticky top-0 z-20 w-[90px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              S.No.
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Name
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Name
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Contact
            </th>
            <th className="sticky top-0 z-20 min-w-[180px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Contact
            </th>
            <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Imported Email
            </th>
            <th className="sticky top-0 z-20 min-w-[260px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Existing Email
            </th>
            <th className="sticky top-0 z-20 min-w-[280px] whitespace-nowrap border-b border-violet-100 dark:border-border bg-white dark:bg-background px-5 py-4">
              Reason
            </th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-violet-50/60 dark:hover:bg-muted/20">
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-500 dark:text-muted-foreground">
                {result.id}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedName}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingName}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedContact}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingContact}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.importedEmail}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4 text-slate-600 dark:text-muted-foreground">
                {result.existingEmail}
              </td>
              <td className="whitespace-nowrap border-b border-violet-50 dark:border-border/50 px-5 py-4">
                <span className="inline-flex whitespace-nowrap rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  {result.reason}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  const colorClass =
    color === "rose"
      ? "border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400"
      : "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400";

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function WarningBox({ text }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-4">
      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{text}</p>
    </div>
  );
}

function SuccessBox({ text }) {
  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4">
      <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">{text}</p>
    </div>
  );
}

function SmallPopup({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 dark:bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-violet-200 dark:border-primary/30 bg-white dark:bg-background p-6 shadow-2xl shadow-violet-200/60 dark:shadow-primary/20">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-foreground">{title}</h3>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 dark:text-muted-foreground hover:bg-violet-50 dark:hover:bg-muted hover:text-slate-900 dark:hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}