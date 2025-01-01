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
  // State variables
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [newSupplier, setNewSupplier] = useState("");

  const [transactionTypes] = useState(["חשבונית", "קבלה", "חשבונית-קבלה"]);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");

  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [receiversTransaction, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [newReceiver, setNewReceiver] = useState("");
  const [openAddReceiverDialog, setOpenAddReceiverDialog] = useState(false);

  const [transactionCategories, setTransactionCategories] = useState([]);
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchReceivers();
    fetchCategory();
  }, []);

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

  const fetchReceivers = async () => {
    try {
      const res = await axios.get("/receivers/get");
      if (Array.isArray(res.data)) {
        setReceivers(res.data);
      } else {
        setReceivers([]);
      }
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get("/transactionCategory/get");
      if (Array.isArray(res.data)) {
        setTransactionCategories(res.data);
      } else {
        setTransactionCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleAddReceiver = async () => {
    try {
      const res = await axios.post("/receivers/create", { receiverName: newReceiver });
      setReceivers((prev) => [...prev, res.data]); // Update receivers list
      setSelectedReceiver(newReceiver); // Set the newly added receiver
      setNewReceiver(""); // Clear input
      setOpenAddReceiverDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error adding new receiver:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const res = await axios.post("/transactionCategory/create", { categoryName: newCategory });
      setTransactionCategories((prev) => [...prev, res.data]); // Update categories list
      setSelectedTransactionCategory(newCategory); // Set the newly added category
      setNewCategory(""); // Clear input
      setOpenAddCategoryDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  const handleRemoveReceiver = async (receiverId) => {
    try {
      await axios.delete(`/receivers/delete/${receiverId}`);
      setReceivers((prev) => prev.filter((receiver) => receiver._id !== receiverId));
      if (selectedReceiver === receiverId) {
        setSelectedReceiver("");
      }
    } catch (error) {
      console.error("Error removing receiver:", error);
    }
  };

  const handleReceiversDialogClose = () => {
    setOpenAddReceiverDialog(false);
    setNewReceiver("");
  };

  const handleCategoryDialogClose = () => {
    setOpenAddCategoryDialog(false);
    setNewCategory("");
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

      const res = await axios.post("/transaction/create", newTransaction);
      console.log("Transaction created successfully:", res.data);

      // Reset form
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
      console.error("Error creating transaction:", error);
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
                setOpenAddReceiverDialog(true);
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

        <Dialog open={openAddReceiverDialog} onClose={handleReceiversDialogClose}>
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
            <Button onClick={handleReceiversDialogClose}>ביטול</Button>
            <Button onClick={handleAddReceiver} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={(event) => {
              if (event.target.value === "add-new") {
                setOpenAddCategoryDialog(true);
              } else {
                setSelectedTransactionCategory(event.target.value);
              }
            }}
            label="קטגוריה"
            required>
            <MenuItem value="" disabled>
              בחר קטגוריה
            </MenuItem>
            {transactionCategories.map((category) => (
              <MenuItem key={category._id} value={category.categoryName}>
                <ListItemIcon>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveReceiver(category._id);
                    }}
                    size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={category.categoryName} />
              </MenuItem>
            ))}
            <MenuItem value="add-new"> הוסף קטגוריה חדשה</MenuItem>
          </Select>
        </FormControl>

        <Dialog open={openAddCategoryDialog} onClose={handleCategoryDialogClose}>
          <DialogTitle>הוסף קטגוריה חדשה</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם הקטגוריה"
              type="text"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose}>ביטול</Button>
            <Button onClick={handleAddCategory} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        <TextField
          label="הערות"
          value={notes}
          onChange={handleInputChange(setNotes)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />

        <Button type="submit" variant="contained" fullWidth>
          שמור
        </Button>
      </form>
    </Box>
  );
};

export default Transaction;
