
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/orders/LoadingState";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderTrackingInfo } from "@/components/orders/OrderTrackingInfo";
import { OrderItemsList } from "@/components/orders/OrderItemsList";
import { CustomerDetails } from "@/components/orders/CustomerDetails";
import { OrderHistory } from "@/components/orders/OrderHistory";

// Define an interface that matches what we get from the database
interface OrderDataFromDB {
  id: string;
  status: string;
  name: string;
  address: string;
  phone: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  order_code?: string; // Optional since it might not exist in the database yet
  estimated_delivery_time?: string; // Optional since it might not exist in the database yet
  notes: string | null;
  shipment_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  order_items: {
    id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
}

// Interface for our enhanced order with required fields
interface OrderDetails {
  id: string;
  order_code: string; // Required in our app
  status: string;
  name: string;
  address: string;
  phone: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  estimated_delivery_time: string; // Required in our app
  notes: string | null;
  shipment_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  order_items: {
    id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          toast({
            title: "Error",
            description: "No order ID provided",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", orderId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Create complete order object with generated fields if necessary
          const orderData = data as OrderDataFromDB;
          const completeOrder: OrderDetails = {
            ...orderData,
            order_code: orderData.order_code || `CK-${orderData.id.substring(0, 4)}`,
            estimated_delivery_time: orderData.estimated_delivery_time || "30-45 minutes"
          };
          
          setOrder(completeOrder);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching order",
          description: error.message || "Could not fetch order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Set up a polling interval to check for order status updates
    const statusInterval = setInterval(async () => {
      if (order && order.status !== "delivered") {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("status")
            .eq("id", orderId)
            .single();

          if (error) throw error;

          if (data && data.status !== order.status) {
            // Refresh the whole order if status changed
            const { data: refreshedOrder, error: refreshError } = await supabase
              .from("orders")
              .select("*, order_items(*)")
              .eq("id", orderId)
              .single();

            if (!refreshError && refreshedOrder) {
              // Update order with the refreshed data and generated fields
              const refreshedOrderData = refreshedOrder as OrderDataFromDB;
              setOrder({
                ...refreshedOrderData,
                order_code: refreshedOrderData.order_code || `CK-${refreshedOrderData.id.substring(0, 4)}`,
                estimated_delivery_time: refreshedOrderData.estimated_delivery_time || "30-45 minutes"
              });
              
              toast({
                title: "Order Updated",
                description: `Your order status is now: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
              });
            }
          }
        } catch (error) {
          console.error("Error checking order status:", error);
        }
      } else if (order?.status === "delivered") {
        // Stop polling if order is delivered
        clearInterval(statusInterval);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(statusInterval);
  }, [orderId, navigate, toast, order?.status]);

  if (loading) {
    return <LoadingState />;
  }

  if (!order) {
    return (
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
          <p className="mt-4 text-gray-600">We couldn't find the order you're looking for.</p>
          <Button asChild className="mt-6">
            <Link to="/order">Place New Order</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="section-container py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We're preparing your delicious food!
          </p>
        </div>

        <Card className="mb-6 overflow-hidden">
          <OrderHeader 
            orderCode={order.order_code} 
            createdAt={order.created_at} 
            status={order.status} 
          />
          
          <CardContent className="p-6">
            <div className="grid gap-6">
              <OrderTrackingInfo 
                estimatedDeliveryTime={order.estimated_delivery_time}
                shipmentCarrier={order.shipment_carrier}
                trackingNumber={order.tracking_number}
                trackingUrl={order.tracking_url}
              />
              
              <OrderItemsList 
                items={order.order_items} 
                totalAmount={order.total_amount} 
              />
              
              <CustomerDetails 
                name={order.name}
                address={order.address}
                phone={order.phone}
                paymentMethod={order.payment_method}
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-6 bg-gray-50">
            <div className="w-full flex flex-col md:flex-row md:justify-between gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/menu">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/track">Track Order</Link>
              </Button>
              <Button asChild className="flex-1 bg-kitchenia-orange hover:bg-orange-600">
                <Link to="/my-orders">My Orders</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <OrderHistory />
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Having issues with your order?</p>
          <p>Contact us at support@kitchenia.com or call us at +92-123-4567890</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;
