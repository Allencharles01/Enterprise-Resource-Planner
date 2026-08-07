import { Router } from "express";
import { Resend } from "resend";
import EmailLog from "dbms/EmailLog.js";
import Notification from "dbms/Notification.js";
import { env } from "../lib/env.js";

export const emailsRouter = Router();

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const sendEmail = async (to, subject, html, attachments = []) => {
  if (!resend) {
    console.log("Mocking outbound email to:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    if (attachments.length > 0) {
      console.log("Attachments count:", attachments.length);
    }
    return;
  }
  try {
    const payload = {
      from: "NovaNectar ERP <onboarding@resend.dev>",
      to,
      subject,
      html,
    };
    if (attachments && attachments.length > 0) {
      payload.attachments = attachments.map((att) => ({
        filename: att.name || "attachment.file",
        content: att.data || "",
      }));
    }
    await resend.emails.send(payload);
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
  }
};

emailsRouter.get("/", async (req, res) => {
  try {
    const { type, userEmail } = req.query;
    const query = {};
    if (type) {
      query.type = type;
    }
    if (userEmail) {
      const isAdminTerm = /admin|allchar|primecharles3/i.test(userEmail);
      if (isAdminTerm) {
        const adminPattern = "admin|allchar|primecharles3";
        query.$or = [
          { to: { $regex: adminPattern, $options: "i" } },
          { from: { $regex: adminPattern, $options: "i" } },
        ];
      } else {
        query.$or = [
          { to: { $regex: userEmail, $options: "i" } },
          { from: { $regex: userEmail, $options: "i" } },
        ];
      }
    }
    const logs = await EmailLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages/emails" });
  }
});

emailsRouter.post("/send", async (req, res) => {
  try {
    const {
      from,
      to,
      subject,
      body,
      attachments = [],
      type = "email",
      relatedInquiryId = null,
    } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "To, Subject, and Body are required." });
    }

    const senderEmail = from || "NovaNectar ERP <onboarding@resend.dev>";

    // Convert newlines in plain body to HTML paragraphs if needed
    const htmlBody = body.includes("<")
      ? body
      : `<div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">${body.replace(/\n/g, "<br/>")}</div>`;

    if (type === "email") {
      await sendEmail(to, subject, htmlBody, attachments);
    }

    const log = await EmailLog.create({
      type,
      direction: "outbound",
      from: senderEmail,
      to,
      subject,
      body,
      attachments,
      relatedInquiryId,
      isRead: false,
    });

    // Create Notification for the recipient co-worker
    await Notification.create({
      title: `New ${type === "email" ? "Email" : "Message"} from ${senderEmail}`,
      message: `Subject: "${subject}"`,
      category: "message",
      link: "messages",
      isRead: false,
    });

    res.status(201).json(log);
  } catch (error) {
    console.error("Failed to send message/email:", error);
    res.status(500).json({ error: "Failed to send message/email" });
  }
});

emailsRouter.patch("/:id/read", async (req, res) => {
  try {
    const log = await EmailLog.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark email as read" });
  }
});

emailsRouter.patch("/mark-all-read", async (req, res) => {
  try {
    const { type, userEmail } = req.query;
    const query = { isRead: false };
    if (type) query.type = type;
    if (userEmail) {
      query.$or = [
        { to: { $regex: userEmail, $options: "i" } },
        { from: { $regex: userEmail, $options: "i" } },
      ];
    }
    await EmailLog.updateMany(query, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

emailsRouter.delete("/:id", async (req, res) => {
  try {
    await EmailLog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});
