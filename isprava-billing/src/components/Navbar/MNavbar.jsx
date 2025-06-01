import { NavLink } from "react-router-dom";

function MNavbar(props) {
  return (
    <div
      className={`${
        props.width ? "w-[80vw]" : "w-0"
      } bg-black h-screen absolute overflow-hidden transition-all z-10 Mdirection touch-none md:hidden`}
    >
      <nav className=" flex flex-col justify-evenly items-center mx-3 cursor-pointer h-[80%] pt-5">
        <NavLink to="/dashboard" className="text-white">
          Dashboard
        </NavLink>
        <div className="relative group">
          <NavLink to="/new-invoice" className="text-white">
            Create
          </NavLink>
          <div className="z-30 absolute hidden group-hover:flex flex-col min-w-max p-2 bg-white mt-2 border-2 shadow-md -translate-y-3 space-y-2 text-gray-800 rounded-md ">
            <NavLink
              className=" hover:bg-gray-200 rounded-md"
              to="/new-invoice"
            >
              New Invoice
            </NavLink>
            <NavLink
              className=" hover:bg-gray-200 rounded-md"
              to="/new-payment"
            >
              New Payment
            </NavLink>
            <NavLink
              className=" hover:bg-gray-200 rounded-md"
              to="/new-receipt"
            >
              New Receipt
            </NavLink>
          </div>
        </div>
        <NavLink to="/invoices" className="text-white">
          Invoices
        </NavLink>
        <NavLink to="/payments" className="text-white">
          Payments
        </NavLink>
        <NavLink to="/receipts" className="text-white">
          Receipts
        </NavLink>
      </nav>
    </div>
  );
}
export default MNavbar;
