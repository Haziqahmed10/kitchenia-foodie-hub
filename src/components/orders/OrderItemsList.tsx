
import React from "react";

interface OrderItem {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  totalAmount: number;
}

export const OrderItemsList = ({ items, totalAmount }: OrderItemsListProps) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Order Items</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.item_name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium text-right">Rs. {item.price * item.quantity}</p>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-bold text-lg">
          <p>Total</p>
          <p>Rs. {totalAmount}</p>
        </div>
      </div>
    </div>
  );
};
