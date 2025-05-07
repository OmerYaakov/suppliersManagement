import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Dialog,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const TransactionPage = () => {
  const { transactionNumber } = useParams();
  const location = useLocation();
  const transaction = location.state?.transaction;
  const [openImage, setOpenImage] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const baseURL = "http://localhost:5000/public/uploads/";

  if (!transaction) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          No transaction data available.
        </Typography>
      </Box>
    );
  }

  const isImageFile = (filename) => {
    if (!filename) return false;
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename.split("?")[0]);
  };

  const handleImageOpen = (imageUrl) => {
    setOpenImage(imageUrl);
  };

  const handleImageClose = () => {
    setOpenImage(null);
  };

  const handleTransactionNumberUpdate = async () => {
    const trimmed = String(editedNumber).trim();

    if (!trimmed || isNaN(trimmed)) {
      alert("יש להזין מספר חוקי");
      return;
    }

    if (Number(trimmed) === Number(transaction.transactionNumber)) {
      setIsEditingNumber(false);
      return;
    }

    try {
      const res = await axios.patch(
        `/transaction/updateTransactionNumber/${transaction._id}`,
        { newTransactionNumber: Number(trimmed) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("מספר עסקה עודכן בהצלחה");

      // Update local value (in-place to reflect on screen)
      transaction.transactionNumber = Number(trimmed);
      setIsEditingNumber(false);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("מספר עסקה כבר קיים");
      } else {
        console.error("Failed to update transaction number:", error);
        alert("שגיאה בעדכון מספר העסקה");
      }
    }
  };

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
          {Number(transaction.transactionNumber) === 0 ? (
            isEditingNumber ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  size="small"
                  type="number"
                  value={editedNumber}
                  onChange={(e) => setEditedNumber(e.target.value)}
                  placeholder="הכנס מספר חדש"
                />
                <IconButton size="small" onClick={handleTransactionNumberUpdate}>
                  ✅
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6">{transaction.transactionNumber}</Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditedNumber(""); // clear input
                    setIsEditingNumber(true);
                  }}>
                  ✏️
                </IconButton>
              </Box>
            )
          ) : (
            <Typography variant="h6">{transaction.transactionNumber}</Typography>
          )}
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

        {transaction.files.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1" color="textSecondary">
              תמונות מצורפות:
            </Typography>
            <Grid container spacing={10}>
              {transaction.files
                .filter((file) => isImageFile(file?.name))
                .map((file, index) => (
                  <Grid item xs={4} key={index}>
                    <img
                      crossOrigin="anonymous"
                      src={file.url}
                      alt={file.name}
                      onClick={() => handleImageOpen(file.url)}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

        <Dialog open={!!openImage} onClose={handleImageClose} maxWidth="md" fullWidth>
          {openImage && (
            <img
              crossOrigin="anonymous"
              src={openImage}
              alt="Full size"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          )}
        </Dialog>
      </Paper>
    </Box>
  );
};

export default TransactionPage;
