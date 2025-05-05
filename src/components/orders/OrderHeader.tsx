
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderHeaderProps {
  orderCode: string;
  createdAt: string;
  status: string;
}

export const OrderHeader = ({ orderCode, createdAt, status }: OrderHeaderProps) => {
  return (
    <div className="bg-kitchenia-orange p-4 text-white flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">Order Code: {orderCode}</h2>
        <p className="text-sm opacity-90">
          Placed on {new Date(createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
          })}
        </p>
      </div>
      <OrderStatusBadge status={status} />
    </div>
  );
};
