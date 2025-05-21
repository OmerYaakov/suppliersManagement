import React, { useState } from "react";
import { TextField, Button, FormControl, Box, Snackbar, Alert as MuiAlert } from "@mui/material";
import axios from "axios";

const AddSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [addres, setAddres] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbarMessage("You are not logged in.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const newSupplier = {
        supplierName,
        addres,
        phone,
        contactName,
        contactPhone,
        notes,
      };

      const res = await axios.post("/supplier/create", newSupplier, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success snackbar
      setSnackbarMessage("הספק נוסף בהצלחה");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset form
      setSupplierName("");
      setAddres("");
      setPhone("");
      setContactName("");
      setContactPhone("");
      setNotes("");
    } catch (error) {
      let message = "קיימת שגיאה בהוספת הספק. אנא נסה שוב.";
      if (error.response?.status === 409) {
        message = "קיים ספק עם אותו שם. אנא בחר שם אחר.";
      } else if (error.response?.status === 401) {
        message = "שגיאה בהתחברות. אנא התחבר שוב.";
      } else if (error.response?.status === 500) {
        message = "שגיאה פנימית בשרת. אנא נסה שוב מאוחר יותר.";
      }

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating supplier:", error.response?.data || error.message);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSupplierPhoneNumberChange = (event) => {
    const value = event.target.value;
    if (/^\+?\d*$/.test(value) || value === "") {
      setPhone(value);
    }
  };

  const handleContactPhoneNumberChange = (event) => {
    const value = event.target.value;
    if (/^\+?\d*$/.test(value) || value === "") {
      setContactPhone(value);
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
        <h1>הוספת ספק חדש</h1>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="שם הספק"
              value={supplierName}
              onChange={handleInputChange(setSupplierName)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="כתובת"
              value={addres}
              onChange={handleInputChange(setAddres)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="טלפון"
              value={phone}
              onChange={handleSupplierPhoneNumberChange}
              required
              type="tel"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="איש קשר"
              value={contactName}
              onChange={handleInputChange(setContactName)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="טלפון איש קשר"
              value={contactPhone}
              onChange={handleContactPhoneNumberChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="הערות" value={notes} onChange={handleInputChange(setNotes)} />
          </FormControl>
          <Button variant="contained" type="submit" fullWidth>
            אישור
          </Button>
        </form>
      </Box>

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
    </>
  );
};

export default AddSupplier;
