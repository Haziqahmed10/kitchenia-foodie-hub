
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderDetails {
  id: string;
  order_code: string;
  status: string;
  name: string;
  address: string;
  phone: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  estimated_delivery_time: string;
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
          setOrder(data as OrderDetails);
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
              setOrder(refreshedOrder as OrderDetails);
              
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

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "out for delivery":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="section-container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchenia-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
          <p className="mt-4 text-gray-600">We couldn't find the order you're looking for.</p>
          <Button asChild className="mt-6">
            <a href="/order">Place New Order</a>
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
          <div className="bg-kitchenia-orange p-4 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Order Code: {order.order_code}</h2>
              <p className="text-sm opacity-90">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
            </div>
            <Badge className={getStatusBadgeColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-kitchenia-orange" />
                <div>
                  <h3 className="font-medium">Estimated Delivery Time</h3>
                  <p className="text-gray-600">{order.estimated_delivery_time}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Order Items</h3>
                <div className="space-y-3">
                  {order.order_items.map((item) => (
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
                    <p>Rs. {order.total_amount}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Delivery Address</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-gray-600">{order.address}</p>
                    <p className="text-gray-600">{order.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payment Method</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="capitalize">{order.payment_method.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-6 bg-gray-50">
            <div className="w-full flex flex-col md:flex-row md:justify-between gap-4">
              <Button asChild variant="outline" className="flex-1">
                <a href="/menu">Continue Shopping</a>
              </Button>
              <Button asChild className="flex-1 bg-kitchenia-orange hover:bg-orange-600">
                <a href="/my-orders">My Orders</a>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Having issues with your order?</p>
          <p>Contact us at support@kitchenia.com or call us at +92-123-4567890</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;
