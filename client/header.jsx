import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logout from "./src/components/logout";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const isLoggedIn = localStorage.getItem("profile");

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("profile"));
      setUserEmail(profile?.email || null);
    } catch {
      setUserEmail(null);
    }
  }, []);

  if (location.pathname === "/login") return null;

  const isAdmin = userEmail === process.env.ADMIN_EMAIL; // Replace with your actual admin email

  return (
    <header className="p-3 text-bg-primary">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between ">
          <span className="fs-4">מערכת לניהול ספקים</span>

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
            {isAdmin && (
              <li>
                <a href="/admin/dashboard" className="nav-link px-2 text-warning fw-bold">
                  Dashboard
                </a>
              </li>
            )}
          </ul>

          <div className="text-end">
            {!isLoggedIn ? (
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={() => navigate("/login")}>
                התחברות
              </button>
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

export default Header;
