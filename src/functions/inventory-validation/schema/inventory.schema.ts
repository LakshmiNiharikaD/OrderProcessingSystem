import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  item: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
});

export const Inventory = mongoose.model("Inventory", InventorySchema);
