import mongoose from "mongoose";

const receiverTransactionSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  receiverName: {
    type: String,
    require: true,
    trim: true,
  },
});

const ReceiverTransaction = mongoose.model("ReceiverTransaction", receiverTransactionSchema);
export default ReceiverTransaction;
