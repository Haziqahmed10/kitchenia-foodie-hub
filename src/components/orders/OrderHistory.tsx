
import React from "react";
import { Calendar } from "lucide-react";

export const OrderHistory = () => {
  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
      <div className="flex items-start gap-4">
        <Calendar className="h-8 w-8 text-kitchenia-orange mt-1" />
        <div>
          <h3 className="text-lg font-semibold">Order History</h3>
          <p className="text-gray-600 mt-1">
            Your order history is maintained for 6 months. If you need information about older orders,
            please contact our customer support team.
          </p>
        </div>
      </div>
    </div>
  );
};
