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
  List,
  ListItem,
  Typography,
  Snackbar,
  Alert as MuiAlert,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const AddTransaction = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [receiversTransaction, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const HiddenInput = styled("input")({ display: "none" });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchSuppliers();
    fetchReceivers();
    fetchCategory();
    fetchTypes();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuppliers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchReceivers = async () => {
    try {
      const res = await axios.get("/receivers/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReceivers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get("/transactionCategory/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactionCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axios.get("/transactionType/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactionTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      formData.append("supplierName", selectedSupplier);
      formData.append("transactionType", selectedTransactionType);
      formData.append("transactionNumber", transactionNumber);
      formData.append("transactionDate", transactionDate);
      formData.append("transactionAmount", transactionAmount);
      formData.append("receivesTransaction", selectedReceiver);
      formData.append("transactionCategory", selectedTransactionCategory);
      formData.append("notes", notes);

      files.forEach((file) => formData.append("file", file));

      if (files.length > 10) {
        setSnackbarMessage("אפשר להעלות עד 10 קבצים.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (selectedTransactionType === "זיכוי" && !transactionAmount.startsWith("-")) {
        setSnackbarMessage("אם בחרת זיכוי הסכום חייב להיות במינוס (לדוגמה: -100)");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (Number(transactionNumber) === 0 && selectedTransactionType !== "קבלה") {
        setSnackbarMessage("רק עסקה מסוג קבלה יכולה להכיל מספר עסקה 0");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      await axios.post("./transaction/create", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      await updateSupplierAmount(selectedSupplier, transactionAmount, selectedTransactionType);

      // Success Snackbar
      setSnackbarMessage("העסקה נוספה בהצלחה");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset form
      setSelectedSupplier("");
      setSelectedTransactionType("");
      setTransactionNumber("");
      setTransactionAmount("");
      setTransactionDate("");
      setSelectedReceiver("");
      setSelectedTransactionCategory("");
      setNotes("");
      setFiles([]);
    } catch (error) {
      if (error.response?.status === 409) {
        setSnackbarMessage("קיימת עסקה עם אותו מספר.");
      } else {
        setSnackbarMessage("שגיאה בהוספת העסקה");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const updateSupplierAmount = async (selectedSupplier, transactionAmount, transactionType) => {
    try {
      const { data: supplierData } = await axios.get("/supplier/getSupplierAmount/", {
        params: { supplierName: selectedSupplier },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const currentAmount = supplierData?.sumAmount || 0;
      let newAmount;

      if (transactionType === "קבלה") {
        newAmount = parseFloat(currentAmount) - parseFloat(transactionAmount);
      } else if (transactionType === "חשבונית-קבלה") {
        newAmount = parseFloat(currentAmount);
      } else {
        newAmount = parseFloat(currentAmount) + parseFloat(transactionAmount);
      }

      await axios.post(
        "/supplier/updateAmount",
        {
          filter: { supplierName: selectedSupplier },
          update: { $set: { sumAmount: newAmount } },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error updating supplier amount:", error.response?.data || error.message);
    }
  };

  const handleTransactionAmountChange = (event) => {
    const value = event.target.value;
    const formattedValue = value.match(/^-?\d*(\.\d{0,2})?$/) ? value : transactionAmount;
    setTransactionAmount(formattedValue);
  };

  const handleTransactionAmountBlur = () => {
    if (transactionAmount) {
      setTransactionAmount(parseFloat(transactionAmount).toFixed(2));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          <InputLabel>סוג עסקה</InputLabel>
          <Select
            value={selectedTransactionType}
            onChange={handleInputChange(setSelectedTransactionType)}
            required>
            <MenuItem value="" disabled>
              בחר סוג עסקה
            </MenuItem>
            {transactionTypes.map((type) => (
              <MenuItem key={type._id} value={type.typeName}>
                {type.typeName}
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
          type="number"
        />

        <TextField
          label="סכום העסקה בשקלים"
          value={transactionAmount}
          onChange={handleTransactionAmountChange}
          onBlur={handleTransactionAmountBlur}
          fullWidth
          margin="normal"
          type="text"
        />

        <TextField
          label="תאריך העסקה"
          value={transactionDate}
          onChange={handleInputChange(setTransactionDate)}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>מקבל העסקה</InputLabel>
          <Select
            value={selectedReceiver}
            onChange={handleInputChange(setSelectedReceiver)}
            required>
            <MenuItem value="" disabled>
              בחר מקבל העסקה
            </MenuItem>
            {receiversTransaction.map((receiver) => (
              <MenuItem key={receiver._id} value={receiver.receiverName}>
                {receiver.receiverName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={handleInputChange(setSelectedTransactionCategory)}
            required>
            <MenuItem value="" disabled>
              בחר קטגוריה
            </MenuItem>
            {transactionCategories.map((cat) => (
              <MenuItem key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
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
          multiline
          rows={2}
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" component="label">
            העלה קבצים
            <HiddenInput type="file" multiple onChange={handleFileChange} />
          </Button>

          <List sx={{ marginTop: 2, maxHeight: 200, overflowY: "auto" }}>
            {files.length > 0 ? (
              files.map((file, index) => (
                <ListItem key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Typography variant="body2">{file.name}</Typography>
                    <IconButton
                      onClick={() => handleDeleteFile(index)}
                      size="small"
                      sx={{ mr: "auto" }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                לא נבחרו קבצים
              </Typography>
            )}
          </List>
        </Box>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          שמור
        </Button>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddTransaction;
