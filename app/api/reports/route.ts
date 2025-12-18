import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sales";

export const dynamic = 'force-dynamic'; // Ensures that the route is re-evaluated on each request

export async function GET() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Set date range (last 7 days) - using consistent UTC dates
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const last7Days = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7, 0, 0, 0));

    // 3️⃣ Aggregate daily sales with explicit date handling
    const dailySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: last7Days,
            $lte: today 
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $dateFromParts: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
              }}
            },
          },
          totalSales: { $sum: "$totalAmount" },
          totalProfit: { $sum: "$totalProfit" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4️⃣ Ensure numbers are always safe & rounded to 2 decimals
    const formattedSales = dailySales.map((d) => ({
      _id: d._id,
      totalSales: Number(d.totalSales.toFixed(2)),
      totalProfit: Number(d.totalProfit.toFixed(2)),
    }));

    // 5️⃣ Return JSON response
    return NextResponse.json(formattedSales, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch sales reports" },
      { status: 500 }
    );
  }
}