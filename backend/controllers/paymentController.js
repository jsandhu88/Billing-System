import mongoose from "mongoose";
import Payment from "../models/payment.js";

const paymentController = {};

paymentController.createPayment = async (req, res) => {
  try {
    const { formNumber, customerName, amount, issueDate, particulars } =
      req.body;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(403).json("User Id is invalid");
    }

    const payment = new Payment({
      formNumber,
      customerName,
      amount,
      issueDate,
      particulars,
      user: userId,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: payment,
      message: "Payment registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

paymentController.getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

paymentController.deletePayment = async (req, res) => {
  try {
    const { receiptId } = req.body;

    const payment = await Payment.findByIdAndDelete(receiptId);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, error: "Payment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default paymentController;
