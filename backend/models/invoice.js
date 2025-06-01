import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  items: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.model("Invoice", InvoiceSchema);
