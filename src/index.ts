import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";
import farmerRoutes from "./routes/farmerRoutes";
import { connectToDatabase } from "./config/dbConfig";

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/farmers", farmerRoutes);

// Error Handler Middleware
app.use(
  (
    err: unknown, // err is now explicitly typed as 'unknown'
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof Error) {
      // Handle if 'err' is an instance of Error
      res.status(500).json({ message: err.message || "Internal Server Error" });
    } else {
      // Handle any other type of error
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
);

// Connect to the database
(async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the app if the database connection fails
  }
})();

// Start the server
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
