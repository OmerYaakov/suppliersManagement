import "./App.css";
import React from "react";
import AddTransaction from "./pages.jsx/addTransactionPage/addTransaction";
import AddSupplier from "./pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./pages.jsx/supplierLedgerPage/supplierLedger";
import TransactionPage from "./pages.jsx/transactionPage/transactionPage";
import Login from "./pages.jsx/loginPage/login";
import ManageSuppliers from "./pages.jsx/manageSuppliersPage/manageSuppliers";
import EditSupplier from "./pages.jsx/manageSuppliersPage/editSupplier";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import SupplierBalances from "./pages.jsx/manageSuppliersPage/supplierBalances";
import AdminDashboard from "./pages.jsx/adminDashboardPage/adminDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/api";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/addTransaction" element={<AddTransaction />} />
          <Route path="/addSupplier" element={<AddSupplier />} />
          <Route path="/supplierLedger" element={<SupplierLedger />} />
          <Route path="/" element={<SupplierLedger />} />
          <Route path="/login" element={<Login />} />
          <Route path="/supplier/update/:id" element={<EditSupplier />} />

          <Route path="/manageSuppliers" element={<ManageSuppliers />} />
          <Route path="/supplierBalances" element={<SupplierBalances />} />
          <Route path="/transaction/:transactionNumber" element={<TransactionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
