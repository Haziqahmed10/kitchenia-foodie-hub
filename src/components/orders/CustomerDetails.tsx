
import React from "react";

interface CustomerDetailsProps {
  name: string;
  address: string;
  phone: string;
  paymentMethod: string;
}

export const CustomerDetails = ({
  name,
  address,
  phone,
  paymentMethod,
}: CustomerDetailsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-1">Delivery Address</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-medium">{name}</p>
          <p className="text-gray-600">{address}</p>
          <p className="text-gray-600">{phone}</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Payment Method</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="capitalize">{paymentMethod.replace('_', ' ')}</p>
        </div>
      </div>
    </div>
  );
};
