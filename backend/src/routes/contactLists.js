import { Router } from "express";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/requireAuth.js";
import { ContactListModel } from "dbms/ContactList.js";
import { CSVDocModel } from "dbms/CSVDoc.js";
import { EmployeeModel } from "dbms/Employee.js";
import { UserModel } from "dbms/User.js";
import CustomerInquiry from "dbms/CustomerInquiry.js";
import Notification from "dbms/Notification.js";

export const contactListsRouter = Router();

// Helpers matching frontend utility
const normalize = (val) => String(val || "").trim().toLowerCase().replace(/\s+/g, " ");
const cleanPhone = (val) => String(val || "").replace(/\D/g, "");

const getFieldValue = (record, possibleKeys) => {
  const keys = Object.keys(record || {});
  const exactKey = keys.find(k => possibleKeys.some(pk => normalize(k) === normalize(pk)));
  if (exactKey) return record[exactKey];
  const partialKey = keys.find(k => possibleKeys.some(pk => normalize(k).includes(normalize(pk))));
  return partialKey ? record[partialKey] : "";
};

const getName = (r) => getFieldValue(r, ["name", "full name", "client name", "candidate name", "student name"]);
const getEmail = (r) => getFieldValue(r, ["email", "email id", "email address", "mail"]);
const getContact = (r) => getFieldValue(r, ["contact", "phone", "phone number", "mobile", "mobile number", "contact number"]);

// Reconstruct CSV file from finalized headers and rows
const convertToCsv = (headers, rows) => {
  const headerLine = headers.join(",");
  const rowLines = rows.map(r => {
    if (Array.isArray(r)) {
      return r.map(val => {
        const str = String(val === null || val === undefined ? "" : val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",");
    }
    return headers.map(h => {
      const val = r[h] !== undefined ? r[h] : r[h.toLowerCase()];
      const str = String(val === null || val === undefined ? "" : val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(",");
  });
  return [headerLine, ...rowLines].join("\n");
};

// Build tree of directories and files from MongoDB Atlas
const buildTreeFromFiles = (files) => {
  const root = [];
  
  const getOrCreateDir = (childrenList, name, currentRelPath) => {
    let dir = childrenList.find(c => c.name === name && c.type === "directory");
    if (!dir) {
      dir = {
        name,
        type: "directory",
        path: currentRelPath,
        children: []
      };
      childrenList.push(dir);
    }
    return dir;
  };
  
  for (const file of files) {
    const parts = file.path.split("/");
    let currentChildren = root;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      const folderPath = parts.slice(0, i + 1).join("/");
      const dirNode = getOrCreateDir(currentChildren, folderName, folderPath);
      currentChildren = dirNode.children;
    }
    
    const fileName = parts[parts.length - 1];
    currentChildren.push({
      id: String(file._id),
      name: fileName,
      type: "file",
      path: file.path
    });
  }
  
  const sortTree = (nodes) => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      const idxA = monthOrder.indexOf(a.name);
      const idxB = monthOrder.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    for (const node of nodes) {
      if (node.type === "directory") {
        sortTree(node.children);
      }
    }
  };
  
  sortTree(root);
  return root;
};

// Get unique database contacts for duplicate scanning
contactListsRouter.get("/contacts", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth.orgId;
    const inquiries = await CustomerInquiry.find();
    const lists = await ContactListModel.find({ orgId });
    
    const contacts = [];
    const seen = new Set();
    
    const add = (name, email, contact, source) => {
      const key = `${normalize(name)}|${normalize(email)}|${cleanPhone(contact)}`;
      if ((name || email || contact) && !seen.has(key)) {
        seen.add(key);
        contacts.push({ name: name || "", email: email || "", contact: contact || "", source });
      }
    };
    
    inquiries.forEach(i => add(i.name, i.email, i.phoneNumber, "Customer Inquiry"));
    lists.forEach(l => {
      if (Array.isArray(l.rows)) {
        l.rows.forEach(r => add(getName(r), getEmail(r), getContact(r), `List: ${l.fileName}`));
      }
    });
    
    res.json(contacts);
  } catch (err) {
    console.error("Failed to fetch database contacts:", err);
    res.status(500).json({ error: "Failed to fetch database contacts" });
  }
});

// Get Master Customer Data grouped by month
contactListsRouter.get("/master-customer-data", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth.orgId;
    const inquiries = await CustomerInquiry.find().sort({ createdAt: -1 });
    const lists = await ContactListModel.find({ orgId }).sort({ createdAt: -1 });

    const groupMap = new Map(); // "Month Year" -> Array of records

    const addToGroup = (date, record) => {
      const d = date ? new Date(date) : new Date();
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthName = months[d.getMonth()] || "Unknown";
      const year = d.getFullYear() || 2026;
      const groupKey = `${monthName} ${year}`;

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      const currentList = groupMap.get(groupKey);
      currentList.push({
        sNo: currentList.length + 1,
        ...record,
      });
    };

    inquiries.forEach((i) => {
      addToGroup(i.createdAt, {
        name: i.name || "N/A",
        phone: i.phoneNumber || "N/A",
        email: i.email || "N/A",
        status: i.status || "Pending",
        assignedTo: i.assignedToName || i.assignedTo || "Unassigned",
        remarks: i.message || i.serviceInterest || "Website Inquiry",
      });
    });

    lists.forEach((l) => {
      if (Array.isArray(l.rows)) {
        l.rows.forEach((r) => {
          addToGroup(l.createdAt, {
            name: getName(r) || "N/A",
            phone: getContact(r) || "N/A",
            email: getEmail(r) || "N/A",
            status: l.status || "Assigned",
            assignedTo: l.assignedTo || "All Team",
            remarks: `File: ${l.fileName}`,
          });
        });
      }
    });

    const result = Array.from(groupMap.entries()).map(([monthYear, records]) => ({
      monthYear,
      records,
    }));

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch master customer data:", err);
    res.status(500).json({ error: "Failed to fetch master customer data" });
  }
});

