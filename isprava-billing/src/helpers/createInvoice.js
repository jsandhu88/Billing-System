import axios from "axios";

export const createInvoice = async (invoiceData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_LINK}/invoice/createInvoice`,
    invoiceData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
