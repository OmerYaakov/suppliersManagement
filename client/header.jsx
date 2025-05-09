import React from "react";
import AddTransaction from "./src/pages.jsx/addTransactionPage/addTransaction";
import Supplier from "./src/pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./src/pages.jsx/supplierLedgerPage/supplierLedger";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./src/pages.jsx/loginPage/login";
import Logout from "./src/components/logout";

const header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("profile") ? true : false;

  if (location.pathname === "/login") {
    return null; // Don't render the header on the login page
  }

  return (
    <header className="p-3 text-bg-primary">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between ">
          <span className="fs-4">מערכת לניהול ספקים</span>

          {/* Navbar Links */}
          <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="/AddTransaction" className="nav-link px-2 text-white">
                הוספת עסקה
              </a>
            </li>
            <li>
              <a href="/AddSupplier" className="nav-link px-2 text-white">
                הוספת ספק
              </a>
            </li>
            <li>
              <a href="/manageSuppliers" className="nav-link px-2 text-white">
                ניהול ספקים
              </a>
            </li>
            <li>
              <a href="/supplierBalances" className="nav-link px-2 text-white">
                יתרות ספקים
              </a>
            </li>
            <li>
              <a href="/SupplierLedger" className="nav-link px-2 text-white">
                כרטסת ספקים
              </a>
            </li>
            {/* <li>
              <a href="#" className="nav-link px-2 text-white">
                ניהול ספקים
              </a>
            </li> */}
          </ul>

          {/* Search Bar */}
          {/* <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input
              type="search"
              className="form-control form-control-dark text-bg-primary"
              placeholder="Search..."
              aria-label="Search"
            />
          </form> */}

          {/* Login and Logout Buttons */}
          <div className="text-end">
            {/* Conditionally render the buttons */}
            {!isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="btn btn-warning me-2"
                  onClick={() => navigate("/login")}>
                  התחברות
                </button>
              </>
            ) : (
              <a onClick={Logout} className="btn btn me-2">
                <Logout />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default header;
