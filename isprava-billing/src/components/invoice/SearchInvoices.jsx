import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAllProperties } from "../../slices/invoiceSlice";
import toast, { Toaster } from "react-hot-toast";
import InvoiceModal from "./invoiceComponents/InvoiceModal";

const SearchInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceNumberFilter, setInvoiceNumberFilter] = useState("");
  const [issueDateFilter, setIssueDateFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/invoice/getAllInvoice`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleClick = (invoiceId) => {
    const selectedInvoice = invoices.find(
      (invoice) => invoice._id === invoiceId
    );
    setInvoice(selectedInvoice);
    setIsOpen(true);
  };

  const handleEdit = (invoiceId) => {
    const selectedInvoice = invoices.find(
      (invoice) => invoice._id === invoiceId
    );
    dispatch(setAllProperties(selectedInvoice));
    navigate(`/invoice/${invoiceId}`);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInvoiceNumberFilter = (e) => {
    setInvoiceNumberFilter(e.target.value);
  };

  const handleIssueDateFilter = (e) => {
    setIssueDateFilter(e.target.value);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_LINK}/invoice/deleteInvoice/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            _id: invoiceId,
          },
        }
      );
      toast.success("Invoice Deleted Successfully");
      const newInvoices = invoices.filter(
        (invoice) => invoice._id !== invoiceId
      );
      setInvoices(newInvoices);
    } catch (error) {
      toast.error("Error deleting invoice");
      console.error("Error deleting invoice:", error);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesInvoiceNumber = invoice.invoiceNumber
      .toString()
      .includes(invoiceNumberFilter);
    const matchesIssueDate = invoice.invoiceDate.includes(issueDateFilter);
    const matchesSearchTerm =
      invoice.invoiceNumber.toString().includes(searchTerm) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceDate.includes(searchTerm) ||
      invoice.grandTotal.toString().includes(searchTerm);
    return matchesInvoiceNumber && matchesIssueDate && matchesSearchTerm;
  });

  return (
    <div>
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={handleSearch}
          className="md:w-[60vw] p-2 m-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
        />
        <input
          type="text"
          placeholder="Filter by Invoice Number..."
          value={invoiceNumberFilter}
          onChange={handleInvoiceNumberFilter}
          className="md:w-[30vw] p-2 m-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
        />
        <input
          type="date"
          placeholder="Filter by Issue Date..."
          value={issueDateFilter}
          onChange={handleIssueDateFilter}
          className="md:w-[30vw] p-2 m-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
        />
      </div>
      {filteredInvoices.map((invoice) => (
        <div
          key={invoice._id}
          className="flex justify-between items-center m-4 p-4 border border-green-500 rounded-md shadow-sm cursor-pointer"
        >
          <div>
            <p className="font-bold">Invoice Number: {invoice.invoiceNumber}</p>
            <p>Customer Name: {invoice.customerName}</p>
            <p>Invoice Date: {invoice.invoiceDate}</p>
            <p>Grand Total: ₹{invoice.grandTotal}</p>
          </div>
          <div>
            <button
              onClick={() => handleClick(invoice._id)}
              className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 transition-all duration-200"
            >
              View
            </button>
            <button
              onClick={() => handleEdit(invoice._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-all duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteInvoice(invoice._id)}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md m-2 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {isOpen && (
        <InvoiceModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          invoiceInfo={{
            invoiceNumber: invoice.invoiceNumber,
            issueDate: invoice.invoiceDate,
            customerName: invoice.customerName,
            subtotal: invoice.subtotal,
            taxRate: invoice.gst,
            discountRate: invoice.discount,
            total: invoice.grandTotal,
          }}
          onAddNextInvoice={null}
          onCloseModal={handleCloseModal}
          items={invoice.items}
        />
      )}
      <Toaster />
    </div>
  );
};

export default SearchInvoices;
