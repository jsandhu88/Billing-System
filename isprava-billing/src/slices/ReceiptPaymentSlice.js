import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formNumber: "",
  clientName: "",
  date: "",
  particulars: "",
  amount: 0,
};

const receiptPaymentSlice = createSlice({
  name: "receiptPayment",
  initialState,
  reducers: {
    setFormNumber(state, action) {
      state.formNumber = action.payload;
    },
    setClientName(state, action) {
      state.clientName = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setParticulars(state, action) {
      state.particulars = action.payload;
    },
    setAmount(state, action) {
      state.amount = action.payload;
    },
    clearForm(state) {
      state.formNumber = "";
      state.clientName = "";
      state.date = "";
      state.particulars = "";
      state.amount = "";
    },
  },
});

export const {
  setFormNumber,
  setClientName,
  setDate,
  setParticulars,
  setAmount,
  clearForm,
} = receiptPaymentSlice.actions;

export default receiptPaymentSlice.reducer;
