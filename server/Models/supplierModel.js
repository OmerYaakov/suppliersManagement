import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
  },

  addres: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  contactName: {
    type: String,
  },

  contactPhone: {
    type: String,
  },

  sumAmount: {
    type: Number,
    default: 0,
  },

  notes: {
    type: String,
  },
});
const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
