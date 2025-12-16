import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sales";

export async function GET() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Set date range (last 7 days, explicitly UTC)
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
    const last7Days = new Date(today);
    last7Days.setUTCDate(today.getUTCDate() - 7);

    // 3️⃣ Aggregate daily sales
    const dailySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
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
    return NextResponse.json(formattedSales, { status: 200 });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch sales reports" },
      { status: 500 }
    );
  }
}
