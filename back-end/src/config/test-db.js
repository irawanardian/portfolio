import pool from "./db.js";

try {
  const result = await pool.query("SELECT NOW() AS now, current_database() AS database_name");
  console.log("DB connected:", result.rows[0]);
} catch (error) {
  console.error("DB connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
