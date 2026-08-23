import { Router } from "express";
import Ticket from "dbms/Ticket.js";
import Notification from "dbms/Notification.js";

export const ticketsRouter = Router();

// Helper to generate Ticket ID
function generateTicketId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TKT-${randomNum}`;
}

// POST /api/tickets - Create a new ticket
ticketsRouter.post("/", async (req, res) => {
  try {
    const {
      type = "Customer",
      name = "",
      email = "",
      phoneCountryCode = "+1",
      phoneNumber = "",
      areaOfInconvenience = "",
      employeeName = "",
      employeeId = "",
      employeeEmail = "",
      moduleName = "",
      category = "",
      subCategory = "",
      remarks = "",
      fileName = "",
      fileData = "",
    } = req.body;

    const ticketID = generateTicketId();

    const newTicket = await Ticket.create({
      ticketID,
      type,
      name,
      email,
      phoneCountryCode,
      phoneNumber,
      areaOfInconvenience,
      employeeName,
      employeeId,
      employeeEmail,
      moduleName,
      category,
      subCategory,
      remarks,
      fileName,
      fileData,
      status: "Open",
      isRead: false,
    });

    // Notify Admin via Notification
    const notifTitle = type === "Customer" 
      ? `New Customer Ticket Raised: ${ticketID}` 
      : `New Employee Ticket Raised: ${ticketID} (${employeeName || "Employee"})`;
    
    const notifMsg = type === "Customer" 
      ? `${name} raised a ticket regarding "${areaOfInconvenience || 'Services'}".` 
      : `${employeeName || 'Employee'} (${employeeId}) raised a ticket in module "${moduleName}" under category "${category} - ${subCategory}".`;

    await Notification.create({
      title: notifTitle,
      message: notifMsg,
      category: "alert",
      link: "/tickets",
      isRead: false,
    }).catch((err) => console.error("Notification creation failed:", err));

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Failed to create ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// GET /api/tickets - Fetch all tickets
ticketsRouter.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/unread-count - Fetch unread/open count for badge
ticketsRouter.get("/unread-count", async (_req, res) => {
  try {
    const openCount = await Ticket.countDocuments({ status: "Open" });
    const unreadCount = await Ticket.countDocuments({ isRead: false });
    res.json({ openCount, unreadCount });
  } catch (error) {
    console.error("Failed to fetch ticket count:", error);
    res.status(500).json({ error: "Failed to fetch ticket count" });
  }
});

// PATCH /api/tickets/:id/status - Update ticket status
ticketsRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Open", "Ongoing", "Closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

// PATCH /api/tickets/:id/read - Mark ticket as read
ticketsRouter.patch("/:id/read", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(ticket || { success: true });
  } catch (error) {
    console.error("Failed to mark ticket read:", error);
    res.status(500).json({ error: "Failed to mark ticket read" });
  }
});

// DELETE /api/tickets/:id - Delete ticket
ticketsRouter.delete("/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});
