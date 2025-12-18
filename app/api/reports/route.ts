import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sales";

export const dynamic = 'force-dynamic'; // Ensures that the route is re-evalidated on each request

export async function GET() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Set date range (last 7 days) - adjust for local timezone if needed
    const now = new Date();
    const today = new Date(now.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" }) + "T23:59:59.999"); // Local PKT end of day
    const last7Days = new Date(now.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" }) + "T00:00:00.000"); // Local start
    last7Days.setDate(last7Days.getDate() - 7); // Subtract 7 days in local time

    console.log("Debug: Today (PKT):", today.toISOString(), "Last 7 Days:", last7Days.toISOString()); // Log for debug

    // 3️⃣ First, log raw matching documents count
    const rawCount = await Sale.countDocuments({
      createdAt: { 
        $gte: last7Days,
        $lte: today 
      },
    });
    console.log("Debug: Raw documents in range:", rawCount); // Check if 19 Dec transactions are matching

    // 4️⃣ Aggregate daily sales with local timezone grouping
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
              date: "$createdAt",  // Simplified: direct on createdAt
              timezone: "Asia/Karachi"  // Key Fix: Local PKT timezone for grouping
            },
          },
          totalSales: { $sum: "$subtotal" },
          totalProfit: { $sum: "$totalProfit" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("Debug: Aggregated daily sales:", dailySales); // Log final output

    // 5️⃣ Ensure numbers are always safe & rounded to 2 decimals
    const formattedSales = dailySales.map((d) => ({
      _id: d._id,
      totalSales: Number(d.totalSales.toFixed(2)),
      totalProfit: Number(d.totalProfit.toFixed(2)),
    }));

    // 6️⃣ Return JSON response
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