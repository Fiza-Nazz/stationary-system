import mongoose from "mongoose";
import connectDB from "../db";
import Sale from "../../models/Sales";
import Product from "../../models/Product";

async function recalculateProfit() {
  await connectDB();
  console.log("Starting profit recalculation for all sales...");

  try {
    const sales = await Sale.find({});
    let updatedCount = 0;

    for (const sale of sales) {
      let currentTotalProfit = 0;
      let hasProductMissing = false;

      for (const item of sale.items) {
        // Fetch product with explicit session handling
        const product = await Product.findById(item.productId);
        let itemProfit = 0;

        if (product && typeof product.costPrice === 'number' && product.costPrice >= 0) {
          itemProfit = (item.price - product.costPrice) * item.quantity;
        } else {
          // If product or its costPrice is invalid/missing, we cannot accurately recalculate.
          // Log it and keep original item profit if it exists, or 0.
          console.warn(`Product ID ${item.productId} for Sale ID ${sale._id} has missing or invalid costPrice. Cannot recalculate item profit accurately.`);
          hasProductMissing = true;
        }
        currentTotalProfit += itemProfit;
      }

      // Update the sale document with the new total profit if it differs
      if (sale.totalProfit !== currentTotalProfit || hasProductMissing) {
        await Sale.findByIdAndUpdate(sale._id, { totalProfit: currentTotalProfit });
        updatedCount++;
        console.log(`Updated Sale ID: ${sale._id} with new totalProfit: ${currentTotalProfit}`);
      }
    }
    console.log(`Profit recalculation complete. Total sales updated: ${updatedCount}`);
  } catch (error) {
    console.error("Error during profit recalculation:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

recalculateProfit();