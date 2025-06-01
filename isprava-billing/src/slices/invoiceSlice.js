import { createSlice } from "@reduxjs/toolkit";
import { uid } from "uid";

const validateItem = (item) => {
  if (!item.name || !item.quantity || !item.price) {
    throw new Error("All item fields are required");
  }
  if (isNaN(item.quantity) || item.quantity <= 0) {
    throw new Error("Quantity must be a positive number");
  }
  if (isNaN(item.price) || item.price <= 0) {
    throw new Error("Price must be a positive number");
  }
};

const calculateTotals = (items, discount = 0, gst = 0) => {
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountAmount = (subTotal * discount) / 100;
  const gstAmount = ((subTotal - discountAmount) * gst) / 100;
  const grandTotal = subTotal - discountAmount + gstAmount;
  
  return { subTotal, discountAmount, gstAmount, grandTotal };
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    discount: 0,
    gst: 18,
    invoiceNumber: "",
    issueDate: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    paymentTerms: "",
    paymentMethod: "",
    dueDate: "",
    notes: "",
    subTotal: 0,
    items: [],
    grandTotal: 0,
    error: null,
  },
  reducers: {
    setAllProperties: (state, action) => {
      try {
        const { items, ...rest } = action.payload;
        if (items) {
          items.forEach(validateItem);
        }
        return {
          ...state,
          ...rest,
          items: items || state.items,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error.message,
        };
      }
    },
    setDiscount: (state, action) => {
      const discount = parseFloat(action.payload);
      if (isNaN(discount) || discount < 0) {
        state.error = "Discount must be a non-negative number";
        return;
      }
      state.discount = discount;
      const totals = calculateTotals(state.items, discount, state.gst);
      state.subTotal = totals.subTotal;
      state.grandTotal = totals.grandTotal;
      state.error = null;
    },
    setGST: (state, action) => {
      const gst = parseFloat(action.payload);
      if (isNaN(gst) || gst < 0) {
        state.error = "GST must be a non-negative number";
        return;
      }
      state.gst = gst;
      const totals = calculateTotals(state.items, state.discount, gst);
      state.subTotal = totals.subTotal;
      state.grandTotal = totals.grandTotal;
      state.error = null;
    },
    setInvoiceNumber: (state, action) => {
      state.invoiceNumber = action.payload;
      state.error = null;
    },
    setIssueDate: (state, action) => {
      state.issueDate = action.payload;
      state.error = null;
    },
    setCustomerName: (state, action) => {
      state.customerName = action.payload;
      state.error = null;
    },
    setCustomerEmail: (state, action) => {
      const email = action.payload;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        state.error = "Invalid email format";
        return;
      }
      state.customerEmail = email;
      state.error = null;
    },
    setCustomerPhone: (state, action) => {
      state.customerPhone = action.payload;
      state.error = null;
    },
    setCustomerAddress: (state, action) => {
      state.customerAddress = action.payload;
      state.error = null;
    },
    setPaymentTerms: (state, action) => {
      state.paymentTerms = action.payload;
      state.error = null;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      state.error = null;
    },
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
      state.error = null;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
      state.error = null;
    },
    setSliceItems: (state, action) => {
      try {
        action.payload.forEach(validateItem);
        state.items = action.payload;
        const totals = calculateTotals(action.payload, state.discount, state.gst);
        state.subTotal = totals.subTotal;
        state.grandTotal = totals.grandTotal;
        state.error = null;
      } catch (error) {
        state.error = error.message;
      }
    },
    addItem: (state, action) => {
      try {
        validateItem(action.payload);
        state.items.push(action.payload);
        const totals = calculateTotals(state.items, state.discount, state.gst);
        state.subTotal = totals.subTotal;
        state.grandTotal = totals.grandTotal;
        state.error = null;
      } catch (error) {
        state.error = error.message;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAllProperties,
  setDiscount,
  setGST,
  setInvoiceNumber,
  setIssueDate,
  setCustomerName,
  setCustomerEmail,
  setCustomerPhone,
  setCustomerAddress,
  setPaymentTerms,
  setPaymentMethod,
  setDueDate,
  setNotes,
  setSliceItems,
  addItem,
  clearError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
