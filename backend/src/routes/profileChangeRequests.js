import { Router } from "express";
import ProfileChangeRequest from "dbms/ProfileChangeRequest.js";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import Notification from "dbms/Notification.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const profileChangeRequestsRouter = Router();

// POST / - Create a new profile change request from an employee
profileChangeRequestsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const {
      employeeId,
      employeeCode,
      currentData,
      requestedData,
      requestedChanges,
      reason,
    } = req.body;

    const name = req.body.name || currentData?.name || "Employee";
    const email = req.body.email || currentData?.email || "employee@company.com";

    if (!employeeId || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const reqData = requestedData || requestedChanges || {};
    const reqReason = reason || requestedChanges?.reason || "";

    const newReq = await ProfileChangeRequest.create({
      employeeId,
      employeeCode: employeeCode || "",
      name,
      email,
      currentData: currentData || {},
      requestedData: reqData,
      status: "pending",
      isRead: false,
      reason: reqReason,
    });

    // Create a notification for the admin
    await Notification.create({
      title: `Profile Change Request: ${name}`,
      message: `${name} (${employeeCode || employeeId}) requested updates to their employee profile details.`,
      category: "account",
      link: "requests",
      isRead: false,
    });

    res.status(201).json(newReq);
  } catch (error) {
    console.error("Failed to create profile change request:", error);
    res.status(500).json({ error: "Failed to create profile change request" });
  }
});

// GET / - List all profile change requests (pending or all)
profileChangeRequestsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const query = status === "all" ? {} : { status };
    const requests = await ProfileChangeRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Failed to fetch profile change requests:", error);
    res.status(500).json({ error: "Failed to fetch profile change requests" });
  }
});

// PATCH /:id/read - Mark request as read
profileChangeRequestsRouter.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const reqItem = await ProfileChangeRequest.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(reqItem || { success: true });
  } catch (error) {
    console.error("Failed to mark request as read:", error);
    res.status(500).json({ error: "Failed to mark request as read" });
  }
});

// POST /:id/approve - Approve change request & update EmployeeModel/UserModel
profileChangeRequestsRouter.post("/:id/approve", requireAuth, async (req, res) => {
  try {
    const changeReq = await ProfileChangeRequest.findById(req.params.id);
    if (!changeReq || changeReq.status !== "pending") {
      return res.status(400).json({ error: "Invalid or non-pending request" });
    }

    const { requestedData } = changeReq;

    // Find the actual employee record by employeeCode or _id or userId
    let employee = null;
    if (changeReq.employeeCode) {
      employee = await EmployeeModel.findOne({ employeeCode: changeReq.employeeCode });
    }
    if (!employee && changeReq.employeeId) {
      if (changeReq.employeeId.match(/^[0-9a-fA-F]{24}$/)) {
        employee = await EmployeeModel.findById(changeReq.employeeId);
        if (!employee) {
          employee = await EmployeeModel.findOne({ userId: changeReq.employeeId });
        }
      } else {
        employee = await EmployeeModel.findOne({ employeeCode: changeReq.employeeId });
      }
    }

    if (employee) {
      if (requestedData.firstName !== undefined) employee.personal.firstName = requestedData.firstName;
      if (requestedData.lastName !== undefined) employee.personal.lastName = requestedData.lastName;
      if (requestedData.contactEmail !== undefined) employee.personal.contactEmail = requestedData.contactEmail;
      if (requestedData.companyEmail !== undefined) employee.work.companyEmail = requestedData.companyEmail;
      if (requestedData.manager !== undefined) employee.work.manager = requestedData.manager;
      if (requestedData.designation !== undefined) employee.work.designation = requestedData.designation;
      if (requestedData.department !== undefined) employee.work.department = requestedData.department;
      if (requestedData.employeeCode !== undefined && requestedData.employeeCode) {
        employee.employeeCode = requestedData.employeeCode;
      }
      await employee.save();

      // If there is an associated UserModel, update name and email if needed
      if (employee.userId) {
        const user = await UserModel.findById(employee.userId);
        if (user) {
          if (requestedData.firstName || requestedData.lastName) {
            user.name = `${requestedData.firstName || employee.personal.firstName} ${requestedData.lastName !== "Emp" ? requestedData.lastName || employee.personal.lastName : ""}`.trim();
          }
          if (requestedData.companyEmail || requestedData.contactEmail) {
            user.email = (requestedData.companyEmail || requestedData.contactEmail || user.email).toLowerCase();
          }
          await user.save();
        }
      }
    }

    changeReq.status = "approved";
    changeReq.isRead = true;
    if (req.body.adminRemarks !== undefined) {
      changeReq.adminRemarks = req.body.adminRemarks;
    }
    await changeReq.save();

    res.json({ success: true, employee, changeReq });
  } catch (error) {
    console.error("Failed to approve profile change request:", error);
    res.status(500).json({ error: error.message || "Failed to approve request" });
  }
});

// POST /:id/reject - Reject change request
profileChangeRequestsRouter.post("/:id/reject", requireAuth, async (req, res) => {
  try {
    const changeReq = await ProfileChangeRequest.findById(req.params.id);
    if (!changeReq || changeReq.status !== "pending") {
      return res.status(400).json({ error: "Invalid or non-pending request" });
    }

    changeReq.status = "rejected";
    changeReq.isRead = true;
    if (req.body.adminRemarks !== undefined) {
      changeReq.adminRemarks = req.body.adminRemarks;
    }
    await changeReq.save();

    res.json({ success: true, changeReq });
  } catch (error) {
    console.error("Failed to reject profile change request:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
});
