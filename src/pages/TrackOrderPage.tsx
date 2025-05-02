
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, PackageCheck, Truck, Box, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  identifier: z.string().min(1, "Please enter an order ID or tracking number")
});

const TrackOrderPage = () => {
  const { toast } = useToast();
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: ""
    }
  });

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ["order", searchValue],
    queryFn: async () => {
      if (!searchValue) return null;
      
      // First, try to find by order ID
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`id.eq.${searchValue},tracking_number.eq.${searchValue}`)
        .single();
      
      if (orderError) {
        console.error("Error fetching order:", orderError);
        throw new Error("Order not found");
      }
      
      // Get order status history
      const { data: historyData, error: historyError } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('status_timestamp', { ascending: false });
      
      if (historyError) {
        console.error("Error fetching status history:", historyError);
      }
      
      return {
        ...orderData,
        status_history: historyData || []
      };
    },
    enabled: searchSubmitted && !!searchValue,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchValue(values.identifier);
    setSearchSubmitted(true);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <AlertTriangle className="h-5 w-5" />;
      case 'processing':
        return <Box className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <PackageCheck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="section-container py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Order</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your order ID or tracking number to get real-time information about your delivery.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Order</CardTitle>
            <CardDescription>
              Enter the order ID or tracking number that was provided in your confirmation email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID or Tracking Number</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="Enter your order ID or tracking number" {...field} />
                        </FormControl>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Searching..." : "Track"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isError && searchSubmitted && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Order not found</p>
              </div>
              <p className="mt-2 text-sm text-red-500">
                We couldn't find an order with the ID or tracking number you provided. Please check and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Details</CardTitle>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                <CardDescription>Order placed on {format(new Date(order.created_at), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                    <p className="mt-1 font-medium">{order.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1">{order.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                    <p className="mt-1">{order.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                    <p className="mt-1">{order.phone}</p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Shipment Details</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {order.shipment_carrier && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Carrier</h4>
                          <p className="mt-1">{order.shipment_carrier}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Tracking Number</h4>
                        <p className="mt-1 font-medium">{order.tracking_number}</p>
                      </div>
                      
                      {order.tracking_url && (
                        <div className="md:col-span-2">
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(order.tracking_url, "_blank")}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Track with carrier
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {order.order_items && order.order_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.item_name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">Rs. {item.price * item.quantity}</p>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t font-medium">
                      <p>Total</p>
                      <p>Rs. {order.total_amount}</p>
                    </div>
                  </div>
                </div>

                {order.status_history && order.status_history.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      {order.status_history.map((history: any) => (
                        <div key={history.id} className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          </div>
                          <div>
                            <p className="font-medium">
                              {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(history.status_timestamp), "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                            {history.notes && <p className="text-sm mt-1">{history.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
