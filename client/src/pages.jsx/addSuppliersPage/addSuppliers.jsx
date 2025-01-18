import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import axios from "axios";

const addSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [addres, setAddres] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSupplier = {
        supplierName,
        addres,
        phone,
        contactName,
        contactPhone,
        notes,
      };
      console.log("creating supplier...");
      const res = await axios.post("/supplier/create", newSupplier);
      console.log("supplier created successfully");
      setSupplierName("");
      setAddres("");
      setPhone("");
      setContactName("");
      setContactPhone("");
      setNotes("");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיים ספק עם אותו שם");
      }
      console.error("Error creating supplier: ", error.response?.data || error.message);
    }
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSupplierPhoneNumberChange = (event) => {
    const value = event.target.value;
    // Allow only numbers and "+" at the start
    const validValue = /^\+?\d*$/.test(value);
    if (validValue || value === "") {
      setPhone(value);
    }
  };

  const handleContactPhoneNumberChange = (event) => {
    const value = event.target.value;
    // Allow only numbers and "+" at the start
    const validValue = /^\+?\d*$/.test(value);
    if (validValue || value === "") {
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
              fullWidth
              required
              type="text"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="כתובת"
              value={addres}
              onChange={handleInputChange(setAddres)}
              fullWidth
              required
              type="text"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="טלפון"
              value={phone}
              onChange={handleSupplierPhoneNumberChange}
              fullWidth
              required
              type="tel"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="איש קשר"
              value={contactName}
              onChange={handleInputChange(setContactName)}
              fullWidth
              type="text"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="טלפון איש קשר "
              value={contactPhone}
              onChange={handleContactPhoneNumberChange}
              fullWidth
              type="text"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="הערות "
              value={notes}
              onChange={handleInputChange(setNotes)}
              fullWidth
              type="text"
            />
          </FormControl>
          <Button variant="contained" type="submit" fullWidth>
            אישור
          </Button>
        </form>
      </Box>
    </>
  );
};

export default addSupplier;
