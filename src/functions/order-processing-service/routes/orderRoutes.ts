import * as express from "express";
import { Request, Response } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { Order } from "../types/order.type";
import { randomUUID } from "crypto";
// import { SnsService } from "src/common/sns.service";

const router = express.Router();

const orders: Order[] = [];

interface AuthRequest extends Request {
  userId?: string;
}

// Create Order
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<any> => {
    const { items, quantity } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Invalid order details" });
      return;
    }

    const order: Order = {
      orderId: `${Date.now().toString()}-${randomUUID()}`,
      userId: req.userId,
      items,
      quantity,
      status: "Pending",
    };

    // const snsService = new SnsService();
    orders.push(order);

    // commenting sns logic to activate local testing
    // await snsService.publishMessage({
    //   topicArn: process.env.ORDER_PROCESSOR_SNS_TOPIC_NAME,
    //   message: JSON.stringify(order),
    //   messageAttributes: {
    //     source: {
    //       DataType: "String",
    //       StringValue: "",
    //     },
    //   },
    // });

    res.status(201).json({ message: "Order created", order: order.orderId });
  }
);

router.post(
  "/updateStatus/:orderId",
  authMiddleware,
  (req: AuthRequest, res: Response): any => {
    try {
      const { orderId } = req.params;
      const { status } = req.query;

      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Invalid status" });
      }

      const order = orders.find((o) => o.orderId === orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status as "Placed" | "Rejected";

      res
        .status(200)
        .json({ message: "Order status updated", orderId, status });
    } catch (error) {
      throw error;
    }
  }
);

// Get Order Details
router.get("/:id", authMiddleware, (req: AuthRequest, res: Response): any => {
  const order = orders.find(
    (o) => o.orderId === req.params.id && o.userId === req.userId
  );

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(order);
});

export default router;
