import mongoose from "mongoose";

const receiverTransactionSchema = mongoose.Schema({
  receiverName: {
    type: String,
    require: true,
    trim: true,
  },
});

const ReceiverTransaction = mongoose.model("ReceiverTransaction", receiverTransactionSchema);
export default ReceiverTransaction;
