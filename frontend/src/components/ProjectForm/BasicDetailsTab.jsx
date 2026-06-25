import { EmployeeSelect } from "@/components/EmployeeSelect";
import { FileText, Building2, Calendar } from "lucide-react";

export function BasicDetailsTab({ data, onChange, onEmployeeClick }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Basic Details
        </h2>
        <p className="text-muted-foreground">
          Enter the core information for the new project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            Project Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="e.g., Enterprise Resource Planner"
            value={data.projectTitle}
            onChange={(e) =>
              onChange({ ...data, projectTitle: e.target.value })
            }
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Client Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="e.g., NovaNectar Private Limited"
            value={data.clientName}
            onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Overall Deadline
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            value={data.deadline}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
            </div>
            Project Lead (Incharge)
          </label>
          <EmployeeSelect
            value={data.projectLead}
            onChange={(emp) => onChange({ ...data, projectLead: emp })}
            onEmployeeClick={onEmployeeClick}
            placeholder="Assign Project Lead..."
          />
        </div>
      </div>
    </div>
  );
}
