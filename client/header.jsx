import React from "react";
import Transaction from "./src/pages.jsx/transactionPage/transaction";
import Supplier from "./src/pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./src/pages.jsx/supplierLedgerPage/supplierLedger";

const header = () => {
  return (
    <header className="p-3 text-bg-primary">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between ">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Logo">
              <use xlinkHref="#bootstrap" />
            </svg>
            <span className="fs-4">מערכת לניהול ספקים</span>
          </a>

          {/* Navbar Links */}
          <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="/" className="nav-link px-2 text-white">
                בית
              </a>
            </li>
            <li>
              <a href="/Transaction" className="nav-link px-2 text-white">
                הוספת עסקה
              </a>
            </li>
            <li>
              <a href="/Supplier" className="nav-link px-2 text-white">
                הוספת ספק
              </a>
            </li>
            <li>
              <a href="SupplierLedger" className="nav-link px-2 text-white">
                כרטסת ספקים
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-white">
                ניהול ספקים
              </a>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input
              type="search"
              className="form-control form-control-dark text-bg-primary"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          {/* Login and Sign-up Buttons */}
          <div className="text-end">
            <button type="button" className="btn btn-outline-light me-2">
              Login
            </button>
            <button type="button" className="btn btn-warning">
              Sign-up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default header;
