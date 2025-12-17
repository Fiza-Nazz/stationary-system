import { NextResponse } from "next/server";
import Sale from "@/models/Sales";
import Product from "@/models/Product";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    
    let newSale;
    
    await session.withTransaction(async () => {
      const data = await req.json();
      const { items, paymentMethod } = data;

      if (!items || items.length === 0) {
        throw new Error("No items provided");
      }

      // Calculate subtotal, tax, discount, total, profit
      let subtotal = 0;
      let totalProfit = 0;

      for (let item of items) {
        // Use session for product query to ensure consistency
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}`);
        }

        // Calculate subtotal and profit BEFORE updating stock
        subtotal += item.price * item.quantity;
        totalProfit += (item.price - product.costPrice) * item.quantity;

        // Reduce product stock
        product.stock -= item.quantity;
        await product.save({ session }); // Save with session to ensure atomicity
      }

      const tax = subtotal * 0.1; // example 10% tax
      const discount = 0; // future feature
      const totalAmount = subtotal + tax - discount;

      // Create sale with session to ensure it's part of the transaction
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

    // End the session
    await session.endSession();

    return NextResponse.json({ 
      message: "Sale created successfully", 
      sale: newSale[0], 
      calculatedProfit: newSale[0].totalProfit 
    });
  } catch (err: any) {
    console.error("Sales API Error:", err);
    if (err.message === "Product not found") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    } else if (err.message?.includes("Not enough stock")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else if (err.message === "No items provided") {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    } else if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json(
        { message: "Validation Error", errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}