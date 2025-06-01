import mongoose from "mongoose";

const receiptModel = mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  formNumber: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  particulars: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.model("Receipt", receiptModel);
