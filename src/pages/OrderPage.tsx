import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getCartItems, clearCart } from "@/lib/cart";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  active: boolean | null;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const preSelectedItemId = searchParams.get("item");
  
  const [selectedItems, setSelectedItems] = useState<{
    item: MenuItem;
    quantity: number;
  }[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "easypaisa" | "jazzcash",
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setMenuItems(data);
          
          // If there's a preselected item, add it to the order
          if (preSelectedItemId && data.length > 0) {
            const selectedItem = data.find(item => item.id === preSelectedItemId);
            if (selectedItem) {
              setSelectedItems([{ item: selectedItem, quantity: 1 }]);
            }
          }

          // Check for items in cart
          const cartItems = getCartItems();
          if (cartItems.length > 0) {
            // Transform cart items to match the selectedItems format
            const selectedFromCart = cartItems.map(cartItem => {
              const menuItem = data.find(item => item.id === cartItem.id);
              if (menuItem) {
                return {
                  item: menuItem,
                  quantity: cartItem.quantity
                };
              }
              // This should not happen if cart is properly synchronized
              return null;
            }).filter(item => item !== null) as { item: MenuItem; quantity: number }[];
            
            setSelectedItems(selectedFromCart);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading menu",
          description: error.message || "Failed to load menu items",
          variant: "destructive",
        });
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [preSelectedItemId, toast]);
  
  const handleItemSelect = (item: MenuItem) => {
    const existingItem = selectedItems.find((selectedItem) => selectedItem.item.id === item.id);
    
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((selectedItem) =>
          selectedItem.item.id === item.id
            ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
            : selectedItem
        )
      );
    } else {
      setSelectedItems([...selectedItems, { item, quantity: 1 }]);
    }
  };
  
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.item.id !== itemId));
    } else {
      setSelectedItems(
        selectedItems.map((selectedItem) =>
          selectedItem.item.id === itemId
            ? { ...selectedItem, quantity }
            : selectedItem
        )
      );
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value as "cod" | "easypaisa" | "jazzcash",
    }));
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, { item, quantity }) => total + item.price * quantity,
      0
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to order",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Generate customer-friendly order code
      const currentDate = new Date();
      const dateStr = currentDate.getFullYear().toString().substring(2) +
                     (currentDate.getMonth() + 1).toString().padStart(2, '0') +
                     currentDate.getDate().toString().padStart(2, '0');
      
      // Get the next order number
      const { data: lastOrder, error: countError } = await supabase
        .from('orders')
        .select('order_code')
        .order('created_at', { ascending: false })
        .limit(1);
      
      let orderNumber = 1001;
      if (!countError && lastOrder && lastOrder.length > 0) {
        const lastOrderCode = lastOrder[0].order_code;
        if (lastOrderCode && lastOrderCode.includes('-')) {
          const lastNum = parseInt(lastOrderCode.split('-')[1]);
          if (!isNaN(lastNum)) {
            orderNumber = lastNum + 1;
          }
        }
      }
      
      const orderCode = `CK-${orderNumber}`;
      
      // Calculate estimated delivery time (30-45 minutes from now)
      const deliveryDate = new Date(currentDate.getTime() + 45 * 60000);
      const estimatedDeliveryTime = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')} - ${deliveryDate.getHours()}:${deliveryDate.getMinutes().toString().padStart(2, '0')}`;

      // First insert the order and get the order ID
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes || null,
          payment_method: formData.paymentMethod,
          total_amount: totalAmount,
          order_code: orderCode,
          status: 'preparing',
          estimated_delivery_time: estimatedDeliveryTime
        })
        .select('id')
        .single();

      if (orderError) {
        throw orderError;
      }

      if (!orderData) {
        throw new Error("Failed to create order");
      }

      // Now insert all the order items
      const orderItems = selectedItems.map(({ item, quantity }) => ({
        order_id: orderData.id,
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Create an initial status entry in the order status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderData.id,
          status: 'preparing',
          notes: 'Order received and being prepared'
        });

      // Success! Clear the cart and show success message
      clearCart();
      
      toast({
        title: "Order submitted successfully!",
        description: `Your order code is ${orderCode}. We will prepare your food right away!`,
      });
      
      // Navigate to the order confirmation page
      navigate(`/order/${orderData.id}`);
      
    } catch (error: any) {
      toast({
        title: "Error submitting order",
        description: error.message || "Failed to submit your order. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting order:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="section-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Place Your Order</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select your favorite items, fill in your details, and we'll deliver fresh homemade food to your doorstep.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-9 w-28" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200" 
                      onClick={() => handleItemSelect(item)}>
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={item.image_url || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-kitchenia-orange text-white px-3 py-1 rounded-full font-bold shadow-md">
                      Rs. {item.price}
                    </span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemSelect(item);
                      }}
                      className="w-full bg-kitchenia-orange hover:bg-orange-600"
                    >
                      Add to Order
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 mb-6">No items selected yet</p>
            ) : (
              <div className="space-y-4 mb-6">
                {selectedItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Rs. {item.price} x {quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total:</span>
                  <span className="text-kitchenia-orange">Rs. {calculateTotal()}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  placeholder="Your full name" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  placeholder="Your phone number" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  placeholder="Your complete address" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange}
                  placeholder="Any special requests" 
                />
              </div>
              
              <div>
                <Label>Payment Method</Label>
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={handlePaymentMethodChange}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa">EasyPaisa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash">JazzCash</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-kitchenia-orange hover:bg-orange-600"
                disabled={selectedItems.length === 0 || submitting}
              >
                {submitting ? "Processing..." : "Submit Order"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
