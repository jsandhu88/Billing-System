import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MNavbar from "./MNavbar";
import logo from "../../assets/logo.svg";

const NavBar = () => {
  const [width, setWidth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      {width ? <MNavbar width={width} setWidth={setWidth} /> : null}
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center text-white">
                <span className="mr-2">
                  <img className="h-8 w-auto" src={logo} alt="arc-invoice" />
                </span>
              </NavLink>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Dashboard
                  </NavLink>
                  <div className="relative group">
                    <NavLink 
                      to="/new-invoice" 
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Create
                    </NavLink>
                    <div className="z-30 absolute hidden group-hover:flex flex-col min-w-max p-2 bg-white mt-2 border border-gray-200 shadow-lg -translate-y-3 space-y-2 text-gray-800 rounded-md">
                      <NavLink
                        className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        to="/new-invoice"
                      >
                        New Invoice
                      </NavLink>
                      <NavLink
                        className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        to="/new-payment"
                      >
                        New Payment
                      </NavLink>
                      <NavLink
                        className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        to="/new-receipt"
                      >
                        New Receipt
                      </NavLink>
                    </div>
                  </div>
                  <NavLink 
                    to="/invoices" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Invoices
                  </NavLink>
                  <NavLink 
                    to="/payments" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Payments
                  </NavLink>
                  <NavLink 
                    to="/receipts" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Receipts
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 text-blue-600 bg-white hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
            
            <div className="md:hidden z-50">
              <button
                onClick={() => setWidth((prev) => !prev)}
                className="text-2xl text-white focus:outline-none"
              >
                &#9776;
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
