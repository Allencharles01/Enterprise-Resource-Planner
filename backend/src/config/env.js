/**
 * Backend Environment & Configuration Constants
 */
export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/erp",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret_key_erp_2026",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default ENV;
