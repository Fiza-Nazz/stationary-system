import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  productNumber: string; // Added for unique identification
  name: string;
  category: string;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  productNumber: { type: String, required: true, unique: true, index: true }, // Added field
  name: { type: String, required: true },
  category: { type: String, required: true },
  costPrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  unit: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product as mongoose.Model<IProduct> || mongoose.model<IProduct>("Product", ProductSchema);
