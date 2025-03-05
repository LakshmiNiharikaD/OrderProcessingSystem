import { EventHandler } from "src/interface/IEventHandler";
import { Inventory } from "../schema/inventory.schema";
import { closeDB, connectDB } from "src/common/database.service";
import { updateOrderStatus } from "../connectors/updateOrderStatus";

export class InventoryValidationHandler implements EventHandler {
  constructor() {}

  private checkStock = async (items: { item: string; quantity: number }[]) => {
    try {
      for (const { item, quantity } of items) {
        const product = await Inventory.findOne({ item });
        if (!product || product.stock < quantity) {
          return { success: false, message: `${item} is out of stock` };
        }
      }
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  private updateStock = async (items: { item: string; quantity: number }[]) => {
    for (const { item, quantity } of items) {
      await Inventory.updateOne({ item }, { $inc: { stock: -quantity } });
    }
  };

  async handleMessage(event: any): Promise<void> {
    try {
      // Start in-memory database
      await connectDB().then(async () => {
        await Inventory.insertMany([
          { item: "Laptop", stock: 5 },
          { item: "Phone", stock: 10 },
          { item: "Headphones", stock: 8 },
          { item: "Seeds", stock: 8 },
          { item: "Table", stock: 1 },
          { item: "Book", stock: 8 },
        ]);
        console.log("Sample inventory added");
      });

      //validate stock
      const validation = await this.checkStock(event.order);
      if (!validation.success) {
        console.log(`Order Rejected: ${validation.message}`);
        await updateOrderStatus({ id: event.orderId, status: "Rejected" });
        return;
      }

      await this.updateStock(event.order);
      await updateOrderStatus({ id: event.orderId, status: "Placed" });
      closeDB();
    } catch (error) {
      throw error;
    }
  }
}
