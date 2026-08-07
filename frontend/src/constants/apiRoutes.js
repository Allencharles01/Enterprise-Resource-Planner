/**
 * Centralized API Routes Endpoint Constants
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },
  ADMINS: {
    BASE: "/api/admins",
  },
  EMPLOYEES: {
    BASE: "/api/employees",
    SELECT: "/api/employees/select",
  },
  PROJECTS: {
    BASE: "/api/projects",
  },
  INTERNSHIPS: {
    CANDIDATES: "/api/internships/candidates",
  },
  TRAINING: {
    CANDIDATES: "/api/training/candidates",
  },
  ACCOUNT_REQUESTS: {
    BASE: "/api/account-requests",
  },
  EMAILS: {
    BASE: "/api/emails",
  },
  CHAT: {
    BASE: "/api/internal-chat",
  },
  NOTIFICATIONS: {
    BASE: "/api/notifications",
  },
};

export default API_ROUTES;
