import { Router } from "express";
import Notification from "dbms/Notification.js";
import CustomerInquiry from "dbms/CustomerInquiry.js";
import AccountRequest from "dbms/AccountRequest.js";
import ProfileChangeRequest from "dbms/ProfileChangeRequest.js";

export const notificationsRouter = Router();

let hasSeeded = false;

// GET /api/notifications -> fetch all notifications and unread count
notificationsRouter.get("/", async (req, res) => {
  try {
    if (!hasSeeded) {
      hasSeeded = true;
      const count = await Notification.countDocuments();
      if (count === 0) {
        await Notification.insertMany([
          {
            title: "New Customer Inquiry: Michael Scott",
            message: "Michael Scott requested pricing and feature details for the Enterprise Cloud ERP package.",
            category: "inquiry",
            link: "inquiries",
            isRead: false,
            createdAt: new Date(Date.now() - 1800000),
          },
          {
            title: "Account Request: Sarah Connor",
            message: "Sarah Connor (sarah.c@cyberdyne.com) submitted an employee account registration request for the Digital Marketing team.",
            category: "account",
            link: "accounts",
            isRead: false,
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            title: "Profile Change Request: Kelly Wright",
            message: "Kelly Wright requested a last name update in the employee directory to Kelly O'Brian.",
            category: "account",
            link: "profile-requests",
            isRead: false,
            createdAt: new Date(Date.now() - 7200000),
          },
          {
            title: "System Security Alert",
            message: "Automated nightly database backup completed successfully. All storage replicas are verified and in sync.",
            category: "alert",
            link: "",
            isRead: false,
            createdAt: new Date(Date.now() - 14400000),
          },
          {
            title: "Digital Marketing Activity",
            message: "Campaign Manager published 3 new dynamic social media ad campaigns across Google & Meta advertising networks.",
            category: "system",
            link: "",
            isRead: false,
            createdAt: new Date(Date.now() - 21600000),
          },
        ]);
      }
    }

    try {
      const [inquiries, accountReqs, profileReqs] = await Promise.all([
        CustomerInquiry.find({ isRead: false }).limit(10),
        AccountRequest.find({ status: "pending", isRead: { $ne: true } }).limit(10),
        ProfileChangeRequest.find({ status: "pending", isRead: { $ne: true } }).limit(10),
      ]);

      for (const inq of inquiries) {
        const exists = await Notification.findOne({ "metadata.refId": String(inq._id) });
        if (!exists) {
          await Notification.create({
            title: `Customer Inquiry: ${inq.name || "Client"}`,
            message: `${inq.name || "Client"} inquired about ${inq.service || "services"}: "${(inq.message || "").slice(0, 80)}..."`,
            category: "inquiry",
            link: "inquiries",
            isRead: false,
            metadata: { refId: String(inq._id), refType: "CustomerInquiry" },
            createdAt: inq.createdAt || new Date(),
          });
        }
      }

      for (const acc of accountReqs) {
        const exists = await Notification.findOne({ "metadata.refId": String(acc._id) });
        if (!exists) {
          await Notification.create({
            title: `New Account Request: ${acc.name || "Employee"}`,
            message: `${acc.name || "Employee"} (${acc.email || ""}) submitted an account registration request.`,
            category: "account",
            link: "accounts",
            isRead: false,
            metadata: { refId: String(acc._id), refType: "AccountRequest" },
            createdAt: acc.createdAt || new Date(),
          });
        }
      }

      for (const prof of profileReqs) {
        const exists = await Notification.findOne({ "metadata.refId": String(prof._id) });
        if (!exists) {
          await Notification.create({
            title: `Profile Request: ${prof.name || "Employee"}`,
            message: `${prof.name || "Employee"} requested profile modification.`,
            category: "account",
            link: "profile-requests",
            isRead: false,
            metadata: { refId: String(prof._id), refType: "ProfileChangeRequest" },
            createdAt: prof.createdAt || new Date(),
          });
        }
      }
    } catch (e) {
      console.error("Dynamic notification sync failed:", e);
    }

    const { employeeCode, employeeName } = req.query;
    let query = {};
    if (employeeCode) {
      query = {
        $or: [
          { "metadata.employeeCode": employeeCode },
          { "metadata.employeeName": employeeName },
          { "metadata.assignedTo": employeeCode }
        ]
      };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST /api/notifications -> create a notification
notificationsRouter.post("/", async (req, res) => {
  try {
    const { title, message, category = "system", link = "", metadata = {} } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }
    const newNotif = await Notification.create({
      title,
      message,
      category,
      link,
      metadata,
      isRead: false,
    });
    res.status(201).json(newNotif);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// PATCH /api/notifications/read-all -> mark all as read
notificationsRouter.patch("/read-all", async (req, res) => {
  try {
    const { employeeCode, employeeName } = req.query;
    let query = { isRead: false };
    if (employeeCode) {
      query = {
        isRead: false,
        $or: [
          { "metadata.employeeCode": employeeCode },
          { "metadata.employeeName": employeeName },
          { "metadata.assignedTo": employeeCode }
        ]
      };
    }
    await Notification.updateMany(query, { isRead: true });
    
    if (!employeeCode) {
      await CustomerInquiry.updateMany({ isRead: false }, { isRead: true }).catch(() => {});
      await AccountRequest.updateMany({ status: "pending", isRead: { $ne: true } }, { isRead: true }).catch(() => {});
      await ProfileChangeRequest.updateMany({ status: "pending", isRead: { $ne: true } }, { isRead: true }).catch(() => {});
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// PATCH /api/notifications/:id/read -> mark a single notification as read
notificationsRouter.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (updated?.metadata?.refId && updated?.metadata?.refType) {
      if (updated.metadata.refType === "CustomerInquiry") {
        await CustomerInquiry.findByIdAndUpdate(updated.metadata.refId, { isRead: true }).catch(() => {});
      } else if (updated.metadata.refType === "AccountRequest") {
        await AccountRequest.findByIdAndUpdate(updated.metadata.refId, { isRead: true }).catch(() => {});
      } else if (updated.metadata.refType === "ProfileChangeRequest") {
        await ProfileChangeRequest.findByIdAndUpdate(updated.metadata.refId, { isRead: true }).catch(() => {});
      }
    }
    res.json(updated);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// DELETE /api/notifications/:id -> delete a specific notification
notificationsRouter.delete("/:id", async (req, res) => {
  try {
    const notif = await Notification.findByIdAndDelete(req.params.id);
    if (notif?.metadata?.refId && notif?.metadata?.refType) {
      if (notif.metadata.refType === "CustomerInquiry") {
        await CustomerInquiry.findByIdAndUpdate(notif.metadata.refId, { isRead: true }).catch(() => {});
      } else if (notif.metadata.refType === "AccountRequest") {
        await AccountRequest.findByIdAndUpdate(notif.metadata.refId, { isRead: true }).catch(() => {});
      } else if (notif.metadata.refType === "ProfileChangeRequest") {
        await ProfileChangeRequest.findByIdAndUpdate(notif.metadata.refId, { isRead: true }).catch(() => {});
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// DELETE /api/notifications -> clear all notifications
notificationsRouter.delete("/", async (req, res) => {
  try {
    const { employeeCode, employeeName } = req.query;
    let query = {};
    if (employeeCode) {
      query = {
        $or: [
          { "metadata.employeeCode": employeeCode },
          { "metadata.employeeName": employeeName },
          { "metadata.assignedTo": employeeCode }
        ]
      };
    }
    await Notification.deleteMany(query);
    
    if (!employeeCode) {
      await CustomerInquiry.updateMany({ isRead: false }, { isRead: true }).catch(() => {});
      await AccountRequest.updateMany({ status: "pending", isRead: { $ne: true } }, { isRead: true }).catch(() => {});
      await ProfileChangeRequest.updateMany({ status: "pending", isRead: { $ne: true } }, { isRead: true }).catch(() => {});
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});
