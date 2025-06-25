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

  const [newType, setNewType] = useState("");
  const [openAddTypeDialog, setOpenAddTypeDialog] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

  const [newReceiver, setNewReceiver] = useState("");
  const [openAddReceiverDialog, setOpenAddReceiverDialog] = useState(false);

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

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚨 handleSubmit triggered");
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
        return showSnackbar("אפשר להעלות עד 10 קבצים.", "error");
      }

      if (selectedTransactionType === "זיכוי" && !transactionAmount.startsWith("-")) {
        return showSnackbar("אם בחרת זיכוי הסכום חייב להיות במינוס (לדוגמה: -100)", "error");
      }

      if (Number(transactionNumber) === 0 && selectedTransactionType !== "קבלה") {
        return showSnackbar("רק עסקה מסוג קבלה יכולה להכיל מספר עסקה 0", "error");
      }

      console.log("📤 Submitting transaction...");
      for (let pair of formData.entries()) {
        console.log("🔹", pair[0], pair[1]);
      }

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
        if (error.response) {
          console.error("Server responded with:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("No response received. Request was:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
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
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (error) {
      console.error("Error updating supplier amount:", error);
    }
  };

  const handleTransactionAmountChange = (e) => {
    const value = e.target.value;
    if (/^-?\d*(\.\d{0,2})?$/.test(value)) setTransactionAmount(value);
  };

  const handleTransactionAmountBlur = () => {
    if (transactionAmount) {
      setTransactionAmount(parseFloat(transactionAmount).toFixed(2));
    }
  };

  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const handleDeleteFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddItem = async (endpoint, value, setList, setSelected, setDialog, resetInput) => {
    try {
      const res = await axios.post(endpoint, value, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setList((prev) => [...prev, res.data]);
      setSelected(Object.values(res.data)[1]); // e.g., receiverName or categoryName
      resetInput("");
      setDialog(false);
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleRemoveType = async (id, name) => {
    try {
      await axios.delete(`/transactionType/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactionTypes((prev) => prev.filter((t) => t._id !== id));
      if (selectedTransactionType === name) setSelectedTransactionType("");
    } catch (error) {
      console.error("שגיאה במחיקת סוג עסקה:", error);
    }
  };

  const handleRemoveCategory = async (id, name) => {
    try {
      await axios.delete(`/transactionCategory/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactionCategories((prev) => prev.filter((c) => c._id !== id));
      if (selectedTransactionCategory === name) setSelectedTransactionCategory("");
    } catch (error) {
      console.error("שגיאה במחיקת קטגוריה:", error);
    }
  };

  const handleRemoveReceiver = async (id, name) => {
    try {
      await axios.delete(`/receivers/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReceivers((prev) => prev.filter((r) => r._id !== id));
      if (selectedReceiver === name) setSelectedReceiver("");
    } catch (error) {
      console.error("שגיאה במחיקת מקבל:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <h1>הוספת עסקה חדשה</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>ספק</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleInputChange(setSelectedSupplier)}
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

        <FormControl fullWidth margin="normal">
          <InputLabel>סוג עסקה</InputLabel>
          <Select
            value={selectedTransactionType}
            onChange={(e) =>
              e.target.value === "add"
                ? setOpenAddTypeDialog(true)
                : setSelectedTransactionType(e.target.value)
            }
            required>
            <MenuItem value="" disabled>
              בחר סוג
            </MenuItem>
            {transactionTypes.map((type) => (
              <MenuItem key={type._id} value={type.typeName}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <ListItemText primary={type.typeName} />
                  {selectedTransactionType !== type.typeName && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveType(type._id, type.typeName);
                      }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </MenuItem>
            ))}
            <MenuItem value="add">+ הוסף סוג עסקה חדש</MenuItem>
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
          label="סכום העסקה"
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
            onChange={(e) =>
              e.target.value === "add"
                ? setOpenAddReceiverDialog(true)
                : setSelectedReceiver(e.target.value)
            }
            required>
            <MenuItem value="" disabled>
              בחר מקבל
            </MenuItem>
            {receiversTransaction.map((receiver) => (
              <MenuItem key={receiver._id} value={receiver.receiverName}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <ListItemText primary={receiver.receiverName} />
                  {selectedReceiver !== receiver.receiverName && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveReceiver(receiver._id, receiver.receiverName);
                      }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </MenuItem>
            ))}

            <MenuItem value="add">+ הוסף מקבל חדש</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={(e) =>
              e.target.value === "add"
                ? setOpenAddCategoryDialog(true)
                : setSelectedTransactionCategory(e.target.value)
            }
            required>
            <MenuItem value="" disabled>
              בחר קטגוריה
            </MenuItem>
            {transactionCategories.map((cat) => (
              <MenuItem key={cat._id} value={cat.categoryName}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <ListItemText primary={cat.categoryName} />
                  {selectedTransactionCategory !== cat.categoryName && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(cat._id, cat.categoryName);
                      }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </MenuItem>
            ))}

            <MenuItem value="add">+ הוסף קטגוריה חדשה</MenuItem>
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
            {files.map((file, i) => (
              <ListItem key={i}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Typography variant="body2">{file.name}</Typography>
                  <IconButton onClick={() => handleDeleteFile(i)} size="small" sx={{ mr: "auto" }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => console.log("🖱️ Save button clicked")}>
          שמור
        </Button>
      </form>

      {/* דיאלוגים */}
      <Dialog open={openAddTypeDialog} onClose={() => setOpenAddTypeDialog(false)}>
        <DialogTitle>הוסף סוג עסקה</DialogTitle>
        <DialogContent>
          <TextField value={newType} onChange={handleInputChange(setNewType)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddTypeDialog(false)}>ביטול</Button>
          <Button
            onClick={() =>
              handleAddItem(
                "/transactionType/create",
                { typeName: newType },
                setTransactionTypes,
                setSelectedTransactionType,
                setOpenAddTypeDialog,
                setNewType
              )
            }
            variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddCategoryDialog} onClose={() => setOpenAddCategoryDialog(false)}>
        <DialogTitle>הוסף קטגוריה</DialogTitle>
        <DialogContent>
          <TextField value={newCategory} onChange={handleInputChange(setNewCategory)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCategoryDialog(false)}>ביטול</Button>
          <Button
            onClick={() =>
              handleAddItem(
                "/transactionCategory/create",
                { categoryName: newCategory },
                setTransactionCategories,
                setSelectedTransactionCategory,
                setOpenAddCategoryDialog,
                setNewCategory
              )
            }
            variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddReceiverDialog} onClose={() => setOpenAddReceiverDialog(false)}>
        <DialogTitle>הוסף מקבל</DialogTitle>
        <DialogContent>
          <TextField value={newReceiver} onChange={handleInputChange(setNewReceiver)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddReceiverDialog(false)}>ביטול</Button>
          <Button
            onClick={() =>
              handleAddItem(
                "/receivers/create",
                { receiverName: newReceiver },
                setReceivers,
                setSelectedReceiver,
                setOpenAddReceiverDialog,
                setNewReceiver
              )
            }
            variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

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
