import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
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
  Tooltip,
} from "@mui/material";
import ExcelIcon from "../../assets/ExcelIcon.svg"; // Adjust the path as necessary

const SupplierBalances = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suppliers, setSuppliers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
    if (location.state?.supplierName) {
      setSelectedSupplier(location.state.supplierName);
      getTransactionBySupplier(location.state.supplierName);
    }
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
      <Tooltip title="ייצוא כל עסקאות הספקים לאקסל" arrow>
        <Button
          variant="contained"
          endIcon={<img src={ExcelIcon} alt="Excel" width="20" />}
          sx={{ display: "block", mx: "auto", mt: 5, mb: 2 }}
          hint
          onClick={async () => {
            try {
              const res = await api.get("/transaction/exportAllTransactions", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                responseType: "blob",
              });

              const blob = new Blob([res.data], {
                type: res.headers["content-type"],
              });

              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "transactions.xlsx";
              a.click();
            } catch (error) {
              console.error("Error downloading Excel file:", error);
            }
          }}></Button>
      </Tooltip>
      <Typography
        variant="h5"
        align="center"
        sx={{
          color: totalSumAmount < 0 ? "red" : "green",
          fontWeight: "bold",
          marginTop: 2,
        }}>
        סך הכל יתרה של כל הספקים:{" "}
        {totalSumAmount.toLocaleString("he-IL", {
          style: "currency",
          currency: "ILS",
          minimumFractionDigits: 2,
        })}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 4, borderRadius: 2, maxWidth: "95%", mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>שם ספק</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>יתרה</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>כרטסת ספק</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s._id}>
                <TableCell sx={{ textAlign: "center" }}>{s.supplierName}</TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: s.sumAmount < 0 ? "red" : "inherit",
                    fontWeight: "bold",
                  }}>
                  {(s.sumAmount || 0).toLocaleString("he-IL", {
                    style: "currency",
                    currency: "ILS",
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    onClick={() =>
                      navigate("/supplierLedger", {
                        state: { supplierName: s.supplierName },
                      })
                    }
                    variant="outlined">
                    כניסה לכרטסת
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

export default SupplierBalances;
