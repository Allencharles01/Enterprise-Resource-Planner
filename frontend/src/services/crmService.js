// services/crmService.js

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

/* -----------------------------
   Generic Request Helper
------------------------------ */

async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new Error("Request Failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/* -----------------------------
   Contacts
------------------------------ */

export async function getContacts(params = {}) {
  const query = new URLSearchParams({
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    search: params.search || "",
  });

  return request(`/crm/contacts?${query.toString()}`);
}

export async function getContact(id) {
  return request(`/crm/contact/${id}`);
}

export async function getNextContact(currentId = "") {
  return request(`/crm/next-contact?current=${currentId}`);
}

/* -----------------------------
   Calling
------------------------------ */

export async function startCall(contactId, phoneNumber) {
  return request("/crm/start-call", {
    method: "POST",
    body: JSON.stringify({
      contactId,
      phoneNumber,
    }),
  });
}

export async function endCall(callId, duration) {
  return request("/crm/end-call", {
    method: "POST",
    body: JSON.stringify({
      callId,
      duration,
    }),
  });
}

export async function updateCallStatus(data) {
  return request("/crm/update-call-status", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* -----------------------------
   Notes
------------------------------ */

export async function addNote(contactId, note) {
  return request("/crm/add-note", {
    method: "POST",
    body: JSON.stringify({
      contactId,
      note,
    }),
  });
}

export async function updateNote(noteId, note) {
  return request(`/crm/update-note/${noteId}`, {
    method: "PUT",
    body: JSON.stringify({
      note,
    }),
  });
}

export async function deleteNote(noteId) {
  return request(`/crm/delete-note/${noteId}`, {
    method: "DELETE",
  });
}

/* -----------------------------
   Lead Category
------------------------------ */

export async function updateLeadCategory(contactId, category) {
  return request("/crm/update-category", {
    method: "PUT",
    body: JSON.stringify({
      contactId,
      category,
    }),
  });
}

/* -----------------------------
   History
------------------------------ */

export async function getCallHistory(contactId) {
  return request(`/crm/call-history/${contactId}`);
}

/* -----------------------------
   Follow Ups
------------------------------ */

export async function saveFollowUp(data) {
  return request("/crm/follow-up", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -----------------------------
   Notifications
------------------------------ */

export async function getNotifications() {
  return request("/crm/notifications");
}

export async function markNotificationRead(id) {
  return request(`/crm/notification/read/${id}`, {
    method: "PUT",
  });
}

/* -----------------------------
   CSV Upload
------------------------------ */

export async function uploadContacts(formData) {
  const response = await fetch(`${API_BASE}/crm/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}

/* -----------------------------
   Sync
------------------------------ */

export async function syncContacts(fileId) {
  return request("/crm/sync", {
    method: "POST",
    body: JSON.stringify({
      fileId,
    }),
  });
}

/* -----------------------------
   Dashboard Statistics
------------------------------ */

export async function getCRMStatistics() {
  return request("/crm/statistics");
}