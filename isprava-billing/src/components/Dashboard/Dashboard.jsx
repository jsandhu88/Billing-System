import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [salesReport, setSalesReport] = useState(0);
  const [expenseReport, setExpenseReport] = useState(0);
  const [cashFlowIn, setCashFlowIn] = useState(0);
  const [cashInHand, setCashInHand] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/signup");
    }
    const fetchReports = async () => {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      try {
        const salesResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/dashboard/get-sales-report`,
          headers
        );
        setSalesReport(salesResponse.data.totalSales);

        const expenseResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/dashboard/get-expense-report`,
          headers
        );
        setExpenseReport(expenseResponse.data.totalExpenses);

        const cashFlowInResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/dashboard/get-cash-flow-in`,
          headers
        );
        setCashFlowIn(cashFlowInResponse.data.totalCashFlowIn);

        setCashInHand(
          cashFlowInResponse.data.totalCashFlowIn -
            expenseResponse.data.totalExpenses
        );
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-[70vh] flex justify-center items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl lg:w-[100vw] mx-auto mt-8">
        <div className="bg-blue-200 p-6 lg:p-12 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Sales Report</h2>
          <p>Total Sales: ₹{salesReport}</p>
        </div>
        <div className="bg-green-200 p-6 lg:p-12 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Expense Report</h2>
          <p>Total Expenses: ₹{expenseReport}</p>
        </div>
        <div className="bg-yellow-200 p-6 lg:p-12 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Cash Flow In</h2>
          <p>Total Cash Flow In: ₹{cashFlowIn}</p>
        </div>
        <div className="bg-pink-200 p-6 lg:p-12 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Cash In Hand</h2>
          <p>Cash In Hand: ₹{cashInHand}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
