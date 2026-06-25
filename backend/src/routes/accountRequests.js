import { Router } from "express";
import { Resend } from "resend";
import AccountRequest from "dbms/AccountRequest.js";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import { env } from "../lib/env.js";
import { requireAuth } from "../middleware/requireAuth.js";
import bcrypt from "bcryptjs";

export const accountRequestsRouter = Router();

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const sendEmail = async (to, subject, html) => {
  if (!resend) {
    console.log("Mocking email to", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    return;
  }
  try {
    await resend.emails.send({
      from: "NovaNectar ERP <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

accountRequestsRouter.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingReq = await AccountRequest.findOne({ email });
    if (existingReq) {
      return res
        .status(400)
        .json({ error: "Request already submitted for this email" });
    }

    const newRequest = await AccountRequest.create({ name, email });
    const htmlMsg = `
      <p>Hey ${name},</p>
      <p>We have received your request to create an account with NovaNectar ERP Services. The account creation process may take up to 24 hours.</p>
      <p>Please keep an eye out for the Account Activation email, which will be sent to your registered email address (${email}) and will contain further instructions.</p>
    `;

    await sendEmail(
      email,
      "NovaNectar ERP - Account Request Received",
      htmlMsg,
    );

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create account request" });
  }
});

accountRequestsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const requests = await AccountRequest.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

accountRequestsRouter.post("/:id/approve", requireAuth, async (req, res) => {
  try {
    const request = await AccountRequest.findById(req.params.id);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ error: "Invalid or non-pending request" });
    }

    const {
      firstName,
      lastName,
      employeeCode,
      department,
      designation,
      password,
    } = req.body;

    const orgId = req.auth?.orgId;
    if (!orgId) return res.status(401).json({ error: "Unauthorized" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      orgId,
      name: `${firstName} ${lastName}`.trim(),
      email: request.email.toLowerCase(),
      passwordHash,
      role: "employee",
      isActive: true,
    });

    const employee = await EmployeeModel.create({
      orgId,
      userId: user._id,
      employeeCode,
      personal: {
        firstName,
        lastName,
      },
      work: {
        department,
        designation,
        status: "active",
      },
    });

    request.status = "approved";
    await request.save();

    const htmlMsg = `
      <p>Hey ${request.name},</p>
      <p>Thank you for applying for NovaNectar ERP Services.</p>
      <p>We are pleased to inform you that your account request has been approved and your account has been successfully created.</p>
      <p>Please find your login credentials below:</p>
      <p>Candidate Email Address: ${request.email}</p>
      <p>Candidate Temporary Password: ${password}</p>
      <p>You can now log in to the NovaNectar ERP Services portal using the credentials above.</p>
      <p>Important: For security purposes, please change your password immediately after your first login.</p>
      <p>If you experience any issues accessing your account, please contact the system administrator for assistance.</p>
      <p>We look forward to having you onboard.</p>
      <p>Best Regards,</p>
      <p>NovaNectar ERP Services Team</p>
    `;

    await sendEmail(
      request.email,
      "NovaNectar ERP - Account Approved",
      htmlMsg,
    );

    res.status(200).json({ employee, user });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to approve request" });
  }
});

accountRequestsRouter.post("/:id/reject", requireAuth, async (req, res) => {
  try {
    const request = await AccountRequest.findById(req.params.id);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ error: "Invalid or non-pending request" });
    }

    request.status = "rejected";
    await request.save();

    const htmlMsg = `
      <p>Hey ${request.name},</p>
      <p>Thank you for your interest in NovaNectar ERP Services and for submitting a request to create an account with us.</p>
      <p>After reviewing your application, we regret to inform you that your account creation request has not been approved at this time.</p>
      <p>As a result, an account will not be created for the email address associated with your request.</p>
      <p>If you believe this decision was made in error or if you require additional information, please contact the system administrator or the appropriate department for assistance.</p>
      <p>We appreciate your interest in NovaNectar ERP Services and thank you for your understanding.</p>
      <p>Best Regards,</p>
      <p>NovaNectar ERP Services Team</p>
    `;

    await sendEmail(
      request.email,
      "NovaNectar ERP - Account Request Update",
      htmlMsg,
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject request" });
  }
});
