import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const handleChange = (id, field, value) => {
    setSuppliers((prev) => prev.map((s) => (s._id === id ? { ...s, [field]: value } : s)));
  };

  const handleSave = async (supplier) => {
    const { _id, supplierName, ...editableFields } = supplier;
    try {
      await axios.put(`/supplier/update/${_id}`, editableFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("עודכן בהצלחה");
    } catch (err) {
      console.error("Update failed:", err);
      alert("שגיאה בעדכון הספק");
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: "95%",
        mx: "auto",
        overflowX: "auto",
      }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>שם ספק</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>כתובת</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>טלפון</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>איש קשר</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>טלפון איש קשר</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>יתרה</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>הערות</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>שמירה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map((s, index) => (
            <TableRow
              key={s._id}
              sx={{
                backgroundColor: index % 2 ? "#fafafa" : "white",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}>
              <TableCell sx={{ textAlign: "center" }}>{s.supplierName}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TextField
                  value={s.addres}
                  onChange={(e) => handleChange(s._id, "addres", e.target.value)}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TextField
                  value={s.phone}
                  onChange={(e) => handleChange(s._id, "phone", e.target.value)}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TextField
                  value={s.contactName || ""}
                  onChange={(e) => handleChange(s._id, "contactName", e.target.value)}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TextField
                  value={s.contactPhone || ""}
                  onChange={(e) => handleChange(s._id, "contactPhone", e.target.value)}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  color: String(s.sumAmount).includes("-") ? "red" : "black",
                }}>
                {Number(s.sumAmount).toFixed(2)}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TextField
                  value={s.notes || ""}
                  onChange={(e) => handleChange(s._id, "notes", e.target.value)}
                  multiline
                  minRows={2}
                  maxRows={4}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Button onClick={() => handleSave(s)} variant="contained">
                  שמור
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageSuppliers;
