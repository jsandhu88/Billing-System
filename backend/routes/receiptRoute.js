import express from "express";
import authorize from "../middlewares/authMiddleware.js";
import receiptController from "../controllers/receiptController.js";

const receiptRoutes = express.Router();

receiptRoutes.post(
  "/create-receipt",
  authorize,
  receiptController.createReceipt
);
receiptRoutes.get(
  "/get-all-receipts",
  authorize,
  receiptController.getReceipts
);
receiptRoutes.delete(
  "/delete-receipt",
  authorize,
  receiptController.deleteReceipt
);
export default receiptRoutes;
