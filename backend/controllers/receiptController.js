import mongoose from "mongoose";
import Receipt from "../models/receipt.js";

const receiptController = {};

receiptController.createReceipt = async (req, res) => {
  try {
    const { formNumber, customerName, amount, issueDate, particulars } =
      req.body;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(403).json("User Id is invalid");
    }

    const receipt = new Receipt({
      formNumber,
      customerName,
      amount,
      issueDate,
      particulars,
      user: userId,
    });

    await receipt.save();

    res.status(201).json({
      success: true,
      data: receipt,
      message: "Receipt created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

receiptController.getReceipts = async (req, res) => {
  try {
    const userId = req.user.id;
    const receipts = await Receipt.find({ user: userId });

    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

receiptController.deleteReceipt = async (req, res) => {
  try {
    const { receiptId } = req.body;

    const receipt = await Receipt.findByIdAndDelete(receiptId);
    if (!receipt) {
      return res
        .status(404)
        .json({ success: false, error: "Receipt not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default receiptController;
