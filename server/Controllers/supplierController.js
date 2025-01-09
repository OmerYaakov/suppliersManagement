import supplierModel from "../Models/supplierModel.js";

const createSupplier = async (req, res) => {
  console.log("creating supplier...");
  try {
    const { supplierName, addres, phone, contactName, contactPhone, notes } = req.body;
    console.log(req.body);

    const exsitingSupplier = await supplierModel.findOne({
      supplierName: supplierName,
    });
    if (exsitingSupplier) {
      return res.status(409).json({ message: "Supplier with this name is already exists" });
    }

    const newSupplier = await supplierModel.create({
      supplierName,
      addres,
      phone,
      contactName,
      contactPhone,
      sumAmount: 0,
      notes,
    });
    console.log("new supplier created:" + newSupplier);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error creating supplier: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    console.log("getting all users...");
    const suppliers = await supplierModel.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getById = async (req, res) => {};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { sumAmount } = req.body; // Only update the sumAmount field

    const updatedSupplier = await supplierModel.findByIdAndUpdate(
      id,
      { $set: { sumAmount } }, // Update only the sumAmount field
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSumAmount = async (req, res) => {
  try {
    console.log("Getting sumAmount...");

    const { supplierName } = req.query;

    // Ensure `supplierName` is provided
    if (!supplierName) {
      return res.status(400).json({ error: "Missing required field: supplierName" });
    }

    const supplier = await supplierModel.findOne({ supplierName }, "sumAmount");

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
    console.log("Updating supplier amount...");

    const { filter, update, options } = req.body;

    // Ensure `filter`, `update`, and `options` are provided
    if (!filter || !update || !options) {
      return res.status(400).json({ error: "Missing required fields: filter, update, options" });
    }

    const result = await supplierModel.findOneAndUpdate(filter, update, options);

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

export default { createSupplier, getAllSuppliers, getById, updateSupplierAmount, getSumAmount };
