import mongoose, { Document, Schema, Model, model } from "mongoose";

// 1️⃣ Define Sale Item interface
export interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

// 2️⃣ Define Sales interface
export interface ISales extends Document {
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  totalProfit: number;
  paymentMethod: "Cash" | "Card";
  createdAt: Date; // ✅ timestamps automatically add this
  updatedAt: Date; // ✅ timestamps automatically add this
}

// 3️⃣ Create Schema
const SalesSchema: Schema<ISales> = new Schema<ISales>({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
    }
  ],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["Cash", "Card"], default: "Cash" },
}, { timestamps: true }); // ✅ createdAt & updatedAt automatically

// 4️⃣ Export model
const Sales: Model<ISales> = mongoose.models.Sales || model<ISales>("Sales", SalesSchema);
export default Sales;
