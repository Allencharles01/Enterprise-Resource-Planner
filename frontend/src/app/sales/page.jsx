"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import SalesTabs from "@/components/sales/SalesTabs";
import StatsCards from "@/components/sales/StatsCards";
import ProjectsTable from "@/components/sales/ProjectsTable";
import ProjectDetailDashboard from "@/components/sales/ProjectDetailDashboard";

import InternshipDashboard from "@/components/sales/internships/InternshipDashboard";
import TrainingDashboard from "@/components/sales/training/TrainingDashboard";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("Client Projects");
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <DashboardLayout>
      {selectedProject ? (
        <ProjectDetailDashboard
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <div className="px-6 py-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Sales Dashboard
            </h1>

            <p className="text-muted-foreground mt-2">
              Monitor projects, revenue, and sales performance.
            </p>
          </div>

          <SalesTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === "Client Projects" && (
            <>
              <StatsCards />
              <ProjectsTable onViewProject={setSelectedProject} />
            </>
          )}

          {activeTab === "Internships" && (
            <InternshipDashboard />
          )}

          {activeTab === "Training" && (
            <TrainingDashboard />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}