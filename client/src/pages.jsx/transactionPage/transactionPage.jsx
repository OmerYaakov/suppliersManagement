import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography, Paper, Divider, Grid, Dialog } from "@mui/material";

const TransactionPage = () => {
  const { transactionNumber } = useParams();
  const location = useLocation();
  const transaction = location.state?.transaction;
  const [openImage, setOpenImage] = useState(null);
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
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    return imageExtensions.some(
      (ext) => typeof filename === "string" && filename.toLowerCase().endsWith(ext)
    );
  };

  const handleImageOpen = (imageUrl) => {
    console.log(imageUrl);
    setOpenImage(imageUrl);
  };

  const handleImageClose = () => {
    setOpenImage(null);
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
        {transaction.files.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1" color="textSecondary">
              תמונות מצורפות:
            </Typography>
            <Grid container spacing={10}>
              {transaction.files
                .filter((file) => isImageFile(file?.name))
                .map((file, index) => {
                  return (
                    <Grid item xs={4} key={index}>
                      <img
                        src={`${baseURL}${file.name}`}
                        alt={file.name}
                        onClick={() => handleImageOpen(`${baseURL}${file.name}`)}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        )}
        {/* Fullscreen image dialog */}
        <Dialog open={!!openImage} onClose={handleImageClose} maxWidth="md" fullWidth>
          {openImage && (
            <img
              src={openImage}
              alt="Full size"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </Dialog>
      </Paper>
    </Box>
  );
};

export default TransactionPage;
