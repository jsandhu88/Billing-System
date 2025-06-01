import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "../slices/invoiceSlice";
import receiptPaymentReducer from "../slices/ReceiptPaymentSlice";

export const store = configureStore({
  reducer: {
    invoiceSlice: invoiceReducer,
    receiptPayment: receiptPaymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
}); 