import React from "react";
import AddTransaction from "./src/pages.jsx/addTransactionPage/addTransaction";
import Supplier from "./src/pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./src/pages.jsx/supplierLedgerPage/supplierLedger";
import { useNavigate } from "react-router-dom";
import Login from "./src/pages.jsx/loginPage/login";

const header = () => {
  const navigate = useNavigate();

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

          {/* Login and Sign-up Buttons */}
          <div className="text-end">
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/login")}>
              התחברות
            </button>
            <button type="button" className="btn btn-warning" onClick={() => navigate("/register")}>
              הרשמה
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default header;
