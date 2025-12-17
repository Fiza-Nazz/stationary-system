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

    // 5️⃣ Today's date range using **local timezone**
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 00:00:00 today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // next day 00:00:00

    // 6️⃣ Aggregate today's sales & profit using local date range
    const salesAggregation = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }, // local time range
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

    // 7️⃣ All-time total profit (optional)
    const allTimeProfitAggregation = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$totalProfit" },
        },
      },
    ]);
    const allTimeTotalProfit = allTimeProfitAggregation[0]?.totalProfit ?? 0;

    // 8️⃣ Return JSON response
    return NextResponse.json(
      {
        totalProducts,
        totalStock,
        lowStockCount,
        todaysSales,
        totalProfit: totalProfit, // Don't use allTimeTotalProfit as fallback; keep separate
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
