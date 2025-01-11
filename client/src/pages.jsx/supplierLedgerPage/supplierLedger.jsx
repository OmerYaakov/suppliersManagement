import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const SupplierLedger = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionBySupplier, setTransactionBySupplier] = useState([]);
  const [sumAmountSelectedSupplier, setSumAmountSelectedSupplier] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const resetForm = () => {
    setSelectedSupplier("");
    setTransactionType("");
    setTransactionAmount("");
    setTransactionDate("");
  };

  const handleRowClick = () => {};

  //fetch
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get");
      if (Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  //get transaction by supplier
  const getTransactionBySupplier = async (supplierName) => {
    try {
      console.log("get transaction by supplier....");

      // Fetch transactions by supplier
      const res = await axios.get(`/transaction/getBySupplier/`, { params: { supplierName } });
      if (Array.isArray(res.data)) {
        setTransactionBySupplier(res.data);
      } else {
        setTransactionBySupplier([]);
      }

      const resAmount = await axios.get(`/supplier/getSupplierAmount`, {
        params: { supplierName },
      });
      if (resAmount.data && typeof resAmount.data.sumAmount === "number") {
        setSumAmountSelectedSupplier(resAmount.data.sumAmount);
      } else {
        setSumAmountSelectedSupplier(0);
      }
    } catch (error) {
      console.error("Error getting transaction by supplier:", error);
      setTransactionBySupplier([]);
      setSumAmountSelectedSupplier(0);
    }
  };

  const handleSelectChange = (event) => {
    const supplierName = event.target.value;
    setSelectedSupplier(supplierName);
    getTransactionBySupplier(supplierName);
  };

  return (
    <Box sx={{ padding: 3, margin: "0 auto" }}>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <FormControl sx={{ width: "50%", margin: "normal" }}>
          <InputLabel>ספק</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleSelectChange}
            label="Supplier"
            displayEmpty>
            <MenuItem value="" disabled>
              בחר ספק
            </MenuItem>
            {suppliers.map((supplier, index) => (
              <MenuItem key={index} value={supplier.supplierName}>
                {supplier.supplierName}
              </MenuItem>
            ))}
          </Select>
          <h1>סה"כ יתרה: {(Number(sumAmountSelectedSupplier) || 0).toFixed(2)} ₪</h1>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>תאריך</TableCell>
              <TableCell>סוג עסקה</TableCell>
              <TableCell>מספר עסקה</TableCell>
              <TableCell>סכום קבלה</TableCell>
              <TableCell>סכום חשבונית</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionBySupplier.map((transaction, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(transaction)}
                sx={{ cursor: "pointer" }}>
                <TableCell>{transaction.transactionDate}</TableCell>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.transactionNumber}</TableCell>
                <TableCell>
                  {(transaction.transactionType === "קבלה" ||
                    transaction.transactionType === "חשבונית-קבלה") &&
                    `${transaction.transactionAmount} ₪`}
                </TableCell>
                <TableCell
                  style={{
                    color: transaction.transactionType === "זיכוי" ? "red" : "inherit",
                  }}>
                  {(transaction.transactionType === "חשבונית" ||
                    transaction.transactionType === "חשבונית-קבלה" ||
                    transaction.transactionType === "זיכוי") &&
                    `${transaction.transactionAmount} ₪`}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SupplierLedger;
