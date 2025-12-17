import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Adjust path to your DB connection
import Sale from '@/models/Sales'; // Adjust path to your Sales model
import { revalidatePath } from 'next/cache';

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Delete all sales documents
    const result = await Sale.deleteMany({});
    
    // Revalidate the dashboard path to reflect the reset sales data
    revalidatePath('/dashboard');

    return NextResponse.json(
      { 
        success: true, 
        message: 'All sales data has been deleted successfully.',
        deletedCount: result.deletedCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting sales data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to reset sales data.' 
      },
      { status: 500 }
    );
  }
}