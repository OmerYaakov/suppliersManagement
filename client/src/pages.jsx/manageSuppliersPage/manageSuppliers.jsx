import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/supplier/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.suppliers || [];
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ display: "block", mx: "auto", mt: 2 }}
        onClick={async () => {
          try {
            const token = localStorage.getItem("token");
            const res = await api.get("/supplier/exportSuppliers", {
              headers: {
                Authorization: `Bearer ${token}`, // ✅ fix template string
                "Content-Type": "application/json",
              },

              responseType: "blob", // ✅ necessary to handle Excel file
            });

            const blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `suppliers.xlsx`; // ✅ fix filename string
            document.body.appendChild(a);
            a.click();
            a.remove();
          } catch (error) {
            console.error("Export failed:", error);
            alert("שגיאה בייצוא הקובץ");
          }
        }}>
        ייצוא לאקסל
      </Button>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 4, borderRadius: 2, maxWidth: "95%", mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>שם ספק</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>טלפון</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>עריכה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s._id}>
                <TableCell sx={{ textAlign: "center" }}>{s.supplierName}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{s.phone}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button onClick={() => navigate(`/supplier/update/${s._id}`)} variant="outlined">
                    ערוך
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ManageSuppliers;
