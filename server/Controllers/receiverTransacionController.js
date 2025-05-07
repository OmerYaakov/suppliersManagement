import ReceiverTransactionModel from "../Models/receiverTransactionModel.js";

const createReceiver = async (req, res) => {
  console.log("creating receiver...");
  const userId = req.user.userId; // Get userId from the decoded token
  const { receiverName } = req.body;
  try {
    const exsitingReceiver = await ReceiverTransactionModel.findOne({
      createdBy: userId,
      receiverName: receiverName,
    });
    if (exsitingReceiver) {
      return res.status(409).json({ message: "receiver with this name is already exist" });
    }
    const newReceiver = await ReceiverTransactionModel.create({
      createdBy: userId,
      receiverName,
    });

    res.status(201).json(newReceiver);
  } catch (error) {
    console.error("error creating receiver:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getByName = async (req, res) => {
  const { receiverName } = req.query;
  try {
    if (!receiverName) {
      return res.status(400).json({ massege: "Name parameter is required!" });
    }

    const data = await ReceiverTransactionModel.find({ receiverName: receiverName });
    if (data.lengh === 0) {
      return res.status(400).json({ message: "No data found for the provided name" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by name:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllReceivers = async (req, res) => {
  const userId = req.user.userId; // Get userId from the decoded token

  try {
    console.log("getting all receivers");
    const receivers = await ReceiverTransactionModel.find({ createdBy: userId });
    res.status(200).json(receivers);
  } catch (error) {
    res.status(404).json({ message: error.massege });
  }
};

const deleteReceiver = async (req, res) => {
  try {
    const receiverId = req.params.id;

    const deletedReceiver = await ReceiverTransactionModel.findByIdAndDelete(receiverId);

    if (!deletedReceiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    res.status(200).json({ message: "Receiver deleted successfully", deletedReceiver });
  } catch (error) {
    console.error("Error deleting receiver:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the receiver", error: error.message });
  }
};

export default { createReceiver, getByName, getAllReceivers, deleteReceiver };
