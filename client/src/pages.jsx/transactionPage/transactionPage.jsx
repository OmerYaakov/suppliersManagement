import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography, Paper, Divider } from "@mui/material";

const TransactionPage = () => {
  const { transactionNumber } = useParams();
  const location = useLocation();
  const transaction = location.state?.transaction;

  if (!transaction) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          No transaction data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "20px auto" }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          פרטי העסקה
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            ספק:
          </Typography>
          <Typography variant="h6">{transaction.supplierName}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            מספר עסקה:
          </Typography>
          <Typography variant="h6">{transactionNumber}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            תאריך:
          </Typography>
          <Typography variant="h6">{transaction.transactionDate}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            סוג:
          </Typography>
          <Typography variant="h6">{transaction.transactionType}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            סכום העסקה בשקלים:
          </Typography>
          <Typography
            variant="h6"
            color={transaction.transactionType === "זיכוי" ? "error" : "primary"}>
            {transaction.transactionAmount} ₪
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            מקבל העסקה:
          </Typography>
          <Typography variant="h6">{transaction.receivesTransaction}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            קטגוריה:
          </Typography>
          <Typography variant="h6">{transaction.transactionCategory}</Typography>
        </Box>

        {transaction.notes && (
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              הערות:
            </Typography>
            <Typography variant="body1">{transaction.notes}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionPage;
