"use client";

import { useState, useEffect } from "react";
import { UserRound, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import InternProfileModal from "./InternProfileModal";

export default function InternshipTable() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedIntern, setSelectedIntern] = useState(null);

  useEffect(() => {
    api.get("/api/internships/candidates")
      .then((res) => {
        const list = (res.data || []).map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          program: item.courseName,
          department: item.education || "Engineering",
          duration: item.duration || "3 months",
          mentor: item.salesAgent || "Allen Charles",
          progress: item.progress || 0,
          placement: item.status === "Completed" ? "Placed" : "Under Review",
          status: item.status || "Active",
          ...item
        }));
        setInterns(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredInterns = interns.filter((intern) => {
    if (filter === "All") return true;
    if (filter === "Active") return intern.status === "Active";
    if (filter === "Dropped") return intern.status === "Dropped Out";
    return true;
  });

  const activeCount = interns.filter(
    (i) => i.status === "Active"
  ).length;

  const droppedCount = interns.filter(
    (i) => i.status === "Dropped Out"
  ).length;

  return (
    <>
      <div className="glass-card rounded-2xl border border-border p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Intern Details
            </h2>

            <p className="text-muted-foreground mt-2">
              View candidate profiles and track progress
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              All Interns ({interns.length})
            </button>

            <button
              onClick={() => setFilter("Active")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "Active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Active Interns ({activeCount})
            </button>

            <button
              onClick={() => setFilter("Dropped")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "Dropped"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Dropped Out ({droppedCount})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4">Name</th>
                <th className="text-left py-4">Program</th>
                <th className="text-left py-4">Department</th>
                <th className="text-left py-4">Duration</th>
                <th className="text-left py-4">Mentor</th>
                <th className="text-left py-4">Progress</th>
                <th className="text-left py-4">Placement</th>
                <th className="text-left py-4">Status</th>
                <th className="text-left py-4">Profile</th>
              </tr>
            </thead>

            <tbody>
              {filteredInterns.map((intern) => (
                <tr
                  key={intern.id}
                  className="border-b border-border/50"
                >
                  {/* Name */}
                  <td className="py-4">
                    <div className="font-semibold text-foreground">
                      {intern.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {intern.email}
                    </div>
                  </td>

                  <td>{intern.program}</td>

                  <td>{intern.department}</td>

                  <td>{intern.duration}</td>

                  <td>{intern.mentor}</td>

                  {/* Progress */}
                  <td className="w-[220px]">
                    <div className="text-sm font-medium mb-1">
                      {intern.progress}%
                    </div>

                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${intern.progress}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Placement */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        intern.placement === "Shortlisted"
                          ? "bg-blue-500/10 text-blue-500"
                          : intern.placement === "Under Review"
                          ? "bg-amber-500/10 text-amber-500"
                          : intern.placement === "Placed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {intern.placement}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        intern.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : intern.status === "Completed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {intern.status}
                    </span>
                  </td>

                  {/* Profile */}
                  <td>
                    <button
                      onClick={() => setSelectedIntern(intern)}
                      className="
                        flex items-center gap-2
                        px-4 py-2
                        border border-border
                        rounded-xl
                        hover:bg-muted/50
                        transition
                      "
                    >
                      <UserRound size={16} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIntern && (
        <InternProfileModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
        />
      )}
    </>
  );
}