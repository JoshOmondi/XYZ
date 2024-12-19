import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Type-check environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing required database environment variables");
}

// Create a connection pool
const pool: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Optional: Test the connection during initialization.
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database successfully");
    connection.release();
  } catch (error) {
    // Handle the unknown error type
    if (error instanceof Error) {
      console.error("Failed to connect to the database:", error.message);
    } else {
      console.error(
        "An unknown error occurred during database connection:",
        error
      );
    }
    throw error; // Re-throw the error after logging
  }
};

export default pool;
