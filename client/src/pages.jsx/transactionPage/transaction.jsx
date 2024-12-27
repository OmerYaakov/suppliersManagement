import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";

const Transaction = () => {
  const [suppliers, setSuppliers] = useState(["omer", "yosi", "roi"]);
  const [transactionTypes, setTransactionTypes] = useState([
    "Invoice",
    "Receipt",
    "Invoice-Receipt",
  ]);
  const [recivers, setRecivers] = useState(["Chen", "Gabby", "Davidi"]);
  const [transactionCategories, setTransactionCategories] = useState([
    "Buying-purchase",
    "General-maintenance",
    "Payment by check",
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
      <h1>Add New Transaction</h1>
      <form onSubmit={handleFormSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Supplier</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleInputChange(setSelectedSupplier)}
            label="Supplier"
            required>
            <MenuItem value="" disabled>
              Select a supplier
            </MenuItem>
            {suppliers.map((supplier, index) => (
              <MenuItem key={index} value={supplier}>
                {supplier}
              </MenuItem>
            ))}
            <MenuItem value="add">Add new supplier</MenuItem>
          </Select>
        </FormControl>
        {selectedSupplier === "add" && (
          <div>
            <TextField
              label="New Supplier Name"
              value={newSupplier}
              onChange={handleInputChange(setNewSupplier)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleAddSupplier}>
              Add
            </Button>
          </div>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Transaction Type</InputLabel>
          <Select
            value={selectedTransactionType}
            onChange={handleInputChange(setSelectedTransactionType)}
            label="Transaction Type"
            required>
            <MenuItem value="" disabled>
              Select Transaction Type
            </MenuItem>
            {transactionTypes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Transaction Number"
          value={transactionNumber}
          onChange={handleInputChange(setTransactionNumber)}
          fullWidth
          margin="normal"
          required
          type="number"
        />

        <TextField
          label="Transaction Amount (NIS)"
          value={transactionAmount}
          onChange={handleInputChange(setTransactionAmount)}
          fullWidth
          margin="normal"
          required
          type="number"
        />

        <TextField
          label="Transaction Date"
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
          <InputLabel>Receives the Transaction</InputLabel>
          <Select
            value={selectedReciver}
            onChange={handleInputChange(setSelectedReciver)}
            label="Receives the Transaction"
            required>
            <MenuItem value="" disabled>
              Select Receiver
            </MenuItem>
            {recivers.map((reciver, index) => (
              <MenuItem key={index} value={reciver}>
                {reciver}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Transaction Category</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={handleInputChange(setSelectedTransactionCategory)}
            label="Transaction Category"
            required>
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {transactionCategories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Notes"
          value={notes}
          onChange={handleInputChange(setNotes)}
          fullWidth
          margin="normal"
          placeholder="Add your notes here"
        />

        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Transaction;
