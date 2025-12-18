import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

/* -------------------------
   GET: All Products Fetch
------------------------- */
export async function GET() {
  try {
    await connectDB(); // Database se connect karo
    const products = await Product.find().sort({ createdAt: -1 }); // Sare products fetch karo, sort by newest
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
    const { productNumber, name, category, costPrice, retailPrice, stock, wholesalePrice, unit } = body;

    // --- Start Validation ---
    if (typeof productNumber !== "string" || productNumber.trim() === "") {
        return NextResponse.json({ message: "Product Number is required." }, { status: 400 });
    }
    if (
      typeof name !== "string" || name.trim() === "" ||
      typeof category !== "string" || category.trim() === "" ||
      typeof costPrice !== "number" || costPrice < 0 ||
      typeof retailPrice !== "number" || retailPrice < 0 ||
      typeof stock !== "number" || stock < 0 ||
      (wholesalePrice !== undefined && (typeof wholesalePrice !== "number" || wholesalePrice < 0))
    ) {
      return NextResponse.json({ message: "Invalid product data provided. Ensure all required fields are correct." }, { status: 400 });
    }
    // --- End Validation ---

    // Check for duplicate product number or name
    const existingProduct = await Product.findOne({
      $or: [
        { productNumber: productNumber.trim() },
        { name: name.trim() }
      ]
    });

    if (existingProduct) {
      if (existingProduct.productNumber === productNumber.trim()) {
        return NextResponse.json({ message: "Product with this Product Number already exists." }, { status: 400 });
      }
      if (existingProduct.name === name.trim()) {
        return NextResponse.json({ message: "Product with this name already exists." }, { status: 400 });
      }
    }

    // Product create karo, Mongoose schema will handle further validation
    const product = await Product.create({
      productNumber: productNumber.trim(),
      name: name.trim(),
      category: category.trim(),
      costPrice: costPrice,
      retailPrice: retailPrice,
      stock: stock,
      wholesalePrice: wholesalePrice || 0,
      unit: unit || "pcs"
    });

    // Revalidate relevant paths to show the new product
    revalidatePath('/dashboard');
    revalidatePath('/inventory');

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding product:", err);

    // Specific error for unique index violation from MongoDB
    if (err.code === 11000 && err.keyPattern && err.keyPattern.productNumber) {
        return NextResponse.json(
          { message: "This Product Number is already taken. Please choose a different one." },
          { status: 400 }
        );
    }

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

