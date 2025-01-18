import "./App.css";
import Transaction from "./pages.jsx/transactionPage/transaction";
import Supplier from "./pages.jsx/addSuppliersPage/addSuppliers";
import SupplierLedger from "./pages.jsx/supplierLedgerPage/supplierLedger";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000/";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/supplierLedger" element={<SupplierLedger />} />
          <Route path="/" element={<SupplierLedger />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
