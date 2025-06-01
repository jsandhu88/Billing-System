import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import receiptRoutes from "./routes/receiptRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/auth", authRoutes);
app.use("/invoice", invoiceRoute);
app.use("/payment", paymentRoute);
app.use("/receipt", receiptRoutes);
app.use("/dashboard", dashboardRoute);

mongoose
  .connect(process.env.Mongo_Uri)
  .then(() => {
    console.log("Connected to database");
    const PORT = 8000;
    app.listen(PORT, () => {
      console.log(`Server started ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
