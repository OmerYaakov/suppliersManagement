import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Snackbar,
  Alert as MuiAlert,
  styled,
  Typography,
} from "@mui/material";
import axios from "axios";
import api from "../../api.js";

const HiddenInput = styled("input")({ display: "none" });

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchData("/supplier/get", setSuppliers);
    fetchData("/receivers/get", setReceivers);
    fetchData("/transactionCategory/get", setTransactionCategories);
    fetchData("/transactionType/get", setTransactionTypes);
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setter(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚨 handleSubmit triggered");

    if (!selectedSupplier) return showSnackbar("יש לבחור ספק", "error");
    if (!selectedReceiver) return showSnackbar("יש לבחור מקבל עסקה", "error");
    if (!selectedTransactionCategory) return showSnackbar("יש לבחור קטגוריה", "error");
    if (!selectedTransactionType) return showSnackbar("יש לבחור סוג עסקה", "error");

    if (selectedTransactionType === "זיכוי" && !transactionAmount.startsWith("-")) {
      return showSnackbar("אם בחרת זיכוי הסכום חייב להיות במינוס (לדוגמה: -100)", "error");
    }
    if (Number(transactionNumber) === 0 && selectedTransactionType !== "קבלה") {
      return showSnackbar("רק עסקה מסוג קבלה יכולה להכיל מספר עסקה 0", "error");
    }
    if (files.length > 10) return showSnackbar("אפשר להעלות עד 10 קבצים.", "error");

    const formData = new FormData();
    formData.append("supplierName", selectedSupplier);
    formData.append("transactionType", selectedTransactionType);
    formData.append("transactionNumber", transactionNumber);
    formData.append("transactionDate", transactionDate);
    formData.append("transactionAmount", transactionAmount);
    formData.append("receivesTransaction", selectedReceiver);
    formData.append("transactionCategory", selectedTransactionCategory);
    formData.append("notes", notes);
    files.forEach((file) => formData.append("file", file));

    try {
      console.log("📤 Submitting transaction...");
      await axios.post("/transaction/create", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      await updateSupplierAmount(selectedSupplier, transactionAmount, selectedTransactionType);
      resetForm();
      showSnackbar("העסקה נוספה בהצלחה", "success");
    } catch (error) {
      if (error.response?.status === 409) {
        showSnackbar("קיימת עסקה עם אותו מספר.", "error");
      } else {
        console.error("❌ Upload failed:", error);
        showSnackbar("שגיאה בהוספת העסקה", "error");
      }
    }
  };

  const resetForm = () => {
    setSelectedSupplier("");
    setSelectedTransactionType("");
    setTransactionNumber("");
    setTransactionAmount("");
    setTransactionDate("");
    setSelectedReceiver("");
    setSelectedTransactionCategory("");
    setNotes("");
    setFiles([]);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const updateSupplierAmount = async (supplierName, amount, type) => {
    try {
      const { data } = await axios.get("/supplier/getSupplierAmount/", {
        params: { supplierName },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const current = data?.sumAmount || 0;
      let newAmount =
        type === "קבלה"
          ? current - amount
          : type === "חשבונית-קבלה"
          ? current
          : current + parseFloat(amount);

      await axios.post(
        "/supplier/updateAmount",
        {
          filter: { supplierName },
          update: { $set: { sumAmount: newAmount } },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error updating supplier amount:", error);
    }
  };

  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const handleDeleteFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <h1>הוספת עסקה חדשה</h1>
      <FormControl fullWidth margin="normal">
        <InputLabel>ספק</InputLabel>
        <Select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          required>
          <MenuItem value="" disabled>
            בחר ספק
          </MenuItem>
          {suppliers.map((s) => (
            <MenuItem key={s._id} value={s.supplierName}>
              {s.supplierName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="מספר עסקה"
        value={transactionNumber}
        onChange={(e) => setTransactionNumber(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="סכום העסקה"
        value={transactionAmount}
        onChange={(e) => setTransactionAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="תאריך העסקה"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{ shrink: true }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>מקבל</InputLabel>
        <Select
          value={selectedReceiver}
          onChange={(e) => setSelectedReceiver(e.target.value)}
          required>
          <MenuItem value="" disabled>
            בחר מקבל
          </MenuItem>
          {receiversTransaction.map((r) => (
            <MenuItem key={r._id} value={r.receiverName}>
              {r.receiverName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>קטגוריה</InputLabel>
        <Select
          value={selectedTransactionCategory}
          onChange={(e) => setSelectedTransactionCategory(e.target.value)}
          required>
          <MenuItem value="" disabled>
            בחר קטגוריה
          </MenuItem>
          {transactionCategories.map((c) => (
            <MenuItem key={c._id} value={c.categoryName}>
              {c.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>סוג עסקה</InputLabel>
        <Select
          value={selectedTransactionType}
          onChange={(e) => setSelectedTransactionType(e.target.value)}
          required>
          <MenuItem value="" disabled>
            בחר סוג עסקה
          </MenuItem>
          {transactionTypes.map((t) => (
            <MenuItem key={t._id} value={t.typeName}>
              {t.typeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="הערות"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
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
        {files.map((file, index) => (
          <Box key={index} display="flex" justifyContent="space-between">
            <Typography>{file.name}</Typography>
            <Button onClick={() => handleDeleteFile(index)}>מחק</Button>
          </Box>
        ))}
      </Box>
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        שמור
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
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
