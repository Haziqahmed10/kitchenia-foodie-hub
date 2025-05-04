
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Package } from "lucide-react";
import { format } from "date-fns";

interface OrderSummary {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  status: string;
  items_summary: string;
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
          const processedOrders = ordersData.map((order) => {
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      'preparing': { color: 'bg-yellow-100 text-yellow-800', label: 'Preparing' },
      'out for delivery': { color: 'bg-blue-100 text-blue-800', label: 'Out for Delivery' },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      'pending': { color: 'bg-gray-100 text-gray-800', label: 'Pending' }
    };
    
    const defaultStatus = { color: 'bg-gray-100 text-gray-800', label: status.charAt(0).toUpperCase() + status.slice(1) };
    const statusStyle = statusMap[status.toLowerCase()] || defaultStatus;
    
    return <Badge className={statusStyle.color}>{statusStyle.label}</Badge>;
  };

  if (loading || authLoading) {
    return (
      <div className="section-container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchenia-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
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
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-gray-600">You haven't placed any orders with us yet.</p>
            <Button asChild className="mt-6 bg-kitchenia-orange hover:bg-orange-600">
              <Link to="/menu">Browse Our Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Food Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_code}</TableCell>
                    <TableCell className="max-w-xs truncate">{order.items_summary}</TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>Rs. {order.total_amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/order/${order.id}`}>
                          <FileText className="h-4 w-4 mr-1" /> View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

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
      </div>
    </motion.div>
  );
};

export default MyOrdersPage;
