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
    const { type } = req.query; // "email" or "message" or all
    const query = type ? { type } : {};
    const logs = await EmailLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages/emails" });
  }
});

emailsRouter.post("/send", async (req, res) => {
  try {
    const {
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
      to,
      subject,
      body,
      attachments,
      relatedInquiryId,
      isRead: true,
    });

    await Notification.create({
      title: `Outbound ${type === "email" ? "Email" : "Message"} Sent`,
      message: `Correspondence sent to ${to}: "${subject}"`,
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

emailsRouter.delete("/:id", async (req, res) => {
  try {
    await EmailLog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});
