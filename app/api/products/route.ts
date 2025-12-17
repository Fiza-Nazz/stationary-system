import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

/* -------------------------
   GET: All Products Fetch
------------------------- */
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();

    // 🔹 SANITIZE NUMERIC FIELDS FOR PRODUCTION
    const sanitizedProducts = products.map(p => ({
      ...p.toObject(),
      costPrice: Number(p.costPrice),
      retailPrice: Number(p.retailPrice),
      stock: Number(p.stock),
      wholesalePrice: Number(p.wholesalePrice),
    }));

    return NextResponse.json(sanitizedProducts, { status: 200 });
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
    await connectDB();

    const body = await req.json();

    // 🔹 FORCE CONVERSION (MOST IMPORTANT FIX)
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();

    const costPrice = Number(body.costPrice);
    const retailPrice = Number(body.retailPrice);
    const stock = Number(body.stock);
    const wholesalePrice =
      body.wholesalePrice !== undefined
        ? Number(body.wholesalePrice)
        : 0;

    const unit = body.unit ? String(body.unit) : "pcs";

    // ✅ STRONG VALIDATION
    if (
      !name ||
      !category ||
      isNaN(costPrice) || costPrice < 0 ||
      isNaN(retailPrice) || retailPrice < 0 ||
      isNaN(stock) || stock < 0 ||
      isNaN(wholesalePrice) || wholesalePrice < 0
    ) {
      return NextResponse.json(
        { message: "Invalid product data. Please enter valid numbers." },
        { status: 400 }
      );
    }

    // 🟡 DUPLICATE CHECK
    const existing = await Product.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 400 }
      );
    }

    // 🟢 CREATE PRODUCT (NUMBERS GUARANTEED)
    const product = await Product.create({
      name,
      category,
      costPrice,
      retailPrice,
      stock,
      wholesalePrice,
      unit,
    });

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding product:", err.message);

    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map(
        (error: any) => error.message
      );
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
