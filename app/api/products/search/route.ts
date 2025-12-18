import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic'; // Ensure this API route is always dynamic

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q'); // Get the productNumber from the query parameter 'q'

    if (!query) {
      return NextResponse.json(
        { message: "Product number query parameter 'q' is required." },
        { status: 400 }
      );
    }

    // Search for products by productNumber (case-insensitive search for better user experience)
    const products = await Product.find({ productNumber: { $regex: query, $options: 'i' } });

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found matching the product number." },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("Error searching product by productNumber:", err.message);
    return NextResponse.json(
      { message: "Failed to search products" },
      { status: 500 }
    );
  }
}
