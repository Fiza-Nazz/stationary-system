import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sales";
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate: Date;
    let endDate: Date;

    const timeZone = "Asia/Karachi";

    if (startDateParam && endDateParam) {
      // Use user-provided dates
      startDate = new Date(`${startDateParam}T00:00:00.000`);
      endDate = new Date(`${endDateParam}T23:59:59.999`);
    } else {
      // Default to last 7 days
      const now = new Date();
      endDate = new Date(now.toLocaleDateString("en-CA", { timeZone }) + "T23:59:59.999");
      startDate = new Date(now.toLocaleDateString("en-CA", { timeZone }) + "T00:00:00.000");
      startDate.setDate(startDate.getDate() - 6); // Today + 6 previous days = 7 days
    }

    const dailySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: startDate,
            $lte: endDate 
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: timeZone
            },
          },
          totalSales: { $sum: "$subtotal" },
          totalProfit: { $sum: "$totalProfit" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedSales = dailySales.map((d) => ({
      _id: d._id,
      totalSales: Number(d.totalSales.toFixed(2)),
      totalProfit: Number(d.totalProfit.toFixed(2)),
    }));

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