import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import InvoiceForm from "./components/invoice/invoiceComponents/InvoiceForm";
import Login from "./components/authComponents/login";
import SearchInvoices from "./components/invoice/SearchInvoices";
import ReceiptPaymentForm from "./components/Receipts/ReceiptPaymentForm";
import ReceiptsPayments from "./components/Receipts/ReceiptsNPayments";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Dashboard />} />
        <Route path="/signup" element={<Dashboard />} />
        <Route path="/new-invoice" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<InvoiceForm />} />
        <Route path="/invoices" element={<SearchInvoices />} />
        <Route path="/new-receipt" element={<ReceiptPaymentForm />} />
        <Route path="/new-payment" element={<ReceiptPaymentForm />} />
        <Route path="/payments" element={<ReceiptsPayments />} />
        <Route path="/receipts" element={<ReceiptsPayments />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
