import * as dotenv from "dotenv";
import { createPool } from "mysql2/promise"; // Ensure you have mysql2 installed

dotenv.config();

// Database configuration
export const dbConfig = {
  host: "localhost", // MySQL uses `host` instead of `server`
  user: process.env.DB_USER as string,
  password: process.env.DB_PWD as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Connect to the database
export const connectToDatabase = async () => {
  try {
    const pool = createPool(dbConfig); // Create a connection pool
    await pool.getConnection(); // Test the connection
    console.log("Connected to the database");
    return pool; // Return the connection pool for use in your app
  } catch (error) {
    // Explicitly assert error type as 'Error' to safely access its properties
    if (error instanceof Error) {
      console.error("Failed to connect to the database:", error.message);
    } else {
      console.error("Failed to connect to the database:", error);
    }
    throw error; // Re-throw the error after logging
  }
};
