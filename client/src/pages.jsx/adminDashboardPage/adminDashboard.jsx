import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import api from "../../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 4, background: theme.palette.grey[100], minHeight: "100vh" }}>
      <Typography variant="h3" gutterBottom textAlign="center" fontWeight={600} color="primary">
        Admin Overview Dashboard 🚀
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>
              {stats.userCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Suppliers
            </Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.supplierCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Transactions
            </Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.totalTransactions}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h4" color="green" fontWeight={700}>
              ₪{stats.totalAmount.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          👤 Users Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[200] }}>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Transactions</TableCell>
                <TableCell align="right">Total Amount (₪)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.userSummaries.map((user, index) => (
                <TableRow key={index} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">{user.transactionCount}</TableCell>
                  <TableCell align="right">{user.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
