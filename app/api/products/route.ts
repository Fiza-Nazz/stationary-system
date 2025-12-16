import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

/* -------------------------
   GET: All Products Fetch
------------------------- */
export async function GET() {
  try {
    await connectDB(); // Database se connect karo
    const products = await Product.find(); // Sare products fetch karo
    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching products:", err.message);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* -------------------------
   POST: Add New Product
------------------------- */
export async function POST(req: Request) {
  try {
    await connectDB(); // Database se connect karo
    const body = await req.json();
    const { name, category, costPrice, retailPrice, stock, wholesalePrice, unit } = body;

    if (
      typeof name !== "string" || name.trim() === "" ||
      typeof category !== "string" || category.trim() === "" ||
      typeof costPrice !== "number" || costPrice < 0 ||
      typeof retailPrice !== "number" || retailPrice < 0 ||
      typeof stock !== "number" || stock < 0 ||
      (wholesalePrice !== undefined && (typeof wholesalePrice !== "number" || wholesalePrice < 0))
    ) {
      return NextResponse.json({ message: "Invalid product data provided. Ensure all required fields are correct numbers and not negative." }, { status: 400 });
    }

    // Optional: check for duplicate product
    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ message: "Product already exists" }, { status: 400 });
    }

    // Product create karo, Mongoose schema will handle validation
    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      costPrice: costPrice,
      retailPrice: retailPrice,
      stock: stock,
      wholesalePrice: wholesalePrice || 0,
      unit: unit || "pcs"
    });

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding product:", err.message);
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json(
        { message: "Validation Error", errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong while adding product" },
      { status: 500 }
    );
  }
}

