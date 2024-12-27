import "./App.css";
import Transaction from "./pages.jsx/transactionPage/transaction";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