// Get assigned contact lists for employee grouped by month
contactListsRouter.get("/assigned", requireAuth, async (req, res) => {
  try {
    const { employeeCode } = req.query;
    
    // Find lists assigned to employeeCode, or fallback to all assigned lists if employeeCode is demo/generic
    let lists = [];
    if (employeeCode) {
      lists = await ContactListModel.find({
        $or: [{ assignedTo: employeeCode }, { assignedTo: { $exists: true, $ne: "" } }]
      }).sort({ createdAt: -1 });
    } else {
      lists = await ContactListModel.find({ assignedTo: { $exists: true, $ne: "" } }).sort({ createdAt: -1 });
    }

    const groupMap = new Map();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December font"];

    lists.forEach((l) => {
      const d = l.createdAt ? new Date(l.createdAt) : new Date();
      const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] || "Unknown";
      const year = d.getFullYear() || 2026;
      const key = `${monthName} ${year}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key).push(l);
    });

    const result = Array.from(groupMap.entries()).map(([monthYear, itemLists]) => ({
      monthYear,
      lists: itemLists,
      totalRows: itemLists.reduce((sum, l) => sum + (l.rows?.length || 0), 0)
    }));

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch assigned contact lists:", err);
    res.status(500).json({ error: "Failed to fetch assigned contact lists" });
  }
});

// Sync assigned contact list
contactListsRouter.post("/sync/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await ContactListModel.findByIdAndUpdate(
      id,
      { status: "synced" },
      { new: true }
    );
    if (!list) return res.status(404).json({ error: "List not found" });

    res.json({ success: true, list });
  } catch (err) {
    console.error("Failed to sync contact list:", err);
    res.status(500).json({ error: "Failed to sync contact list" });
  }
});

contactListsRouter.post("/upload", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth.orgId;
    const { fileName, headers, rows, fileData, fileType = "csv" } = req.body;
    
    const list = await ContactListModel.create({
      orgId,
      fileName,
      headers,
      rows,
      fileData,
      fileType
    });
    
    // Save representation to MongoDB "CSV Docs" database
    try {
      const date = new Date();
      const year = String(date.getFullYear());
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getMonth()];
      const targetPath = `Main Uploads/${year}/${month}/${fileName}`;
      
      await CSVDocModel.findOneAndUpdate(
        { path: targetPath },
        {
          name: fileName,
          type: "file",
          path: targetPath,
          headers,
          rows,
          fileType,
          uploadedBy: req.auth.userId
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error("Failed to store CSV doc in MongoDB Atlas:", dbErr);
    }
    
    res.status(201).json({ id: String(list._id) });
  } catch (err) {
    console.error("Failed to upload contact list:", err);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// Confirm assignment with admin password and send notifications
contactListsRouter.post("/assign", requireAuth, async (req, res) => {
  try {
    const orgId = req.auth.orgId;
    const { id, employeeCodes, password } = req.body;
    
    const user = await UserModel.findById(req.auth.userId || req.auth.sub);
    if (!user) return res.status(404).json({ error: "Admin user not found" });
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid admin password" });
    
    const originalList = await ContactListModel.findById(id);
    if (!originalList) return res.status(404).json({ error: "Document not found" });
    
    for (const code of employeeCodes) {
      const emp = await EmployeeModel.findOne({ orgId, employeeCode: code });
      const empName = emp ? `${emp.personal.firstName} ${emp.personal.lastName || ""}`.trim() : code;
      
      const assignedList = await ContactListModel.create({
        orgId,
        fileName: originalList.fileName,
        headers: originalList.headers,
        rows: originalList.rows,
        fileData: originalList.fileData,
        fileType: originalList.fileType,
        assignedTo: code,
        assignedByName: user.name,
        status: "pending"
      });
      
      // Save representation to MongoDB "CSV Docs" database
      try {
        const date = new Date();
        const year = String(date.getFullYear());
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const targetPath = `Assigns/${code}/${year}/${month}/${originalList.fileName}`;
        
        await CSVDocModel.findOneAndUpdate(
          { path: targetPath },
          {
            name: originalList.fileName,
            type: "file",
            path: targetPath,
            headers: originalList.headers,
            rows: originalList.rows,
            fileType: originalList.fileType,
            uploadedBy: user.name,
            assignedTo: code
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.error(`Failed to store assigned CSV doc for ${code} in MongoDB Atlas:`, dbErr);
      }
      
      // Notify employee
      await Notification.create({
        title: "New Contacts List Assigned",
        message: `Admin ${user.name} has sent you a new Contacts List. Click here to view it and sync it to your existing one.`,
        category: "system",
        link: "/employee/contacts",
        isRead: false,
        metadata: {
          employeeCode: code,
          contactListId: String(assignedList._id)
        }
      });
      
      // Notify admin
      await Notification.create({
        title: "Contact List Sent",
        message: `Contact List has been successfully sent to ${empName}.`,
        category: "system",
        link: "",
        isRead: false,
        metadata: {
          adminUserId: String(user._id)
        }
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to assign contact list:", err);
    res.status(500).json({ error: "Failed to assign contact list" });
  }
});

// CSV Docs directory tree explorer
contactListsRouter.get("/explorer", requireAuth, async (req, res) => {
  try {
    const files = await CSVDocModel.find({ type: "file" });
    const tree = buildTreeFromFiles(files);
    res.json(tree);
  } catch (err) {
    console.error("Failed to read CSV Docs explorer tree:", err);
    res.status(500).json({ error: "Failed to read CSV Docs explorer tree" });
  }
});

// CSV Docs downloader
contactListsRouter.get("/explorer/download", requireAuth, async (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: "File path query param is required" });
    }
    const fileDoc = await CSVDocModel.findOne({ path: filePath, type: "file" });
    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const csvContent = convertToCsv(fileDoc.headers, fileDoc.rows);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileDoc.name)}"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csvContent);
  } catch (err) {
    console.error("Download failed:", err);
    res.status(500).json({ error: "Download failed" });
  }
});
// Delete file from MongoDB Atlas (CSVDocModel & ContactListModel)
contactListsRouter.delete("/explorer/file", requireAuth, async (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: "File path query param is required" });
    }

    const fileDoc = await CSVDocModel.findOne({ path: filePath, type: "file" });
    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }

    // Remove from CSVDocModel
    await CSVDocModel.deleteOne({ _id: fileDoc._id });

    // Try removing matching list from ContactListModel if matching filename
    await ContactListModel.deleteMany({ fileName: fileDoc.name }).catch(() => {});

    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file failed:", err);
    res.status(500).json({ error: "Delete file failed" });
  }
});



