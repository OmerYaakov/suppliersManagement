import supplierModel from "../Models/supplierModel.js";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId
import ExcelJS from "exceljs"; // Import ExcelJS for Excel file generation

const createSupplier = async (req, res) => {
  console.log("Creating supplier...");

  // Log the user object to check if it's populated
  console.log("User from token:", req.user); // Ensure this logs the user object

  const userId = req.user?.userId; // Get userId from the decoded token
  console.log("User ID from token:", userId); // Log the userId to check if it's correct

  // Check if userId is available
  if (!userId) {
    return res.status(401).json({ message: "User ID not found. Unauthorized." });
  }

  try {
    const { supplierName, addres, phone, contactName, contactPhone, notes } = req.body;

    // Check if a supplier with the same name already exists for this user
    const existingSupplier = await supplierModel.findOne({
      createdBy: userId, // Check the current user's suppliers
      supplierName: supplierName, // Check if the supplier name already exists
    });

    if (existingSupplier) {
      return res.status(409).json({ message: "A supplier with this name already exists." });
    }

    // Create a new supplier and associate it with the logged-in user
    const newSupplier = await supplierModel.create({
      supplierName,
      addres,
      phone,
      contactName,
      contactPhone,
      sumAmount: 0,
      notes,
      createdBy: userId, // Associate the supplier with the logged-in user
    });

    console.log("New supplier created:", newSupplier);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error creating supplier: ", error.message);
    res.status(500).json({ message: "Internal Server Error. Could not create supplier." });
  }
};

const getAllSuppliers = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token (req.user is populated by checkAuth middleware)

  try {
    console.log("Getting all suppliers for the user...");

    // Query to find all suppliers created by the logged-in user
    const suppliers = await supplierModel.find({ createdBy: userId }).select("-__v"); // Exclude the __v field

    // If no suppliers found for the user
    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({ message: "No suppliers found for this user." });
    }

    // Return the list of suppliers
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "An error occurred while fetching suppliers." });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    // בדיקה האם ה-ID תקין
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const supplier = await supplierModel.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error in getById:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSumAmount = async (req, res) => {
  try {
    console.log("Getting sumAmount...");
    const userId = req.user.userId; // Get userId from the decoded token

    const { supplierName } = req.query;

    // Ensure `supplierName` is provided
    if (!supplierName) {
      return res.status(400).json({ error: "Missing required field: supplierName" });
    }

    const supplier = await supplierModel.findOne({ createdBy: userId, supplierName }, "sumAmount");

    if (supplier) {
      res.status(200).json({ sumAmount: supplier.sumAmount });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error("Error retrieving sumAmount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSupplierAmount = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the decoded token
    console.log("Updating supplier amount...");

    const { filter, update } = req.body;

    // Ensure `filter`, `update`, and `options` are provided
    if (!filter || !update) {
      return res.status(400).json({ error: "Missing required fields: filter, update, options" });
    }

    const result = await supplierModel.findOneAndUpdate(
      { createdBy: userId, ...filter }, // Filter by createdBy and additional filter criteria
      update, // Apply the update
      { new: true } // Ensure the updated document is returned
    );
    if (result) {
      res.status(200).json({ message: "Supplier updated successfully", data: result });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.supplierName) {
      return res.status(400).json({ message: "Cannot update supplier name." });
    }

    const updatedSupplier = await supplierModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error.message);
    res.status(500).json({ message: "Failed to update supplier." });
  }
};

const exportSuppliersToExcel = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the decoded token

    const suppliers = await supplierModel.find({ createdBy: userId });
    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({ message: "No suppliers found for this user." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Suppliers");
    worksheet.columns = [
      { header: "שם הספק", key: "supplierName", width: 30 },
      { header: "כתובת", key: "addres", width: 30 },
      { header: "טלפון", key: "phone", width: 15 },
      { header: "איש קשר", key: "contactName", width: 20 },
      { header: "טלפון איש קשר", key: "contactPhone", width: 20 },
      { header: "יתרה", key: "sumAmount", width: 15 },
      { header: "הערות", key: "notes", width: 30 },
    ];

    suppliers.forEach((supplier) => {
      worksheet.addRow({
        supplierName: supplier.supplierName,
        addres: supplier.addres,
        phone: supplier.phone,
        contactName: supplier.contactName,
        contactPhone: supplier.contactPhone,
        sumAmount: supplier.sumAmount,
        notes: supplier.notes,
      });
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const encodedFileName = encodeURIComponent(`suppliers_all}.xlsx`);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: "שגיאה בייצוא לאקסל" });
  }
};

export default {
  createSupplier,
  getAllSuppliers,
  getById,
  updateSupplierAmount,
  getSumAmount,
  updateSupplier,
  exportSuppliersToExcel,
};
