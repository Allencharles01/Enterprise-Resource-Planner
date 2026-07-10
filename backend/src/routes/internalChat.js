import { Router } from "express";
import InternalChat from "dbms/InternalChat.js";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const internalChatRouter = Router();

// GET /users - Return searchable list of users (Admin + Employees)
internalChatRouter.get("/users", requireAuth, async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    const users = await UserModel.find();

    const result = [];

    // Add Admin entry
    const adminUser = users.find((u) => u.role === "admin");
    if (adminUser) {
      result.push({
        id: adminUser._id.toString(),
        name: adminUser.name || "System Admin",
        empCode: "ADMIN",
        loginId: adminUser.email,
        role: "admin",
        designation: "Administrator",
      });
    } else {
      result.push({
        id: "ADMIN_ID",
        name: "System Admin",
        empCode: "ADMIN",
        loginId: "admin@novanectar.co.in",
        role: "admin",
        designation: "Administrator",
      });
    }

    // Add Employees
    for (const emp of employees) {
      const u = users.find((user) => user._id.toString() === emp.userId?.toString());
      const fullName = `${emp.personal?.firstName || ""} ${emp.personal?.lastName !== "Emp" ? emp.personal?.lastName || "" : ""}`.trim() || emp.employeeCode;
      result.push({
        id: emp.userId?.toString() || emp._id.toString(),
        employeeId: emp._id.toString(),
        name: fullName,
        empCode: emp.employeeCode || `EMP-${emp.employeeNumber || ""}`,
        loginId: u?.email || emp.work?.companyEmail || emp.personal?.contactEmail || "",
        role: "employee",
        designation: emp.work?.designation || "Employee",
        department: emp.work?.department || "",
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to fetch chat users:", error);
    res.status(500).json({ error: "Failed to fetch chat users" });
  }
});

// GET /conversation - Fetch conversation between two user IDs or codes
internalChatRouter.get("/conversation", requireAuth, async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: "user1 and user2 are required" });
    }

    const u1IsAdmin = user1 === "ADMIN_ID" || user1 === "ADMIN";
    const u2IsAdmin = user2 === "ADMIN_ID" || user2 === "ADMIN";

    const queryOr = [
      { senderId: user1, recipientId: user2 },
      { senderId: user2, recipientId: user1 },
      { senderCode: user1, recipientCode: user2 },
      { senderCode: user2, recipientCode: user1 },
    ];

    if (u1IsAdmin) {
      queryOr.push({ senderRole: "admin", recipientId: user2 });
      queryOr.push({ senderId: user2, recipientRole: "admin" });
      queryOr.push({ senderRole: "admin", recipientCode: user2 });
      queryOr.push({ senderCode: user2, recipientRole: "admin" });
    }
    if (u2IsAdmin) {
      queryOr.push({ senderRole: "admin", recipientId: user1 });
      queryOr.push({ senderId: user1, recipientRole: "admin" });
      queryOr.push({ senderRole: "admin", recipientCode: user1 });
      queryOr.push({ senderCode: user1, recipientRole: "admin" });
    }

    const messages = await InternalChat.find({ $or: queryOr }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// GET /unread - Get unread count and unread messages for a recipientId or code
internalChatRouter.get("/unread", requireAuth, async (req, res) => {
  try {
    const { userId, code, role } = req.query;
    if (!userId && !code && !role) {
      return res.status(400).json({ error: "userId, code, or role required" });
    }

    const query = {
      isRead: false,
      $or: [],
    };
    if (userId) query.$or.push({ recipientId: userId });
    if (code) query.$or.push({ recipientCode: code });
    if (code === "ADMIN" || userId === "ADMIN_ID" || role === "admin") {
      query.$or.push({ recipientRole: "admin" });
      query.$or.push({ recipientCode: "ADMIN" });
      query.$or.push({ recipientId: "ADMIN_ID" });
      const adminUsers = await UserModel.find({ role: "admin" }).catch(() => []);
      for (const au of adminUsers) {
        query.$or.push({ recipientId: au._id.toString() });
      }
    }

    const unreadMessages = await InternalChat.find(query).sort({ createdAt: -1 });
    res.json({
      unreadCount: unreadMessages.length,
      messages: unreadMessages,
    });
  } catch (error) {
    console.error("Failed to fetch unread messages:", error);
    res.status(500).json({ error: "Failed to fetch unread messages" });
  }
});

// GET /conversations-list - Get list of unique partners (people texted) with their last message
internalChatRouter.get("/conversations-list", requireAuth, async (req, res) => {
  try {
    const { userId, code, role } = req.query;
    if (!userId && !code) {
      return res.status(400).json({ error: "userId or code required" });
    }

    const isAdmin = role === "admin" || userId === "ADMIN_ID" || code === "ADMIN";

    const queryOr = [];
    if (userId) {
      queryOr.push({ senderId: userId });
      queryOr.push({ recipientId: userId });
    }
    if (code) {
      queryOr.push({ senderCode: code });
      queryOr.push({ recipientCode: code });
    }
    if (isAdmin) {
      queryOr.push({ senderRole: "admin" });
      queryOr.push({ recipientRole: "admin" });
      queryOr.push({ senderId: "ADMIN_ID" });
      queryOr.push({ recipientId: "ADMIN_ID" });
      queryOr.push({ senderCode: "ADMIN" });
      queryOr.push({ recipientCode: "ADMIN" });
    }

    const allMessages = await InternalChat.find({ $or: queryOr }).sort({ createdAt: -1 });

    const partnersMap = new Map();

    for (const msg of allMessages) {
      const isOutbound =
        msg.senderId === userId ||
        msg.senderCode === code ||
        (isAdmin && (msg.senderRole === "admin" || msg.senderId === "ADMIN_ID" || msg.senderCode === "ADMIN"));

      const partnerId = isOutbound ? msg.recipientId : msg.senderId;
      const partnerCode = isOutbound ? msg.recipientCode : msg.senderCode;
      const partnerName = isOutbound ? msg.recipientName : msg.senderName;
      const partnerRole = isOutbound ? msg.recipientRole : msg.senderRole;

      const key = partnerId || partnerCode || partnerName;
      if (!key) continue;

      if (!partnersMap.has(key)) {
        partnersMap.set(key, {
          _id: key,
          partnerId: partnerId || "",
          partnerCode: partnerCode || "",
          partnerName: partnerName || "Unknown User",
          partnerRole: partnerRole || "employee",
          subject: msg.message,
          body: msg.message,
          createdAt: msg.createdAt,
          direction: isOutbound ? "outbound" : "inbound",
          isChatConversation: true,
          to: isOutbound ? (partnerName || partnerCode) : (senderNameOrSelf(userId, code)),
          from: isOutbound ? (senderNameOrSelf(userId, code)) : (partnerName || partnerCode),
          rawPartner: {
            id: partnerId || key,
            empCode: partnerCode || "",
            name: partnerName || "Unknown User",
            role: partnerRole || "employee",
          },
          unreadCount: 0,
        });
      }

      const entry = partnersMap.get(key);
      if (!isOutbound && !msg.isRead) {
        entry.unreadCount = (entry.unreadCount || 0) + 1;
      }
    }

    function senderNameOrSelf(uId, uCode) {
      if (isAdmin) return "System Admin";
      return uCode || "You";
    }

    const conversations = Array.from(partnersMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(conversations);
  } catch (error) {
    console.error("Failed to fetch conversations list:", error);
    res.status(500).json({ error: "Failed to fetch conversations list" });
  }
});

// POST /send - Send a chat message
internalChatRouter.post("/send", requireAuth, async (req, res) => {
  try {
    const {
      senderId,
      senderName,
      senderCode = "",
      senderRole = "employee",
      recipientId,
      recipientName,
      recipientCode = "",
      recipientRole,
      message,
    } = req.body;

    if (!senderId || !recipientId || !message) {
      return res.status(400).json({ error: "senderId, recipientId, and message are required" });
    }

    let finalRecipientRole = recipientRole;
    if (!finalRecipientRole) {
      if (recipientCode === "ADMIN" || recipientId === "ADMIN_ID") {
        finalRecipientRole = "admin";
      } else {
        const u = await UserModel.findById(recipientId).catch(() => null);
        if (u && u.role === "admin") finalRecipientRole = "admin";
        else finalRecipientRole = "employee";
      }
    }

    const newMsg = await InternalChat.create({
      senderId,
      senderName,
      senderCode,
      senderRole,
      recipientId,
      recipientName,
      recipientCode,
      recipientRole: finalRecipientRole,
      message,
      isRead: false,
    });

    res.status(201).json(newMsg);
  } catch (error) {
    console.error("Failed to send chat message:", error);
    res.status(500).json({ error: "Failed to send chat message" });
  }
});

// PATCH /read - Mark messages read between sender and recipient
internalChatRouter.patch("/read", requireAuth, async (req, res) => {
  try {
    const { senderId, recipientId, senderCode, recipientCode } = req.body;
    if ((!senderId && !senderCode) || (!recipientId && !recipientCode)) {
      return res.status(400).json({ error: "Sender and Recipient identifiers required" });
    }

    const query = {
      isRead: false,
      $or: [
        { senderId, recipientId },
        { senderCode, recipientCode },
      ],
    };

    await InternalChat.updateMany(query, { $set: { isRead: true } });
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to mark chat as read:", error);
    res.status(500).json({ error: "Failed to mark chat as read" });
  }
});
