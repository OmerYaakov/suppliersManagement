import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Transaction = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState(["חשבונית", "קבלה", "חשבונית-קבלה"]);
  const [receiversTransaction, setReceivers] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([
    "קניית סחורה",
    "תחזוקה כללית",
    "תשלום צ'ק שאגל",
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");

  const [newSupplier, setNewSupplier] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [newReceiver, setNewReceiver] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchReceivers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get");
      if (Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  };

  const fetchReceivers = async () => {
    try {
      const res = await axios.get("/receivers/get");
      if (Array.isArray(res.data)) {
        setReceivers(res.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setReceivers([]);
      }
    } catch (error) {
      console.error("Error fetching receivers:", error);
      setReceivers([]);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleAddReceiver = async () => {
    try {
      const res = await axios.post("/receivers/create", { receiverName: newReceiver });
      console.log("New receiver added:", res.data);

      // Update the receiver list with the new receiver
      setReceivers((prev) => [...prev, res.data]);
      setSelectedReceiver(newReceiver); // Set the new receiver as the selected value
      setNewReceiver(""); // Clear the input
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error adding new receiver:", error);
    }
  };

  const handleRemoveReceiver = async (receiverId) => {
    try {
      await axios.delete(`/receivers/delete/${receiverId}`);
      console.log("Receiver removed:", receiverId);

      // Remove the receiver from the list
      setReceivers((prev) => prev.filter((receiver) => receiver._id !== receiverId));

      // Clear the selected receiver if it was the one removed
      if (selectedReceiver === receiverId) {
        setSelectedReceiver("");
      }
    } catch (error) {
      console.error("Error removing receiver:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewReceiver("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        supplierName: selectedSupplier,
        transactionType: selectedTransactionType,
        transactionNumber,
        transactionAmount,
        transactionDate,
        receivesTransaction: selectedReceiver,
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
      setSelectedReceiver("");
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
            <MenuItem value="" disabled>
              בחר ספק
            </MenuItem>
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
            value={selectedReceiver}
            onChange={(event) => {
              if (event.target.value === "add-new") {
                setOpenDialog(true);
              } else {
                setSelectedReceiver(event.target.value);
              }
            }}
            label="מקבל העסקה"
            required>
            <MenuItem value="" disabled>
              בחר מקבל העסקה
            </MenuItem>
            {receiversTransaction.map((receiver) => (
              <MenuItem key={receiver._id} value={receiver.receiverName}>
                <ListItemIcon>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveReceiver(receiver._id);
                    }}
                    size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={receiver.receiverName} />
              </MenuItem>
            ))}
            <MenuItem value="add-new"> הוסף מקבל חדש</MenuItem>
          </Select>
        </FormControl>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>הוסף מקבל חדש</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם המקבל"
              type="text"
              fullWidth
              value={newReceiver}
              onChange={(e) => setNewReceiver(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>ביטול</Button>
            <Button onClick={handleAddReceiver} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

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
