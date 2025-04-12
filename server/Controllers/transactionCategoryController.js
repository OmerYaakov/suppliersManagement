import transactionCategory from "../Models/transactionCategoryModel.js";

const createCategory = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the decoded token
    console.log("Creating category ...");

    const { categoryName } = req.body;

    // Check if the category already exists
    const existingCategory = await transactionCategory.findOne({
      createdBy: userId,
      categoryName: categoryName,
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category with this name already exists",
      });
    }

    // Create a new category
    const newCategory = await transactionCategory.create({
      createdBy: userId,
      categoryName,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating transaction category: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllCategory = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token
  try {
    console.log("getting all categories... ");
    const categories = await transactionCategory.find({ createdBy: userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getByCategory = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token
  try {
    console.log("getting by category");
    const category = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category name is required!" });
    }
    const data = await transactionCategory.find({ createdBy: userId, categoryName: category });
    if (data.lengh === 0) {
      return res.status(400).json({ message: "No data found for the provided category" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    console.log("deletק category...");

    const categoryId = req.params.id;
    const deleteCategory = await transactionCategory.findByIdAndDelete(categoryId);
    if (!deleteCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "category deleted successfully", deleteCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the category", error: error.message });
  }
};

export default { getAllCategory, getByCategory, createCategory, deleteCategory };
