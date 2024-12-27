import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import axios from "axios";

const Transaction = () => {
  const [suppliers, setSuppliers] = useState(["omer", "yosi", "roi"]);
  const [transactionTypes, setTransactionTypes] = useState(["חשבונית", "קבלה", "חשבונית-קבלה"]);
  const [recivers, setRecivers] = useState(["גבי", "חן", "דוידי"]);
  const [transactionCategories, setTransactionCategories] = useState([
    "קניית סחורה",
    "תחזוקה כללית",
    "תשלום צ'ק שאגל",
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedReciver, setSelectedReciver] = useState("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");

  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleAddSupplier = () => {
    if (newSupplier.trim()) {
      setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
      setSelectedSupplier(newSupplier);
      setNewSupplier("");
      setIsAddingSupplier(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    console.log({
      selectedSupplier,
      selectedTransactionType,
      transactionNumber,
      transactionAmount,
      transactionDate,
      selectedReciver,
      selectedTransactionCategory,
      notes,
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <h1>הוספת עסקה חדשה</h1>
      <form onSubmit={handleFormSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>ספק</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleInputChange(setSelectedSupplier)}
            label="Supplier"
            required>
            <MenuItem value="" disabled>
              בחר ספק
            </MenuItem>
            {suppliers.map((supplier, index) => (
              <MenuItem key={index} value={supplier}>
                {supplier}
              </MenuItem>
            ))}
            <MenuItem value="add">הוסף ספק חדש</MenuItem>
          </Select>
        </FormControl>
        {selectedSupplier === "add" && (
          <div>
            <TextField
              label="שם הספק"
              value={newSupplier}
              onChange={handleInputChange(setNewSupplier)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleAddSupplier}>
              הוסף
            </Button>
          </div>
        )}

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
            {recivers.map((reciver, index) => (
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
