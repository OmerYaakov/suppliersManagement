import transactionType from "../Models/transacionTypeModel.js";

const getAllTypes = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token
  try {
    console.log("getting all types...");
    const types = await transactionType.find({ createdBy: userId });
    res.status(201).json(types);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getByType = async (req, res) => {
  console.log("getting by type...");
  const userId = req.user.userId; // Get userId from the decoded token
  try {
    console.log("getting by type...");

    const type = req.query;
    if (!type) {
      return res.status(400).json({ message: "Type name is required!" });
    }
    const data = await transactionType.find({ createdBy: userId, typeName: type });
    if (data.lengh === 0) {
      return res.status(400).json({ message: "No data for the provided type" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by type!");
    res.status(500).json({ message: "Server Error" });
  }
};

const createType = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token
  const { typeName } = req.body; // Get typeName from the request body

  try {
    console.log("Checking if type exists for user:", userId, "with typeName:", typeName);

    // Check if a transaction type with the same name exists for the current user
    const existingType = await transactionType.findOne({
      createdBy: userId, // Ensure the transaction type belongs to the current user
      typeName: typeName, // Ensure the typeName matches
    });

    // If the type already exists for the current user, return a conflict error (409)
    if (existingType) {
      console.log("Type already exists for this user:", existingType);
      return res.status(409).json({ message: "Transaction type with this name already exists." });
    }

    // If no such type exists for the current user, create a new one
    const newType = await transactionType.create({
      createdBy: userId, // Associate the type with the current user
      typeName,
    });

    console.log("New type created:", newType);
    res.status(201).json(newType); // Return the newly created type
  } catch (error) {
    // Handle duplicate key error (E11000) specifically
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.message);
      return res.status(409).json({ message: "Duplicate typeName exists." });
    }

    // General error handling
    console.error("Error creating transaction type:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteType = async (req, res) => {
  try {
    console.log("delete type");
    const typeId = req.params.id;
    const deleteType = await transactionType.findByIdAndDelete(typeId);
    if (!deleteType) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.status(200).json(deleteType);
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the category", error: error.message });
  }
};

export default { getAllTypes, getByType, createType, deleteType };
