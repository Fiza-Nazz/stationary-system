import mongoose, { Schema, models } from "mongoose";

const ExpenseSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    category: String,
  },
  { timestamps: true } // 👈 createdAt automatically
);

export default models.Expense || mongoose.model("Expense", ExpenseSchema);
