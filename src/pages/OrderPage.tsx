
import { useState } from "react";
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

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Chicken Shawarma",
    description: "Tender chicken wrapped in freshly made roti with garlic sauce and pickles",
    price: 350,
    image: "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=1000&auto=format&fit=crop",
    category: "shawarma"
  },
  {
    id: 2,
    name: "Beef Shawarma Special",
    description: "Juicy beef with tahini sauce, pickled vegetables and fresh herbs",
    price: 400,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop",
    category: "shawarma"
  },
  {
    id: 3,
    name: "Aloo Paratha",
    description: "Whole wheat paratha stuffed with spiced potatoes and served with yogurt",
    price: 200,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
    category: "paratha"
  },
  {
    id: 4,
    name: "Chicken Cheese Paratha",
    description: "Flaky paratha with chicken and cheese stuffing",
    price: 280,
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=1000&auto=format&fit=crop",
    category: "paratha"
  },
  {
    id: 5,
    name: "Veggie Wrap",
    description: "Fresh vegetables with hummus and our special dressing",
    price: 250,
    image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?q=80&w=1000&auto=format&fit=crop",
    category: "wrap"
  },
  {
    id: 6,
    name: "Chicken Tikka Wrap",
    description: "Spicy chicken tikka wrapped with mint chutney and salad",
    price: 320,
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1000&auto=format&fit=crop",
    category: "wrap"
  },
];

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(location.search);
  const preSelectedItemId = searchParams.get("item");
  
  const [selectedItems, setSelectedItems] = useState<{
    item: MenuItem;
    quantity: number;
  }[]>(
    preSelectedItemId 
      ? [{ 
          item: menuItems.find(item => item.id === parseInt(preSelectedItemId)) || menuItems[0], 
          quantity: 1 
        }]
      : []
  );
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "easypaisa" | "jazzcash",
  });
  
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
  
  const handleQuantityChange = (itemId: number, quantity: number) => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    toast({
      title: "Order submitted successfully!",
      description: "We will contact you shortly to confirm your order.",
    });
    
    // Reset form after submission
    setSelectedItems([]);
    setFormData({
      name: "",
      phone: "",
      address: "",
      notes: "",
      paymentMethod: "cod",
    });
    
    // In a real app, you would submit the order to a server here
    console.log("Order submitted:", { items: selectedItems, ...formData });
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="font-medium text-kitchenia-orange">Rs. {item.price}</p>
                  <Button 
                    onClick={() => handleItemSelect(item)}
                    className="bg-kitchenia-orange hover:bg-orange-600"
                  >
                    Add to Order
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                disabled={selectedItems.length === 0}
              >
                Submit Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
