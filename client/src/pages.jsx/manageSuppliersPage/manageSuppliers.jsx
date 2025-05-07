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
import api from "../../api";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // const fetchSuppliers = async () => {
  //   try {
  //     const res = await api.get("/supplier/get", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (Array.isArray(res.data)) {
  //       setSuppliers(res.data);
  //     } else if (Array.isArray(res.data.suppliers)) {
  //       setSuppliers(res.data.suppliers);
  //     } else {
  //       console.error("Unexpected response:", res.data);
  //       setSuppliers([]);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch suppliers:", err);
  //   }
  // };

  const fetchSuppliers = async () => {
    if (!token) {
      console.log("No token found, redirecting to login...");
      // Optionally redirect to the login page if the token is not found
      window.location.href = "/login"; // or use navigate() for React Router
      return;
    }

    try {
      const response = await axios.get("/supplier/get", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log("Suppliers fetched:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error.response);
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, redirect to login page
        window.location.href = "/login"; // or use navigate() for React Router
      }
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
