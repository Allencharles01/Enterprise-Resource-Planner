import { Router } from "express";
import { authRouter } from "./auth.js";
import { orgRouter } from "./org.js";
import { employeesRouter } from "./employees.js";
import { accountRequestsRouter } from "./accountRequests.js";
import { adminsRouter } from "./admins.js";
import { createStubRouter } from "./stub.js";
import { projectsRouter } from "./projects.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/orgs", orgRouter);
apiRouter.use("/employees", employeesRouter);
apiRouter.use("/accountRequests", accountRequestsRouter);
apiRouter.use("/admins", adminsRouter);

// Stubs for remaining ERP modules (implemented incrementally)
apiRouter.use("/attendance", createStubRouter("attendance"));
apiRouter.use("/leave", createStubRouter("leave"));
apiRouter.use("/payroll", createStubRouter("payroll"));
apiRouter.use("/tasks", createStubRouter("tasks"));

// In the routes section, replace the project stub with the actual router
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/timesheets", createStubRouter("timesheets"));
apiRouter.use("/productivity", createStubRouter("productivity"));
apiRouter.use("/performance", createStubRouter("performance"));
apiRouter.use("/recruitment", createStubRouter("recruitment"));
apiRouter.use("/communication", createStubRouter("communication"));
apiRouter.use("/reports", createStubRouter("reports"));
apiRouter.use("/compliance", createStubRouter("compliance"));
