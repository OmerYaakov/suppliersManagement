import "./App.css";
import React from "react";
import AddTransaction from "./pages.jsx/addTransactionPage/addTransaction";
import AddSupplier from "./pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./pages.jsx/supplierLedgerPage/supplierLedger";
import TransactionPage from "./pages.jsx/transactionPage/transactionPage";
import Login from "./pages.jsx/loginPage/login";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "https://supplier-mang.com/api" || "http://localhost:5000";

import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/addTransaction" element={<AddTransaction />} />
          <Route path="/addSupplier" element={<AddSupplier />} />
          <Route path="/supplierLedger" element={<SupplierLedger />} />
          <Route path="/" element={<SupplierLedger />} />
          <Route path="/login" element={<Login />} />

          <Route path="/transaction/:transactionNumber" element={<TransactionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
