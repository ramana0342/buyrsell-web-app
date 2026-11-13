import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Reuse connections during short bursts while keeping the pool small for
  // Supabase's free connection limits. Pool connections are created lazily.
  max: 5,
  idleTimeoutMillis: 30_000,
  // Fail a request with a database error instead of waiting indefinitely
  // when PostgreSQL is temporarily unreachable.
  connectionTimeoutMillis: 10_000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Prevent idle connection errors from becoming unhandled EventEmitter errors.
// Log only the PostgreSQL error code; never log connection details.
pool.on("error", (error) => {
  console.error("PostgreSQL pool idle client error", error.code || "unknown");
});

export default pool;
