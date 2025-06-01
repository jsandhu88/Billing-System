import { useState, useEffect } from "react";
import axios from "axios";
import { uid } from "uid";
import toast, { Toaster } from "react-hot-toast";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { createInvoice } from "../../../helpers/createInvoice";
import { useLocation, useParams } from "react-router";
import {
  setDiscount,
  setGST,
  setInvoiceNumber,
  setIssueDate,
  setCustomerName,
  setSliceItems,
  addItem,
  setCustomerEmail,
  setCustomerPhone,
  setCustomerAddress,
  setPaymentTerms,
  setPaymentMethod,
  setDueDate,
  setNotes,
} from "../../../slices/invoiceSlice";
import { useSelector, useDispatch } from "react-redux";
import { getInvoiceNumber } from "../../../helpers/getInvoiceNumber";
import PaymentMethods from "./PaymentMethods";

const date = new Date();
const today = date.toISOString().split('T')[0];

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const discount = useSelector((state) => state.invoiceSlice.discount);
  const tax = useSelector((state) => state.invoiceSlice.gst);
  const invoiceNumber = useSelector((state) => state.invoiceSlice.invoiceNumber);
  const issueDate = useSelector((state) => state.invoiceSlice.issueDate);
  const customerName = useSelector((state) => state.invoiceSlice.customerName);
  const customerEmail = useSelector((state) => state.invoiceSlice.customerEmail);
  const customerPhone = useSelector((state) => state.invoiceSlice.customerPhone);
  const customerAddress = useSelector((state) => state.invoiceSlice.customerAddress);
  const paymentTerms = useSelector((state) => state.invoiceSlice.paymentTerms);
  const paymentMethod = useSelector((state) => state.invoiceSlice.paymentMethod);
  const dueDate = useSelector((state) => state.invoiceSlice.dueDate);
  const notes = useSelector((state) => state.invoiceSlice.notes);
  const items = useSelector((state) => state.invoiceSlice.items);

  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (location.pathname === "/new-invoice") {
          const InvoiceNumber = await getInvoiceNumber();
          dispatch(
            setInvoiceNumber(
              `#${InvoiceNumber + 1}S${Math.floor(Math.random() * 1000)}`
            )
          );
          dispatch(setIssueDate(today));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Error initializing form");
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [dispatch, location.pathname]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + (subtotal * (tax / 100)) - discount;

  const invoice = {
    invoiceNumber: invoiceNumber,
    invoiceDate: issueDate ? new Date(issueDate).toISOString() : new Date().toISOString(),
    customerName: customerName || "Default Customer",
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    paymentTerms: paymentTerms,
    paymentMethod: paymentMethod,
    dueDate: dueDate,
    notes: notes,
    items: items.map(item => ({
      id: item.id,
      name: item.name || "Default Item",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0
    })),
    subtotal: subtotal || 0,
    gst: tax || 0,
    discount: discount || 0,
    grandTotal: total || 0,
  };

  const handleSaveInvoice = async () => {
    const newInvoice = await createInvoice(invoice)
      .then((res) => {
        toast.success(res.message);
        setIsOpen(true);
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message || err.response);
      });
    console.log(newInvoice);
  };

  const handleEditInvoice = async () => {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_LINK}/invoice/editInvoice/${id}`,
        invoice,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsOpen(true);
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message || err.response);
      });
  };

  const reviewInvoiceHandler = (e) => {
    e.preventDefault();
    if (id) {
      handleEditInvoice();
    } else {
      handleSaveInvoice();
    }
  };

  const addNextInvoiceHandler = () => {
    dispatch(setSliceItems([]));
    dispatch(setCustomerName(""));
    dispatch(setCustomerEmail(""));
    dispatch(setCustomerPhone(""));
    dispatch(setCustomerAddress(""));
    dispatch(setPaymentTerms(""));
    dispatch(setPaymentMethod(""));
    dispatch(setDueDate(""));
    dispatch(setNotes(""));
    dispatch(setGST(0));
    dispatch(setDiscount(0));
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <form
        className="relative flex flex-col px-2 md:flex-row"
        onSubmit={reviewInvoiceHandler}
      >
        <div className="my-6 flex-1 space-y-2 rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6">
          <div className="flex flex-col justify-between space-y-2 border-b border-gray-900/10 pb-4 md:flex-row md:items-center md:space-y-0">
            <div className="flex space-x-2">
              <span className="font-bold">Current Date: </span>
              <span>{today}</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-bold" htmlFor="invoiceNumber">
                Invoice Number:
              </label>
              <input
                required
                className="max-w-[130px]"
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                min="1"
                value={invoiceNumber}
                readOnly
              />
            </div>
          </div>
          <h1 className="text-center text-lg font-bold">INVOICE</h1>

          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold">
                Customer Name:
              </label>
              <input
                className="w-full"
                type="text"
                name="customerName"
                id="customerName"
                value={customerName}
                onChange={(e) => dispatch(setCustomerName(e.target.value))}
                required
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-bold">
                Customer Email:
              </label>
              <input
                className="w-full"
                type="email"
                name="customerEmail"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => dispatch(setCustomerEmail(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-bold">
                Customer Phone:
              </label>
              <input
                className="w-full"
                type="tel"
                name="customerPhone"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => dispatch(setCustomerPhone(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="customerAddress" className="block text-sm font-bold">
                Customer Address:
              </label>
              <input
                className="w-full"
                type="text"
                name="customerAddress"
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => dispatch(setCustomerAddress(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-bold">
                Payment Terms:
              </label>
              <select
                className="w-full"
                name="paymentTerms"
                id="paymentTerms"
                value={paymentTerms}
                onChange={(e) => dispatch(setPaymentTerms(e.target.value))}
              >
                <option value="">Select Payment Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-bold">
                Payment Method:
              </label>
              <select
                className="w-full"
                name="paymentMethod"
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="PayPal">PayPal</option>
                <option value="Stripe">Stripe</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <PaymentMethods />

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-bold md:text-base" htmlFor="tax">
                GST rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm"
                  type="number"
                  min="0"
                  name="tax"
                  id="tax"
                  placeholder="GST Rate"
                  value={tax}
                  onChange={(event) =>
                    dispatch(setGST(parseInt(event.target.value)))
                  }
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-bold md:text-base" htmlFor="discount">
                Discount:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm"
                  type="number"
                  min="0"
                  name="discount"
                  id="discount"
                  placeholder="Discount"
                  value={discount}
                  onChange={(event) =>
                    dispatch(setDiscount(parseInt(event.target.value)))
                  }
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  ₹
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-bold md:text-base" htmlFor="notes">
                Notes:
              </label>
              <textarea
                className="w-full bg-white shadow-sm"
                name="notes"
                id="notes"
                value={notes}
                onChange={(e) => dispatch(setNotes(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="basis-1/4 bg-transparent">
          <div className="sticky top-0 z-10 space-y-4 divide-y divide-gray-900/10 pb-8 md:pt-6 md:pl-4">
            <button
              className="w-full rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
              type="submit"
            >
              Save Invoice
            </button>
            <InvoiceModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              invoiceInfo={invoice}
              items={items}
              onAddNextInvoice={addNextInvoiceHandler}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
