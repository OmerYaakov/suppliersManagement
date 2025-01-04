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
    console.log("getting sumAmount");
    const { supplierName } = req.query;
    console.log(supplierName);
    const sumAmount = await supplierModel.findOne({ supplierName: supplierName }, `sumAmount`);

    res.status(201).json(sumAmount);
  } catch (error) {
    console.error(error);
  }
};

export default { createSupplier, getAllSuppliers, getById, updateSupplier, getSumAmount };
