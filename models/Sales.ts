import mongoose from "mongoose";

interface ISaleItem {
  productId: mongoose.Schema.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface ISales extends mongoose.Document {
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  totalProfit: number;
  paymentMethod: "Cash" | "Card";
}

const SalesSchema = new mongoose.Schema<ISales>({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 }
    }
  ],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["Cash", "Card"], default: "Cash" }
}, { timestamps: true });

export default mongoose.models.Sales as mongoose.Model<ISales> || mongoose.model<ISales>("Sales", SalesSchema);
