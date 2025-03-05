type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  readonly orderId: string;
  readonly userId: string;
  readonly items: OrderItem[];
  readonly quantity: number;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Placed"
    | "Rejected";
};
