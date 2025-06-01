import express from "express";
import authorize from "../middlewares/authMiddleware.js";
import dashboardController from "../controllers/dashboardController.js";

const dashboardRoute = express.Router();

dashboardRoute.get(
  "/get-sales-report",
  authorize,
  dashboardController.getSalesReport
);
dashboardRoute.get(
  "/get-expense-report",
  authorize,
  dashboardController.getExpenseReport
);
dashboardRoute.get(
  "/get-cash-flow-in",
  authorize,
  dashboardController.getCashFlowIn
);

export default dashboardRoute;
