import { Router } from "express";
import { Resend } from "resend";
import CustomerInquiry from "dbms/CustomerInquiry.js";
import EmailLog from "dbms/EmailLog.js";
import Notification from "dbms/Notification.js";
import { env } from "../lib/env.js";
import { formatAmount } from "../lib/formatAmount.js";

export const customerInquiriesRouter = Router();

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

customerInquiriesRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      phoneCountryCode = "+1",
      phoneNumber,
      email,
      altPhoneCountryCode = "+1",
      altPhoneNumber = "",
      altEmail = "",
      projectName,
      projectDetails = "",
      budgetRange = "",
      currency = "USD ($)",
      deadline = "",
      fileName = "",
      fileData = "",
    } = req.body;

    if (!name || !phoneNumber || !email || !projectName) {
      return res.status(400).json({ error: "Missing required fields (Name, Phone Number, Email ID, Project Name)" });
    }

    const formattedBudgetRange = formatAmount(budgetRange);

    const newInquiry = await CustomerInquiry.create({
      name,
      phoneCountryCode,
      phoneNumber,
      email,
      altPhoneCountryCode,
      altPhoneNumber,
      altEmail,
      projectName,
      projectDetails,
      budgetRange: formattedBudgetRange,
      currency,
      deadline,
      fileName,
      fileData,
    });

    const htmlMsg = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <p style="font-size: 16px;">Hello, <strong>${name}</strong>,</p>
        <p style="font-size: 15px;">Thank you for submitting your request to NovaNectar Services.</p>
        
        <h3 style="color: #4f46e5; margin-top: 24px; margin-bottom: 12px;">Your Form Details</h3>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;">Full Name</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone Number</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${phoneCountryCode} ${phoneNumber}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email Address</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email}</td>
            </tr>
            ${altPhoneNumber ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Alternate Phone</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${altPhoneCountryCode} ${altPhoneNumber}</td>
            </tr>` : ""}
            ${altEmail ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Alternate Email</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${altEmail}</td>
            </tr>` : ""}
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Project Name</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4f46e5;">${projectName}</td>
            </tr>
            ${projectDetails ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Project Details</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${projectDetails}</td>
            </tr>` : ""}
            ${budgetRange ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Budget Range</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${formattedBudgetRange} (${currency})</td>
            </tr>` : ""}
            ${deadline ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Deadline</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${deadline}</td>
            </tr>` : ""}
            ${fileName ? `
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Attached File</th>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${fileName}</td>
            </tr>` : ""}
          </table>
        </div>

        <p style="font-size: 15px;">We have successfully received your submission. A supervisor is currently being assigned to your project and will contact you using the phone number or email address you provided.</p>
        <p style="font-size: 15px;">Please allow 24–48 hours for us to review your request and get in touch.</p>
        <p style="font-size: 15px;">Thank you for choosing NovaNectar Services. We appreciate your patience and look forward to assisting you.</p>
        
        <p style="font-size: 15px; margin-top: 24px;">Best regards,<br/><strong>The NovaNectar Services Team</strong></p>
      </div>
    `;

    await sendEmail(
      email,
      `Inquiry Received: ${projectName} - NovaNectar Services`,
      htmlMsg,
    );

    // Also log in EmailLog
    await EmailLog.create({
      type: "email",
      direction: "outbound",
      to: email,
      subject: `Inquiry Received: ${projectName} - NovaNectar Services`,
      body: htmlMsg,
      relatedInquiryId: newInquiry._id,
      isRead: true,
    });

    await Notification.create({
      title: `New Customer Inquiry: ${projectName}`,
      message: `${name} (${email}) submitted an inquiry with budget ${formattedBudgetRange || "Flexible"}.`,
      category: "inquiry",
      link: "inquiries",
      isRead: false,
    });

    res.status(201).json(newInquiry);
  } catch (error) {
    console.error("Failed to create customer inquiry:", error);
    res.status(500).json({ error: "Failed to create customer inquiry" });
  }
});

customerInquiriesRouter.get("/", async (_req, res) => {
  try {
    const inquiries = await CustomerInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer inquiries" });
  }
});

customerInquiriesRouter.delete("/:id", async (req, res) => {
  try {
    await CustomerInquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer inquiry" });
  }
});

customerInquiriesRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await CustomerInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

customerInquiriesRouter.patch("/:id/read", async (req, res) => {
  try {
    const inquiry = await CustomerInquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.json(inquiry || { success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark inquiry read" });
  }
});

