import * as dotenv from "dotenv";
import { createPool, Pool } from "mysql2/promise";

dotenv.config();

/**
 * Database configuration object sourced from environment variables.
 */
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PWD || "",
  database: process.env.DB_NAME || "",
  port: parseInt(process.env.DB_PORT || "3307", 10), // Default MySQL port is 3306
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // No limit for connection queue
};

/**
 * Create and return a connection pool for the database.
 * Ensures a single pool is used across the application.
 */
export const connectToDatabase = async (): Promise<Pool> => {
  try {
    const pool = createPool(dbConfig); // Create a connection pool

    // Test the database connection
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release(); // Release the connection back to the pool

    return pool; // Return the connection pool
  } catch (error) {
    // Explicit error logging and re-throw for proper handling
    if (error instanceof Error) {
      console.error("Failed to connect to the database:", error.message);
    } else {
      console.error(
        "Unexpected error while connecting to the database:",
        error
      );
    }
    throw error; // Ensure the error propagates for caller handling
  }
};
