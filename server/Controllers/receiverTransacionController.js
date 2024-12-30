import ReceiverTransaction from "../Models/receiverTransactionModel.js";

const createReceiver = async (req, res) => {
  console.log("creating receiver...");
  const { receiverName } = req.body;
  try {
    const exsitingReceiver = await ReceiverTransaction.findOne({
      receiverName: receiverName,
    });
    if (exsitingReceiver) {
      return res.status(409).json({ message: "receiver with this name is already exist" });
    }
    const newReceiver = await ReceiverTransaction.create({
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
    if (!name) {
      return res.status(400).json({ massege: "Name parameter is required!" });
    }

    const data = await ReceiverTransaction.find({ receiverName: receiverName });
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
  try {
    console.log("getting all receivers");
    const receivers = await ReceiverTransaction.find();
    res.status(200).json(receivers);
  } catch (error) {
    res.status(404).json({ message: error.massege });
  }
};

const deleteReceiver = async (req, res) => {
  try {
    const receiverId = req.params.id;

    const deletedReceiver = await ReceiverTransaction.findByIdAndDelete(receiverId);

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
