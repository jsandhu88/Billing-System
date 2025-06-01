import express from "express";
import authorize from "../middlewares/authMiddleware.js";
import paymentController from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/create-payment",
  authorize,
  paymentController.createPayment
);
paymentRoutes.get(
  "/get-all-payments",
  authorize,
  paymentController.getPayments
);
paymentRoutes.delete(
  "/delete-payment",
  authorize,
  paymentController.deletePayment
);
export default paymentRoutes;
