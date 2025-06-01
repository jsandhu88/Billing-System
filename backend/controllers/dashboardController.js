import Invoice from "../models/invoice.js";
import Receipt from "../models/receipt.js";
import Payment from "../models/payment.js";

const dashboardController = {};

dashboardController.getSalesReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await Invoice.find({ user: userId });

    const totalSales = invoices.reduce(
      (acc, invoice) => acc + invoice.grandTotal,
      0
    );

    return res.json({ totalSales });
  } catch (error) {
    console.error("Error in getSalesReport:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

dashboardController.getExpenseReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId });

    const totalExpenses = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    return res.json({ totalExpenses });
  } catch (error) {
    console.error("Error in getExpenseReport:", error);
    return res(500).json({ error: "Internal server error" });
  }
};

dashboardController.getCashFlowIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const receipts = await Receipt.find({ user: userId });

    const totalCashFlowIn = receipts.reduce(
      (acc, receipt) => acc + receipt.amount,
      0
    );

    return res.json({ totalCashFlowIn });
  } catch (error) {
    console.error("Error in getCashFlowIn:", error);
    return res(500).json({ error: "Internal server error" });
  }
};

export default dashboardController;
