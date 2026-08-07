/**
 * Frontend Environment Configuration
 */
export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  DEFAULT_PAGE_SIZE: 10,
};

export default ENV;
