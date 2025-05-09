import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import api from "../../api";

const EditSupplier = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    api
      .get(`/supplier/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSupplier(res.data);
      })
      .catch((err) => {
        console.error("Error fetching supplier:", err);
      });
  }, [id]);

  const handleChange = (field, value) => {
    setSupplier((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { supplierName, sumAmount, _id, ...updatableFields } = supplier;
    try {
      await api.put(`/supplier/update/${id}`, updatableFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("עודכן בהצלחה");
      navigate("/manageSuppliers");
    } catch (err) {
      console.error("Update failed:", err);
      alert("שגיאה בעדכון הספק");
    }
  };

  if (!supplier) return <Typography>טוען...</Typography>;

  const isNegative = String(supplier.sumAmount).includes("-");

  return (
    <Paper sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        עריכת ספק
      </Typography>

      {/* Supplier Name - Bold Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
        {supplier.supplierName}
      </Typography>

      {/* Sum Amount - as colored text */}
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          textAlign: "center",
          color: isNegative ? "red" : "green",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}>
        יתרה:{" "}
        {(Number(supplier.sumAmount) || 0).toLocaleString("he-IL", {
          style: "currency",
          currency: "ILS",
          minimumFractionDigits: 2,
        })}
      </Typography>

      <TextField
        label="כתובת"
        value={supplier.addres || ""}
        onChange={(e) => handleChange("addres", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="טלפון"
        value={supplier.phone || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="איש קשר"
        value={supplier.contactName || ""}
        onChange={(e) => handleChange("contactName", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="טלפון איש קשר"
        value={supplier.contactPhone || ""}
        onChange={(e) => handleChange("contactPhone", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="הערות"
        value={supplier.notes || ""}
        onChange={(e) => handleChange("notes", e.target.value)}
        fullWidth
        multiline
        minRows={2}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleSave}>
        שמירה
      </Button>
    </Paper>
  );
};

export default EditSupplier;
