import { configureStore } from "@reduxjs/toolkit";
import invoiceSlice from "../slices/invoiceSlice";
import receiptPaymentSlice from "../slices/ReceiptPaymentSlice";
export const store = configureStore({
  reducer: { invoiceSlice, receiptPayment: receiptPaymentSlice },
});
