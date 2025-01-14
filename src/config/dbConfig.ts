import * as dotenv from "dotenv";
import { createPool, Pool } from "mysql2/promise";

dotenv.config(); // Load environment variables from .env file

/**
 * Database configuration object sourced from environment variables.
 */
export const dbConfig = {
  host: process.env.DB_HOST || "localhost", // Database host (default: localhost)
  user: process.env.DB_USER || "sa", // Database username (default: 'sa')
  password: process.env.DB_PWD || "", // Database password (default: empty string)
  database: process.env.DB_NAME || "AGRICULTURE", // Database name (default: 'AGRICULTURE')
  port: parseInt(process.env.DB_PORT || "3306", 10), // MySQL default port is 3306 (make sure this is correct)
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool (you can adjust based on your need)
  queueLimit: 0, // No limit for connection queue
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || "30000", 10), // Default 30 seconds
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
    // Log detailed error message if connection fails
    if (error instanceof Error) {
      console.error("Failed to connect to the database:", error.message);

      // Handle specific error codes (e.g., timeout)
      if (error.message.includes("ETIMEDOUT")) {
        console.error(
          "Database connection attempt timed out. Please check network or database server."
        );
      }
    } else {
      console.error(
        "Unexpected error while connecting to the database:",
        error
      );
    }

    throw error; // Ensure the error propagates for proper handling by the caller
  }
};
