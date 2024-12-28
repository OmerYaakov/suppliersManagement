import React, { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import axios from "axios";

const Transaction = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState(["חשבונית", "קבלה", "חשבונית-קבלה"]);
  const [reciversTransaction, setRecivers] = useState(["גבי", "חן", "דוידי"]);
  const [transactionCategories, setTransactionCategories] = useState([
    "קניית סחורה",
    "תחזוקה כללית",
    "תשלום צ'ק שאגל",
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedReciver, setSelectedReciver] = useState("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");

  const [newSupplier, setNewSupplier] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get");
      if (Array.isArray(res.data)) {
        setSuppliers(res.data);
        console.log("Fetched suppliers:", res.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  // const handleAddSupplier = () => {
  //   if (newSupplier.trim()) {
  //     setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
  //     setSelectedSupplier(newSupplier);
  //     setNewSupplier("");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        supplierName: selectedSupplier,
        transactionType: selectedTransactionType,
        transactionNumber,
        transactionAmount,
        transactionDate,
        recivesTransaction: selectedReciver,
        transactionCategory: selectedTransactionCategory,
        notes,
      };

      console.log("Creating transaction...", newTransaction);

      const res = await axios.post("/transaction/create", newTransaction);
      console.log("Transaction created successfully:", res.data);
      setSelectedSupplier("");
      setSelectedTransactionType("");
      setTransactionNumber("");
      setTransactionAmount("");
      setTransactionDate("");
      setSelectedReciver("");
      setSelectedTransactionCategory("");
      setNotes("");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיימת עסקה עם אותו מספר.");
      }
      console.error("Error creating transaction: ", error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <h1>הוספת עסקה חדשה</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>ספק</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleInputChange(setSelectedSupplier)}
            label="Supplier"
            required>
            {suppliers.map((supplier, index) => (
              <MenuItem key={index} value={supplier.supplierName}>
                {supplier.supplierName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>סוג העסקה</InputLabel>
          <Select
            value={selectedTransactionType}
            onChange={handleInputChange(setSelectedTransactionType)}
            label="Transaction Type"
            required>
            <MenuItem value="" disabled>
              בחר סוג עסקה
            </MenuItem>
            {transactionTypes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="מספר עסקה"
          value={transactionNumber}
          onChange={handleInputChange(setTransactionNumber)}
          fullWidth
          margin="normal"
          required
          type="number"
        />

        <TextField
          label="סכום העסקה בשקלים"
          value={transactionAmount}
          onChange={handleInputChange(setTransactionAmount)}
          fullWidth
          margin="normal"
          required
          type="number"
        />

        <TextField
          label="תאריך העסקה"
          value={transactionDate}
          onChange={handleInputChange(setTransactionDate)}
          fullWidth
          margin="normal"
          required
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>מקבל העסקה</InputLabel>
          <Select
            value={selectedReciver}
            onChange={handleInputChange(setSelectedReciver)}
            label="מקבל העסקה"
            required>
            <MenuItem value="" disabled>
              בחר מקבל
            </MenuItem>
            {reciversTransaction.map((reciver, index) => (
              <MenuItem key={index} value={reciver}>
                {reciver}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={handleInputChange(setSelectedTransactionCategory)}
            label="קטגוריה"
            required>
            <MenuItem value="" disabled>
              בחר קטגוריה
            </MenuItem>
            {transactionCategories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="הערות"
          value={notes}
          onChange={handleInputChange(setNotes)}
          fullWidth
          margin="normal"
          placeholder="הערות"
        />

        <Button variant="contained" type="submit" fullWidth>
          אישור
        </Button>
      </form>
    </Box>
  );
};

export default Transaction;
