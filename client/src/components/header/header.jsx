import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logout from "../logout";
import { BorderAll } from "@mui/icons-material";
import "../header/header.css";

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

          <a
            href="/AddTransaction"
            className={`nav-link-bordered ${
              location.pathname === "/AddTransaction" ? "active" : ""
            }`}>
            הוספת עסקה
          </a>
          <a
            href="/AddSupplier"
            className={`nav-link-bordered ${location.pathname === "/AddSupplier" ? "active" : ""}`}>
            הוספת ספק
          </a>
          <a
            href="/manageSuppliers"
            className={`nav-link-bordered ${
              location.pathname === "/manageSuppliers" ? "active" : ""
            }`}>
            ניהול ספקים
          </a>
          <a
            href="/supplierBalances"
            className={`nav-link-bordered ${
              location.pathname === "/supplierBalances" ? "active" : ""
            }`}>
            יתרות ספקים
          </a>
          <a
            href="/SupplierLedger"
            className={`nav-link-bordered ${
              location.pathname === "/SupplierLedger" ? "active" : ""
            }`}>
            כרטסת ספקים
          </a>
          {isAdmin && (
            <a
              href="/admin/dashboard"
              className={`dashboard-link ${
                location.pathname === "/admin/dashboard" ? "active" : ""
              }`}>
              Dashboard
            </a>
          )}

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
