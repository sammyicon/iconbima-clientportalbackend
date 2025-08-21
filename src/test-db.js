import pool from "./config/oracledb-connect.js";

const testConnection = async () => {
  try {
    const connection = await (await pool).getConnection();
    console.log("✅ Connected to DB");

    const result = await connection.execute("SELECT SYSDATE FROM dual");
    console.log("Current DB time:", result.rows[0][0]);

    await connection.close();
    console.log("🔒 Connection closed");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

testConnection();
