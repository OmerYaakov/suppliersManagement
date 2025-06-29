import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Dialog,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const TransactionPage = () => {
  const { transactionNumber } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");
  const [isEditingNumber, setIsEditingNumber] = useState(false);

  const [editedFiles, setEditedFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`/transaction/getByNumber/${transactionNumber}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTransaction(res.data);
        setEditedFiles(res.data.files || []);
      } catch (err) {
        console.error("❌ Failed to fetch transaction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionNumber]);

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h6">טוען נתוני עסקה...</Typography>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          עסקה לא נמצאה
        </Typography>
      </Box>
    );
  }

  const isImageFile = (filename) => {
    if (!filename) return false;
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename.split("?")[0]);
  };

  const handleImageOpen = (imageUrl) => setOpenImage(imageUrl);
  const handleImageClose = () => setOpenImage(null);

  const handleTransactionNumberUpdate = async () => {
    const trimmed = String(editedNumber).trim();
    if (!trimmed || isNaN(trimmed)) return alert("יש להזין מספר חוקי");
    if (Number(trimmed) === Number(transaction.transactionNumber)) {
      setIsEditingNumber(false);
      return;
    }

    try {
      await axios.patch(
        `/transaction/updateTransactionNumber/${transaction._id}`,
        { newTransactionNumber: Number(trimmed) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("מספר עסקה עודכן בהצלחה");
      setTransaction((prev) => ({ ...prev, transactionNumber: Number(trimmed) }));
      setIsEditingNumber(false);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("מספר עסקה כבר קיים");
      } else {
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
                    setEditedNumber("");
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

        <Divider sx={{ marginY: 2 }} />
        <Typography variant="subtitle1" color="textSecondary">
          תמונות (ניתן למחוק ולהוסיף):
        </Typography>

        <Grid container spacing={2}>
          {editedFiles.map((file, index) => (
            <Grid item xs={4} key={index}>
              <Box sx={{ position: "relative" }}>
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
                    border: "1px solid #ccc",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => setEditedFiles((prev) => prev.filter((f) => f.name !== file.name))}
                  sx={{ position: "absolute", top: 0, right: 0, background: "white" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" component="label" startIcon={<UploadIcon />}>
            העלה קבצים חדשים
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewFiles((prev) => [...prev, ...files]);
              }}
            />
          </Button>

          <Box>
            {newFiles.map((file, index) => (
              <Typography key={index} variant="body2">
                📎 {file.name}
              </Typography>
            ))}
          </Box>

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={async () => {
              const formData = new FormData();
              formData.append("remainingFiles", JSON.stringify(editedFiles.map((f) => f.name)));
              newFiles.forEach((file) => formData.append("file", file));

              try {
                const res = await axios.patch(
                  `/transaction/updateFiles/${transaction._id}`,
                  formData,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                alert("הקבצים עודכנו בהצלחה 🎉");
                setEditedFiles(res.data.files);
                setNewFiles([]);
              } catch (err) {
                console.error("Failed to update files:", err);
                alert("שגיאה בעדכון קבצים");
              }
            }}>
            שמור קבצים
          </Button>
        </Box>

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
