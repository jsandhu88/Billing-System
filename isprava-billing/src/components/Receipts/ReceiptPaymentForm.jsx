import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  setFormNumber,
  setClientName,
  setDate,
  setParticulars,
  setAmount,
  clearForm,
} from "../../slices/ReceiptPaymentSlice";
import ReceiptModal from "./ReceiptModal";

const ReceiptPaymentForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formNumber = useSelector((state) => state.receiptPayment.formNumber);
  const clientName = useSelector((state) => state.receiptPayment.clientName);
  const date = useSelector((state) => state.receiptPayment.date);
  const particulars = useSelector((state) => state.receiptPayment.particulars);
  const amount = useSelector((state) => state.receiptPayment.amount);

  const location = useLocation();
  const type = location.pathname.split("/")[1];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      try {
        // Clear form when component mounts
        dispatch(clearForm());
        // Generate a new form number
        const formNum = Math.floor(Math.random() * 1000);
        dispatch(setFormNumber(`#FN${formNum}`));
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        dispatch(setDate(today));
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Error initializing form");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formData = {
    formNumber: formNumber,
    customerName: clientName,
    issueDate: date,
    particulars: particulars,
    amount: amount,
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "";
      type === "new-payment"
        ? (url = "payment/create-payment")
        : (url = "receipt/create-receipt");

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/${url}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        toast.success(`${type === "new-payment" ? "Payment" : "Receipt"} created successfully!`);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === "new-payment" ? "New Payment" : "New Receipt"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formNumber">
            Form Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="formNumber"
            type="text"
            value={formNumber}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientName">
            Client Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => dispatch(setClientName(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={date}
            onChange={(e) => dispatch(setDate(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="particulars">
            Particulars
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="particulars"
            value={particulars}
            onChange={(e) => dispatch(setParticulars(e.target.value))}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => dispatch(setAmount(e.target.value))}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>

      <ReceiptModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        type={type}
      />
    </div>
  );
};

export default ReceiptPaymentForm;
