import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Expense from "@/models/Expense";

export const dynamic = "force-dynamic";

/* =========================
   POST → Add New Expense
   ========================= */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { amount, description, category } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Valid amount is required" },
        { status: 400 }
      );
    }

    const newExpense = await Expense.create({
      amount,
      description,
      category,
    });

    return NextResponse.json(
      {
        message: "Expense added successfully",
        expense: newExpense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Expense Error:", error);
    return NextResponse.json(
      { message: "Failed to add expense" },
      { status: 500 }
    );
  }
}

/* =========================
   GET → Expense Report
   ========================= */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(`${startDate}T00:00:00.000`);
    const end = new Date(`${endDate}T23:59:59.999`);

    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json(dailyExpenses, { status: 200 });
  } catch (error) {
    console.error("Expense Report Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch expense report" },
      { status: 500 }
    );
  }
}
