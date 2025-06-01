import mongoose from "mongoose";
import Invoice from "../models/invoice.js";
import User from "../models/user.js";

const invoiceController = {};

invoiceController.createInvoice = async (req, res) => {
  const data = req.body;
  console.log(req.user.id);
  console.log(req.user, "user");
  const { invoiceNumber } = data;
  if (await Invoice.findOne({ invoiceNumber: invoiceNumber })) {
    return res
      .status(400)
      .json({ message: "Invoice with given number already exists" });
  }
  await Invoice.create({ ...data, user: req.user.id })
    .then(() => {
      res.status(200).json({ message: "Invoice created successfully" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

invoiceController.getAllInvoice = async (req, res) => {
  try {
    const invoiceList = await Invoice.find({ user: req.user.id }).lean().exec();

    res.send(invoiceList);
  } catch {
    res.status(404).json({ message: "User not found or InvoiceList is empty" });
  }
};

invoiceController.getInvoicesCount = async (req, res) => {
  const userId = req.user.id;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid User Id" });
  }
  const invoiceCount = await Invoice.countDocuments({ user: userId });
  res.json(invoiceCount);
};
export default invoiceController;

invoiceController.editInvoice = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  const invoiceId = req.params.id;
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(invoiceId)
  ) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }
  await Invoice.updateOne({ _id: invoiceId }, { ...data, user: userId })
    .then(() => {
      res.status(200).json({ message: "Invoice updated successfully" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

invoiceController.deleteInvoice = async (req, res) => {
  const userId = req.user.id;
  const invoiceId = req.body._id;
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(invoiceId)
  ) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  await Invoice.deleteOne({ _id: invoiceId, user: userId })
    .then(() => {
      res.status(200).json({ message: "Invoice deleted successfully" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
