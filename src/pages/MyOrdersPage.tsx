
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { OrdersList } from "@/components/orders/OrdersList";
import { EmptyOrdersState } from "@/components/orders/EmptyOrdersState";
import { LoadingState } from "@/components/orders/LoadingState";
import { OrderHistory } from "@/components/orders/OrderHistory";

interface OrderSummary {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  status: string;
  items_summary: string;
}

// Define an interface that matches what we get from the database
interface OrderData {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  address: string;
  name: string;
  notes: string | null;
  payment_method: string;
  phone: string;
  shipment_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  order_code?: string; // Optional since it might not exist in the database
  order_items: Array<{
    item_name: string;
    quantity: number;
  }>;
}

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your orders",
      });
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Get orders with their items
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*, order_items(item_name, quantity)")
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData) {
          // Process the order data to create summaries
          const processedOrders = ordersData.map((order: OrderData) => {
            // Create a summary of items (e.g., "2 Burgers, 1 Fries")
            const itemsSummary = order.order_items
              .map((item: any) => `${item.quantity} ${item.item_name}`)
              .join(", ");
            
            // Generate order code if it doesn't exist
            const orderCode = order.order_code || `CK-${order.id.substring(0, 4)}`;
            
            return {
              id: order.id,
              order_code: orderCode,
              created_at: order.created_at,
              total_amount: order.total_amount,
              status: order.status,
              items_summary: itemsSummary
            };
          });
          
          setOrders(processedOrders);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching orders",
          description: error.message || "Could not load your orders",
          variant: "destructive",
        });
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate, toast]);

  if (loading || authLoading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      className="section-container py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
            <p className="text-gray-600 mt-2">View and track all your orders</p>
          </div>
          <Button asChild className="bg-kitchenia-orange hover:bg-orange-600">
            <Link to="/order">Place New Order</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <OrdersList orders={orders} />
        )}

        <OrderHistory />
      </div>
    </motion.div>
  );
};

export default MyOrdersPage;
