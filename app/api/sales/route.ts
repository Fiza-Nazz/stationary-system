import { NextResponse } from "next/server";
import Sale from "@/models/Sales";
import Product from "@/models/Product";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    // 1️⃣ Connect to database
    await connectDB();

    // 2️⃣ Start a session for transaction
    const session = await mongoose.startSession();
    let newSale: any = null;

    await session.withTransaction(async () => {
      const data = await req.json();
      const { items, paymentMethod } = data;

      if (!items || items.length === 0) {
        throw new Error("No items provided");
      }

      // 3️⃣ Calculate subtotal and total profit
      let subtotal = 0;
      let totalProfit = 0;

      for (let item of items) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) throw new Error("Product not found");
        if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.name}`);

        subtotal += item.price * item.quantity;
        totalProfit += (item.price - product.costPrice) * item.quantity;

        // Reduce stock
        product.stock -= item.quantity;
        await product.save({ session });
      }

      // 4️⃣ Calculate tax, discount, totalAmount
      const tax = subtotal * 0.1; // 10% tax
      const discount = 0; // future feature
      const totalAmount = subtotal + tax - discount;

      // 5️⃣ Create sale (timestamps handle createdAt automatically)
      newSale = await Sale.create([{
        items,
        subtotal,
        tax,
        discount,
        totalAmount,
        totalProfit,
        paymentMethod,
      }], { session });
    });

    // 6️⃣ End session
    await session.endSession();

    if (!newSale) throw new Error("Failed to create sale");

    // 7️⃣ Return response
    return NextResponse.json({
      message: "Sale created successfully",
      sale: newSale[0],
      calculatedProfit: newSale[0].totalProfit
    });

  } catch (err: any) {
    console.error("Sales API Error:", err);

    if (err.message === "Product not found") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (err.message?.includes("Not enough stock")) return NextResponse.json({ error: err.message }, { status: 400 });
    if (err.message === "No items provided") return NextResponse.json({ error: "No items provided" }, { status: 400 });
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ message: "Validation Error", errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
