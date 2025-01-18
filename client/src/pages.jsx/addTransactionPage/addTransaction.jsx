import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  ListItemIcon,
  styled,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const AddTransaction = () => {
  // State variables
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [newSupplier, setNewSupplier] = useState("");

  const [transactionTypes, setTransactionTypes] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [newType, setNewType] = useState("");
  const [openAddTypeDialog, setOpenAddTypeDialog] = useState(false);

  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [receiversTransaction, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [newReceiver, setNewReceiver] = useState("");
  const [openAddReceiverDialog, setOpenAddReceiverDialog] = useState(false);

  const [transactionCategories, setTransactionCategories] = useState([]);
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

  const [notes, setNotes] = useState("");

  const [files, setFiles] = useState([]);
  const HiddenInput = styled("input")({
    display: "none", // This hides the default file input button
  });

  useEffect(() => {
    fetchSuppliers();
    fetchReceivers();
    fetchCategory();
    fetchTypes();
  }, []);

  //fetch data

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/supplier/get");
      if (Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchReceivers = async () => {
    try {
      const res = await axios.get("/receivers/get");
      if (Array.isArray(res.data)) {
        setReceivers(res.data);
      } else {
        setReceivers([]);
      }
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get("/transactionCategory/get");
      if (Array.isArray(res.data)) {
        setTransactionCategories(res.data);
      } else {
        setTransactionCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axios.get("/transactionType/get");
      if (Array.isArray(res.data)) {
        setTransactionTypes(res.data);
      } else {
        setTransactionTypes([]);
      }
    } catch (error) {
      console.error("Error fetching types: ", error);
    }
  };

  //general

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      formData.append("supplierName", selectedSupplier);
      formData.append("transactionType", selectedTransactionType);
      formData.append("transactionNumber", transactionNumber);
      formData.append("transactionDate", transactionDate);
      formData.append("transactionAmount", transactionAmount);
      formData.append("receivesTransaction", selectedReceiver);
      formData.append("transactionCategory", selectedTransactionCategory);
      formData.append("notes", notes);

      Array.from(files).forEach((file, index) => {
        formData.append("file", file);
      });

      // Ensure transactionAmount is negative for "זיכוי"
      if (selectedTransactionType === "זיכוי") {
        if (!transactionAmount.startsWith("-")) {
          return alert("אם בחרת זיכוי הסכום חייב להיות במינוס (לדוגמה: -100)");
        }
      }

      // Create the new transaction

      const transactionResponse = await axios.post("./transaction/create", formData);
      console.log("Transaction created successfully:", transactionResponse.data);

      // Update the supplier amount
      await updateSupplierAmount(selectedSupplier, transactionAmount, selectedTransactionType);

      // Reset form
      setSelectedSupplier("");
      setSelectedTransactionType("");
      setTransactionNumber("");
      setTransactionAmount("");
      setTransactionDate("");
      setSelectedReceiver("");
      setSelectedTransactionCategory("");
      setNotes("");
      setFiles("");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיימת עסקה עם אותו מספר.");
      } else {
        console.error("Error creating transaction or updating supplier:", error);
      }
    }
  };

  //receivers

  const handleAddReceiver = async () => {
    try {
      const res = await axios.post("/receivers/create", { receiverName: newReceiver });
      setReceivers((prev) => [...prev, res.data]); // Update receivers list
      setSelectedReceiver(newReceiver); // Set the newly added receiver
      setNewReceiver(""); // Clear input
      setOpenAddReceiverDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error adding new receiver:", error);
    }
  };

  const handleRemoveReceiver = async (receiverId) => {
    try {
      await axios.delete(`/receivers/delete/${receiverId}`);
      setReceivers((prev) => prev.filter((receiver) => receiver._id !== receiverId));
      if (selectedReceiver === receiverId) {
        setSelectedReceiver("");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיימת עסקה עם אותו מספר.");
      }
      console.error("Error removing receiver:", error);
    }
  };

  const handleReceiversDialogClose = () => {
    setOpenAddReceiverDialog(false);
    setNewReceiver("");
  };

  //supplier
  const updateSupplierAmount = async (selectedSupplier, transactionAmount, transactionType) => {
    try {
      // Fetch the current supplier amount
      const { data: supplierData } = await axios.get("/supplier/getSupplierAmount/", {
        params: { supplierName: selectedSupplier },
      });

      const currentAmount = supplierData?.sumAmount || 0; // Ensure we have a default value if no amount exists
      let newAmount;
      if (transactionType === "קבלה") {
        newAmount = parseFloat(currentAmount) - parseFloat(transactionAmount); // Calculate the new amount
      } else if (transactionType === "חשבונית-קבלה") {
        newAmount = parseFloat(currentAmount);
      } else {
        newAmount = parseFloat(currentAmount) + parseFloat(transactionAmount); // Calculate the new amount
      }

      // Update the supplier amount in the database
      const response = await axios.post("/supplier/updateAmount", {
        filter: { supplierName: selectedSupplier },
        update: { $set: { sumAmount: newAmount } },
      });

      console.log("Updated supplier document:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating supplier amount:", error.response?.data || error.message);
      throw new Error("Failed to update supplier amount.");
    }
  };
  //category

  const handleAddCategory = async () => {
    try {
      const res = await axios.post("/transactionCategory/create", { categoryName: newCategory });
      setTransactionCategories((prev) => [...prev, res.data]); // Update categories list
      setSelectedTransactionCategory(newCategory); // Set the newly added category
      setNewCategory(""); // Clear input
      setOpenAddCategoryDialog(false); // Close the dialog
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיימת קטגוריה עם אותו שם.");
      }
      console.error("Error adding new category:", error);
    }
  };

  const handleCategoryDialogClose = () => {
    setOpenAddCategoryDialog(false);
    setNewCategory("");
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      await axios.delete(`/transactionCategory/delete/${categoryId}`);
      setTransactionCategories((prev) => prev.filter((category) => category._id != categoryId));
      if (selectedTransactionCategory === categoryId) {
        setSelectedTransactionCategory("");
      }
    } catch (error) {
      console.error("Error removing category:", error);
    }
  };

  //types

  const handleAddType = async () => {
    try {
      const res = await axios.post("/transactionType/create", { typeName: newType });
      setTransactionTypes((prev) => [...prev, res.data]);
      setSelectedTransactionType(res.data.typeName);
      setNewType("");
      setOpenAddTypeDialog(false);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("קיימת סוג עסקה עם אותו שם.");
      }
      console.error("Error adding new type: ", error);
    }
  };

  const handleRemoveType = async (typeId) => {
    try {
      axios.delete(`/transactionType/delete/${typeId}`);
      setTransactionTypes((prev) => prev.filter((type) => type._id != typeId));
      if (selectedTransactionType === typeId) {
        setSelectedTransactionType("");
      }
    } catch (error) {
      console.error("Error removing type: ", error);
    }
  };

  const handleTypeDialogClose = () => {
    setOpenAddTypeDialog(false);
    setNewType("");
  };

  //amount

  const handleTransactionAmountChange = (event) => {
    const value = event.target.value;

    // Allow only numbers with up to two decimal places
    const formattedValue = value.match(/^-?\d*(\.\d{0,2})?$/) ? value : transactionAmount;

    setTransactionAmount(formattedValue);
  };

  const handleTransactionAmountBlur = () => {
    if (transactionAmount) {
      // Format the value to two decimal places
      setTransactionAmount(parseFloat(transactionAmount).toFixed(2));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <h1>הוספת עסקה חדשה</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>ספק</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleInputChange(setSelectedSupplier)}
            label="Supplier"
            required>
            <MenuItem value="" disabled>
              בחר ספק
            </MenuItem>
            {suppliers.map((supplier, index) => (
              <MenuItem key={index} value={supplier.supplierName}>
                {supplier.supplierName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>סוג עסקה</InputLabel>
          <Select
            value={selectedTransactionType}
            onChange={(event) => {
              if (event.target.value === "add-new") {
                setOpenAddTypeDialog(true);
              } else {
                setSelectedTransactionType(event.target.value);
              }
            }}
            label="סוג העסקה"
            required>
            <MenuItem value="" disabled>
              בחר סוג עסקה
            </MenuItem>
            {transactionTypes.map((type) => (
              <MenuItem key={type._id} value={type.typeName}>
                <ListItemIcon>
                  {selectedTransactionType !== type.typeName && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveType(type._id);
                      }}
                      size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemIcon>
                <ListItemText primary={type.typeName} />
              </MenuItem>
            ))}
            <MenuItem value="add-new"> הוסף סוג עסקה חדש</MenuItem>
          </Select>
        </FormControl>

        <Dialog open={openAddTypeDialog} onClose={handleTypeDialogClose}>
          <DialogTitle>הוסף סוג עסקה חדש</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="סוג עסקה"
              type="text"
              fullWidth
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTypeDialogClose}>ביטול</Button>
            <Button onClick={handleAddType} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        <TextField
          label="מספר עסקה"
          value={transactionNumber}
          onChange={handleInputChange(setTransactionNumber)}
          fullWidth
          margin="normal"
          type="number"
        />

        <TextField
          label="סכום העסקה בשקלים"
          value={transactionAmount}
          onChange={handleTransactionAmountChange}
          onBlur={handleTransactionAmountBlur}
          fullWidth
          margin="normal"
          type="text" // Use "text" instead of "number" to allow proper formatting
        />

        <TextField
          label="תאריך העסקה"
          value={transactionDate}
          onChange={handleInputChange(setTransactionDate)}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>מקבל העסקה</InputLabel>
          <Select
            value={selectedReceiver}
            onChange={(event) => {
              if (event.target.value === "add-new") {
                setOpenAddReceiverDialog(true);
              } else {
                setSelectedReceiver(event.target.value);
              }
            }}
            label="מקבל העסקה"
            required>
            <MenuItem value="" disabled>
              בחר מקבל העסקה
            </MenuItem>
            {receiversTransaction.map((receiver) => (
              <MenuItem key={receiver._id} value={receiver.receiverName}>
                <ListItemIcon>
                  {selectedReceiver !== receiver.receiverName && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveReceiver(receiver._id);
                      }}
                      size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemIcon>
                <ListItemText primary={receiver.receiverName} />
              </MenuItem>
            ))}
            <MenuItem value="add-new"> הוסף מקבל חדש</MenuItem>
          </Select>
        </FormControl>

        <Dialog open={openAddReceiverDialog} onClose={handleReceiversDialogClose}>
          <DialogTitle>הוסף מקבל חדש</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם המקבל"
              type="text"
              fullWidth
              value={newReceiver}
              onChange={(e) => setNewReceiver(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReceiversDialogClose}>ביטול</Button>
            <Button onClick={handleAddReceiver} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={selectedTransactionCategory}
            onChange={(event) => {
              if (event.target.value === "add-new") {
                setOpenAddCategoryDialog(true);
              } else {
                setSelectedTransactionCategory(event.target.value);
              }
            }}
            label="קטגוריה"
            required>
            <MenuItem value="" disabled>
              בחר קטגוריה
            </MenuItem>
            {transactionCategories.map((category) => (
              <MenuItem key={category._id} value={category.categoryName}>
                <ListItemIcon>
                  {selectedTransactionCategory !== category.categoryName && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(category._id);
                      }}
                      size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemIcon>
                <ListItemText primary={category.categoryName} />
              </MenuItem>
            ))}
            <MenuItem value="add-new"> הוסף קטגוריה חדשה</MenuItem>
          </Select>
        </FormControl>

        <Dialog open={openAddCategoryDialog} onClose={handleCategoryDialogClose}>
          <DialogTitle>הוסף קטגוריה חדשה</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם הקטגוריה"
              type="text"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose}>ביטול</Button>
            <Button onClick={handleAddCategory} variant="contained">
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        <TextField
          label="הערות"
          value={notes}
          onChange={handleInputChange(setNotes)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <Box sx={{ marginTop: 3 }}>
          {/* File Input and Button */}
          <label htmlFor="files">
            <HiddenInput
              accept="image/*,application/pdf,.doc,.docx"
              id="files"
              type="file"
              onChange={handleFileChange}
              multiple // Allow multiple files
            />
            <Button variant="contained" component="span">
              בחר קבצים
            </Button>
          </label>

          {/* Display the list of selected file names */}
          <List>
            {files.length > 0 ? (
              files.map((file, index) => (
                <ListItem key={index}>
                  <Typography variant="body1">{file.name}</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteFile(index)}>
                    X
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                לא נבחרו קבצים
              </Typography>
            )}
          </List>
        </Box>
        <Button type="submit" variant="contained" fullWidth>
          שמור
        </Button>
      </form>
    </Box>
  );
};

export default AddTransaction;
