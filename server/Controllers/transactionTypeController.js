import transactionType from "../Models/transacionTypeModel.js";

const getAllTypes = async (req, res) => {
  try {
    console.log("getting all types...");
    const types = await transactionType.find();
    res.status(201).json(types);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getByType = async (req, res) => {
  try {
    console.log("getting by type...");

    const type = req.query;
    if (!type) {
      return res.status(400).json({ message: "Type name is required!" });
    }
    const data = await transactionType.find({ typeName: type });
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
  try {
    console.log("Creating type ...");

    const { typeName } = req.body;

    const existingType = await transactionType.findOne({
      typeName: typeName,
    });

    if (existingType) {
      return res.status(409).json({
        message: "type with this name already exists",
      });
    }

    const newType = await transactionType.create({
      typeName,
    });

    res.status(201).json(newType);
  } catch (error) {
    console.error("Error creating transaction type: ", error.message);
    res.status(500).json({ message: error.message });
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
