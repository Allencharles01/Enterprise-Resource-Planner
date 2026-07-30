"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Phone,
  Users,
  Bell,
  Upload,
  ArrowRight,
  X,
} from "lucide-react";

import Dialpad from "./Dialpad";
import CustomerInfo from "./CustomerInfo";
import LeadCategory from "./LeadCategory";

import CallStatusModal from "./CallStatusModal";
import ContactListModal from "./ContactListModal";
import NotificationModal from "./NotificationModal";
import ReviewSheetModal from "./ReviewSheetModal";
import SyncSuccessModal from "./SyncSuccessModal";
<<<<<<< HEAD
=======
import AssignedContactsTable from "./AssignedContactsTable";
import CustomerDetailsModal from "./CustomerDetailsModal";
>>>>>>> Newfrontend-kanak

export default function CallingWorkspace({ open, onClose }) {
  if (!open) return null;

  /* ===================================================
      CRM CONTACTS
  ==================================================== */

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      phoneNumber: "9876543210",
      email: "rahul@gmail.com",
      company: "ABC Pvt Ltd",
      designation: "Marketing Head",
      education: "MBA",
      location: "Delhi",
      employmentStatus: "Working",

      leadCategory: "Advertising",

      notes: [
        {
          id: 1,
          content: "Interested in Meta Ads",
          createdBy: "Admin",
          createdAt: new Date(),
        },
      ],
    },

    {
      id: 2,
      name: "Priya Gupta",
      phoneNumber: "9123456789",
      email: "priya@gmail.com",
      company: "XYZ Technologies",
      designation: "Founder",
      education: "B.Tech",
      location: "Noida",
      employmentStatus: "Self Employed",

      leadCategory: "Content Creator",

      notes: [],
    },

    {
      id: 3,
      name: "Aman Singh",
      phoneNumber: "9988776655",
      email: "aman@gmail.com",
      company: "Digital Media",

      designation: "CEO",
      education: "MBA",
      location: "Jaipur",
      employmentStatus: "Working",

      leadCategory: "Heavy Ads",

      notes: [],
    },
  ]);

  /* ===================================================
      RECENT CALL HISTORY
  ==================================================== */

  const [recentCalls, setRecentCalls] = useState([
    {
      id: 1,
      callStartTime: new Date(),
      callDurationSeconds: 245,
    },

    {
      id: 2,
      callStartTime: new Date(),
      callDurationSeconds: 128,
    },
  ]);

  /* ===================================================
      SELECTED CUSTOMER
  ==================================================== */

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedContact = useMemo(() => {
    return contacts[selectedIndex];
  }, [contacts, selectedIndex]);

  /* ===================================================
      PHONE NUMBER
  ==================================================== */

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (selectedContact) {
      setPhoneNumber(selectedContact.phoneNumber);
    }
  }, [selectedContact]);

  /* ===================================================
      CALL STATE

      ready
      calling
      connected
      ended
      failed
      missed
  ==================================================== */

  const [callState, setCallState] = useState("ready");

  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    if (callState !== "connected") return;

    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callState]);

  /* ===================================================
      LEAD CATEGORY
  ==================================================== */

  const [leadCategory, setLeadCategory] = useState("");

  useEffect(() => {
    if (selectedContact) {
      setLeadCategory(selectedContact.leadCategory);
    }
  }, [selectedContact]);

  /* ===================================================
      MODALS
  ==================================================== */

  const [showContacts, setShowContacts] = useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showCallStatus, setShowCallStatus] =
    useState(false);

  const [showReviewSheet, setShowReviewSheet] =
    useState(false);

  const [showSyncSuccess, setShowSyncSuccess] =
    useState(false);

  /* ===================================================
      NOTIFICATIONS
  ==================================================== */

  const [notifications] = useState([
    {
      id: 1,
      title: "Follow Up",
      message: "Call Rahul Sharma after lunch.",
      read: false,
    },

    {
      id: 2,
      title: "New Lead",
      message: "Priya Gupta added.",
      read: false,
    },
  ]);

  /* ===================================================
      PART 2 STARTS BELOW
  ==================================================== */
    /* ===================================================
      DIALPAD FUNCTIONS
  ==================================================== */

  const handleDial = (digit) => {
    if (callState === "calling" || callState === "connected") return;
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (callState === "calling" || callState === "connected") return;
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (!phoneNumber) return;

    setDurationSeconds(0);
    setCallState("calling");

    setTimeout(() => {
      setCallState("connected");
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState("ended");
    setShowCallStatus(true);
  };

  /* ===================================================
      CUSTOMER ACTIONS
  ==================================================== */

  const handlePhoneClick = (number) => {
    setPhoneNumber(number);
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`);
  };

  const handleViewHistory = () => {
    alert("Complete call history will be available after backend integration.");
  };

  const handleAddNote = (note) => {
    setContacts((prev) =>
      prev.map((contact, index) => {
        if (index !== selectedIndex) return contact;

        return {
          ...contact,
          notes: [
            ...(contact.notes || []),
            {
              id: Date.now(),
              content: note,
              createdBy: "Employee",
              createdAt: new Date(),
            },
          ],
        };
      })
    );
  };

  /* ===================================================
      CONTACT FUNCTIONS
  ==================================================== */

  const nextContact = () => {
    const next =
      selectedIndex === contacts.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedIndex(next);

    setCallState("ready");

    setDurationSeconds(0);
  };

  const previousContact = () => {
    const previous =
      selectedIndex === 0
        ? contacts.length - 1
        : selectedIndex - 1;

    setSelectedIndex(previous);

    setCallState("ready");

    setDurationSeconds(0);
  };

<<<<<<< HEAD
=======
  const handleContactSelect = (contact) => {
  const index = contacts.findIndex((c) => c.id === contact.id);

  if (index !== -1) {
    setSelectedIndex(index);
    setPhoneNumber(contact.phoneNumber);
    setCallState("ready");
    setDurationSeconds(0);
  }
};
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

const handleViewDetails = (contact) => {
  const index = contacts.findIndex((c) => c.id === contact.id);

  if (index !== -1) {
    setSelectedIndex(index);
  }

  setShowCustomerDetails(true);
};



>>>>>>> Newfrontend-kanak
  /* ===================================================
      JSX
  ==================================================== */

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">

        <div className="w-full max-w-7xl h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0B1224] shadow-2xl flex flex-col">

          {/* Header */}

          <div className="border-b border-violet-100 dark:border-white/10 px-8 py-5 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-[#24123B] dark:text-white">
                CRM Calling Workspace
              </h2>

              <p className="text-sm text-gray-500">
                Manage customer calls and follow-ups
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setShowContacts(true)}
                className="
h-10
w-10
rounded-xl
border
border-violet-300
bg-white
text-violet-600
hover:bg-violet-100
hover:text-violet-700
transition-all
duration-200
flex
items-center
justify-center
dark:bg-[#1B1B2D]
dark:border-white/10
dark:text-violet-300
dark:hover:bg-violet-500/10
"
              >
                <Users size={20} />
              </button>

              <button
                onClick={() => setShowNotifications(true)}
                className="
h-10
w-10
rounded-xl
border
border-violet-300
bg-white
text-violet-600
hover:bg-violet-100
hover:text-violet-700
transition-all
duration-200
flex
items-center
justify-center
dark:bg-[#1B1B2D]
dark:border-white/10
dark:text-violet-300
dark:hover:bg-violet-500/10
"
              >
                <Bell size={20} />
              </button>

              <button
                className="
h-10
w-10
rounded-xl
border
border-violet-300
bg-white
text-violet-600
hover:bg-violet-100
hover:text-violet-700
transition-all
duration-200
flex
items-center
justify-center
dark:bg-[#1B1B2D]
dark:border-white/10
dark:text-violet-300
dark:hover:bg-violet-500/10
"
              >
                <Upload size={20} />
              </button>

              <button
                onClick={onClose}
                className="h-11 w-11 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto p-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}

              <div className="space-y-6">

                <Dialpad
                  phoneNumber={phoneNumber}
                  onChange={setPhoneNumber}
                  onDial={handleDial}
                  onBackspace={handleBackspace}
                  onCall={handleCall}
                  onEndCall={handleEndCall}
                  callState={callState}
                  durationSeconds={durationSeconds}
                />

<<<<<<< HEAD
                <LeadCategory
                  value={leadCategory}
                  onChange={setLeadCategory}
                />

                <button
                  onClick={nextContact}
                  className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-2"
                >
                  Next Contact
                  <ArrowRight size={18} />
                </button>
=======
>>>>>>> Newfrontend-kanak

              </div>

              {/* RIGHT */}

              <div className="lg:col-span-2">

<<<<<<< HEAD
                <CustomerInfo
                  contact={selectedContact}
                  recentCalls={recentCalls}
                  onPhoneClick={handlePhoneClick}
                  onEmailClick={handleEmailClick}
                  onViewAllHistory={handleViewHistory}
                  onAddNote={handleAddNote}
                />
=======
                <AssignedContactsTable
  contacts={contacts}
  selectedContact={selectedContact}
  onSelect={handleContactSelect}
  onViewDetails={handleViewDetails}
/>
>>>>>>> Newfrontend-kanak

              </div>

            </div>

          </div>
                    {/* Contact List Modal */}
          <ContactListModal
            open={showContacts}
            onClose={() => setShowContacts(false)}
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            onSelect={(contact) => {
              const index = contacts.findIndex(
                (c) => c.id === contact.id
              );

              if (index !== -1) {
                setSelectedIndex(index);
              }

              setShowContacts(false);
            }}
          />

          {/* Notification Modal */}
          <NotificationModal
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
          />

          {/* Call Status */}
          <CallStatusModal
<<<<<<< HEAD
            open={showCallStatus}
            onClose={() => {
              setShowCallStatus(false);
              setShowReviewSheet(true);
            }}
            callState={callState}
            durationSeconds={durationSeconds}
            contact={selectedContact}
          />
=======
    open={showCallStatus}
    onClose={() => setShowCallStatus(false)}
    contact={selectedContact}
    durationSeconds={durationSeconds}
    onSave={(data) => {

        setRecentCalls((prev) => [

            {
                id: Date.now(),

                type: "Outgoing Call",

                callStartTime: new Date(),

                callDurationSeconds: durationSeconds,

                status: data.status,

                remarks: data.remarks,
            },

            ...prev,

        ]);

        setShowCallStatus(false);

        setShowReviewSheet(true);

    }}
/>
>>>>>>> Newfrontend-kanak

          {/* Review Sheet */}
          <ReviewSheetModal
            open={showReviewSheet}
            onClose={() => {
              setShowReviewSheet(false);
              setShowSyncSuccess(true);
            }}
            contact={selectedContact}
            leadCategory={leadCategory}
          />

          {/* Sync Success */}
          <SyncSuccessModal
            open={showSyncSuccess}
            onClose={() => {
              setShowSyncSuccess(false);

              setCallState("ready");
              setDurationSeconds(0);

              nextContact();
            }}
          />
<<<<<<< HEAD
=======
          <CustomerDetailsModal
  open={showCustomerDetails}
  onClose={() => setShowCustomerDetails(false)}
  contact={selectedContact}
  recentCalls={recentCalls}
  onPhoneClick={handlePhoneClick}
  onEmailClick={handleEmailClick}
  onViewAllHistory={() => {}}
  onAddNote={handleAddNote}
/>
>>>>>>> Newfrontend-kanak

        </div>
      </div>
    </>
  );
}