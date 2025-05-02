
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, ArrowLeft, Truck, PackageCheck, AlertTriangle, ExternalLink } from "lucide-react";
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
  tracking_number: string | null;
  shipment_carrier: string | null;
  tracking_url: string | null;
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
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: "",
    carrier: "",
    trackingUrl: ""
  });

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

  const startEditingOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setTrackingInfo({
      trackingNumber: order.tracking_number || "",
      carrier: order.shipment_carrier || "",
      trackingUrl: order.tracking_url || ""
    });
  };

  const cancelEditingOrder = () => {
    setEditingOrderId(null);
    setTrackingInfo({
      trackingNumber: "",
      carrier: "",
      trackingUrl: ""
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update the order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (updateError) throw updateError;

      // Add entry to status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: newStatus,
          notes: statusNote || null
        });
      
      if (historyError) throw historyError;

      // Refresh orders list
      await fetchOrders();
      
      setStatusNote("");
      
      toast({
        title: "Order status updated",
        description: `Order status has been changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
      console.error("Error updating order status:", error);
    }
  };

  const saveTrackingInfo = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingInfo.trackingNumber || null,
          shipment_carrier: trackingInfo.carrier || null,
          tracking_url: trackingInfo.trackingUrl || null
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // If adding tracking info for the first time and status is pending/processing, update to shipped
      const order = orders.find(o => o.id === orderId);
      if (order && ['pending', 'processing'].includes(order.status.toLowerCase()) && 
          trackingInfo.trackingNumber && !order.tracking_number) {
        await updateOrderStatus(orderId, 'shipped');
      } else {
        await fetchOrders();
      }
      
      setEditingOrderId(null);
      
      toast({
        title: "Tracking information updated",
        description: "Order tracking details have been saved",
      });
    } catch (error: any) {
      toast({
        title: "Error saving tracking info",
        description: error.message || "Failed to save tracking information",
        variant: "destructive",
      });
      console.error("Error saving tracking info:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'processing':
        return "bg-blue-100 text-blue-800";
      case 'shipped':
        return "bg-purple-100 text-purple-800";
      case 'delivered':
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
                            
                            {/* Tracking Information */}
                            <div className="mb-6 p-4 border rounded-md bg-white">
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Truck className="h-4 w-4 mr-2" />
                                Shipping & Tracking
                              </h4>
                              
                              {editingOrderId === order.id ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                                      <Input
                                        id="trackingNumber"
                                        value={trackingInfo.trackingNumber}
                                        onChange={(e) => setTrackingInfo({...trackingInfo, trackingNumber: e.target.value})}
                                        placeholder="Enter tracking number"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="carrier">Carrier</Label>
                                      <Input
                                        id="carrier"
                                        value={trackingInfo.carrier}
                                        onChange={(e) => setTrackingInfo({...trackingInfo, carrier: e.target.value})}
                                        placeholder="e.g. FedEx, UPS, DHL"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="trackingUrl">Tracking URL</Label>
                                    <Input
                                      id="trackingUrl"
                                      value={trackingInfo.trackingUrl}
                                      onChange={(e) => setTrackingInfo({...trackingInfo, trackingUrl: e.target.value})}
                                      placeholder="https://..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Full URL to carrier's tracking page for this shipment</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button onClick={() => saveTrackingInfo(order.id)}>Save Tracking Info</Button>
                                    <Button variant="outline" onClick={cancelEditingOrder}>Cancel</Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {order.tracking_number ? (
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Tracking Number:</span> {order.tracking_number}</p>
                                      {order.shipment_carrier && <p><span className="font-medium">Carrier:</span> {order.shipment_carrier}</p>}
                                      {order.tracking_url && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(order.tracking_url, "_blank")}
                                          className="mt-2"
                                        >
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View Tracking
                                        </Button>
                                      )}
                                      <div className="pt-2">
                                        <Button size="sm" onClick={() => startEditingOrder(order)}>Update Tracking</Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-gray-500 mb-2">No tracking information added yet.</p>
                                      <Button size="sm" onClick={() => startEditingOrder(order)}>Add Tracking</Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Order Status Update */}
                            <div className="mb-6 p-4 border rounded-md bg-white">
                              <h4 className="font-semibold mb-2">Update Order Status</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                  <Label htmlFor="statusNote">Status Note (Optional)</Label>
                                  <Textarea
                                    id="statusNote"
                                    placeholder="Add a note about this status update"
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    className="h-20"
                                  />
                                </div>
                                <div>
                                  <Label>Change Status</Label>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'pending')}
                                      disabled={order.status === 'pending'}
                                    >
                                      Pending
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'processing')}
                                      disabled={order.status === 'processing'}
                                      className="bg-blue-50 hover:bg-blue-100"
                                    >
                                      Processing
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                                      disabled={order.status === 'shipped'}
                                      className="bg-purple-50 hover:bg-purple-100"
                                    >
                                      <Truck className="h-3 w-3 mr-1" /> Shipped
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                                      disabled={order.status === 'delivered'}
                                      className="bg-green-50 hover:bg-green-100"
                                    >
                                      <PackageCheck className="h-3 w-3 mr-1" /> Delivered
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      disabled={order.status === 'cancelled'}
                                      className="bg-red-50 hover:bg-red-100 md:col-span-2"
                                    >
                                      <AlertTriangle className="h-3 w-3 mr-1" /> Cancelled
                                    </Button>
                                  </div>
                                </div>
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
