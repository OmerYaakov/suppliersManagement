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
  const totalSumAmount = suppliers.reduce((acc, curr) => acc + (curr.sumAmount || 0), 0);

  return (
    <>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: totalSumAmount < 0 ? "red" : "green", fontWeight: "bold", marginTop: 2 }}>
        סך הכל יתרה של כל הספקים: {totalSumAmount.toFixed(2)} ₪
      </Typography>

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
