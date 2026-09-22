/**
 * Centralized Department Configuration & Registry
 *
 * To add a new department with an active dashboard in the future:
 * 1. Build the employee dashboard (e.g. /employee/database)
 * 2. Set hasPage: true and specify employeeRoute below
 */

export const ALL_DEPARTMENTS = [
  {
    name: "Sales",
    value: "Sales",
    employeeRoute: "/employee/sales",
    hasPage: true,
  },
  {
    name: "Digital Marketing",
    value: "Digital Marketing",
    employeeRoute: "/employee/digitaldashboard",
    hasPage: true,
  },
  {
    name: "Database Management",
    value: "Database Management",
    employeeRoute: "/employee/database",
    hasPage: false,
  },
  {
    name: "Frontend",
    value: "Frontend",
    employeeRoute: "/employee/frontend",
    hasPage: false,
  },
  {
    name: "Backend",
    value: "Backend",
    employeeRoute: "/employee/backend",
    hasPage: false,
  },
  {
    name: "Network and Security",
    value: "Network and Security",
    employeeRoute: "/employee/networks",
    hasPage: false,
  },
  {
    name: "Testing and QA",
    value: "Testing and QA",
    employeeRoute: "/employee/testing",
    hasPage: false,
  },
];

/**
 * Only departments whose pages/dashboards are currently built and active.
 * Used for employee creation/approval dropdown menus.
 */
export const ACTIVE_DEPARTMENTS = ALL_DEPARTMENTS.filter((dept) => dept.hasPage);

/**
 * Look up department config by name (case-insensitive and tolerant of partial/alias matches)
 */
export function getDepartmentConfig(departmentName) {
  if (!departmentName) return null;
  const raw = String(departmentName).trim().toLowerCase();

  return (
    ALL_DEPARTMENTS.find((d) => {
      const dName = d.name.toLowerCase();
      const dVal = d.value.toLowerCase();
      return (
        dName === raw ||
        dVal === raw ||
        raw.includes(dName) ||
        dName.includes(raw) ||
        (raw.includes("digital") && dName.includes("digital")) ||
        (raw.includes("sales") && dName.includes("sales"))
      );
    }) || null
  );
}

/**
 * Check whether a department has an existing dashboard page built.
 */
export function hasDepartmentPage(departmentName) {
  const config = getDepartmentConfig(departmentName);
  return Boolean(config && config.hasPage && config.employeeRoute);
}

/**
 * Retrieve the employee dashboard route for a department if built, or null.
 */
export function getDepartmentEmployeeRoute(departmentName) {
  const config = getDepartmentConfig(departmentName);
  if (config && config.hasPage) {
    return config.employeeRoute;
  }
  return null;
}

const departmentRegistry = {
  ALL_DEPARTMENTS,
  ACTIVE_DEPARTMENTS,
  getDepartmentConfig,
  hasDepartmentPage,
  getDepartmentEmployeeRoute,
};

export default departmentRegistry;

