
import React from "react";
import { Clock, Package } from "lucide-react";

interface OrderTrackingInfoProps {
  estimatedDeliveryTime: string;
  shipmentCarrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}

export const OrderTrackingInfo = ({
  estimatedDeliveryTime,
  shipmentCarrier,
  trackingNumber,
  trackingUrl,
}: OrderTrackingInfoProps) => {
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Clock className="h-6 w-6 text-kitchenia-orange" />
        <div>
          <h3 className="font-medium">Estimated Delivery Time</h3>
          <p className="text-gray-600">{estimatedDeliveryTime}</p>
        </div>
      </div>
      
      {(shipmentCarrier || trackingNumber) && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Package className="h-6 w-6 text-kitchenia-orange" />
          <div>
            <h3 className="font-medium">Shipment Information</h3>
            {shipmentCarrier && (
              <p className="text-gray-600">Carrier: {shipmentCarrier}</p>
            )}
            {trackingNumber && (
              <p className="text-gray-600">
                Tracking Number: {trackingUrl ? (
                  <a 
                    href={trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-kitchenia-orange hover:underline"
                  >
                    {trackingNumber}
                  </a>
                ) : (
                  trackingNumber
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
