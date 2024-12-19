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
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
);

// Connect to the database
connectToDatabase();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
