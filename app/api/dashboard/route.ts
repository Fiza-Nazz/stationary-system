import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Sale from "@/models/Sales";

/**
 * GET /api/dashboard
 * Returns dashboard statistics including total products, stock, low stock,
 * today's sales amount, and total profit.
 */
export async function GET() {
  try {
    // 1️⃣ Connect database
    await connectDB();

    // 2️⃣ Total products count
    const totalProducts = await Product.countDocuments();

    // 3️⃣ Total stock (sum of all product stock)
    const stockAggregation = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
        },
      },
    ]);
    const totalStock = stockAggregation[0]?.totalStock ?? 0;

    // 4️⃣ Low stock products (<= 10)
    const lowStockCount = await Product.countDocuments({
      stock: { $lte: 10 },
    });

    // 5️⃣ Today's date range (explicitly UTC)
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

    // 6️⃣ Aggregate today's sales
    const salesAggregation = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          todaysSales: { $sum: "$totalAmount" },
          totalProfit: { $sum: "$totalProfit" },
        },
      },
    ]);

    const todaysSales = salesAggregation[0]?.todaysSales ?? 0;
    const totalProfit = salesAggregation[0]?.totalProfit ?? 0;

    // 7️⃣ Response
    return NextResponse.json(
      {
        totalProducts,
        totalStock,
        lowStockCount,
        todaysSales,
        totalProfit,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
