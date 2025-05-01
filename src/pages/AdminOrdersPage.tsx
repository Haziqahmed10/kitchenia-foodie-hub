
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string | null;
  payment_method: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders ordered by most recent first
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      if (ordersData) {
        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);
            
            if (itemsError) throw itemsError;
            
            return {
              ...order,
              items: itemsData || [],
            };
          })
        );
        
        setOrders(ordersWithItems);
      }
    } catch (error: any) {
      toast({
        title: "Error loading orders",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      });
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'processing':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch(method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'easypaisa':
        return 'EasyPaisa';
      case 'jazzcash':
        return 'JazzCash';
      default:
        return method;
    }
  };

  return (
    <div className="section-container py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Customer Orders</span>
            <Button onClick={fetchOrders} variant="outline" size="sm" disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">No orders found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <>
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPaymentMethod(order.payment_method)}</TableCell>
                      <TableCell>Rs. {order.total_amount}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost"
                          size="sm" 
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          {expandedOrderId === order.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedOrderId === order.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50">
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-semibold mb-2">Customer Details</h4>
                                <p><span className="font-medium">Name:</span> {order.name}</p>
                                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                <p><span className="font-medium">Address:</span> {order.address}</p>
                                {order.notes && (
                                  <p><span className="font-medium">Notes:</span> {order.notes}</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Order Details</h4>
                                <p><span className="font-medium">Payment Method:</span> {formatPaymentMethod(order.payment_method)}</p>
                                <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
                                <p><span className="font-medium">Status:</span> {order.status}</p>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items && order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.item_name}</TableCell>
                                    <TableCell>Rs. {item.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>Rs. {item.price * item.quantity}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={3} className="text-right font-bold">
                                    Total:
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    Rs. {order.total_amount}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
