
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "@/lib/cart";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  active: boolean | null;
}

const MenuItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', id)
          .eq('active', true)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setMenuItem(data);
        }
      } catch (error: any) {
        toast({
          title: "Error loading menu item",
          description: error.message || "Failed to load menu item details",
          variant: "destructive",
        });
        console.error("Error fetching menu item:", error);
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id, toast, navigate]);

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image_url: menuItem.image_url
    }, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${menuItem.name} added to your cart`,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="section-container py-12"
    >
      <Link 
        to="/menu" 
        className="inline-flex items-center text-kitchenia-orange hover:text-orange-600 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Link>
      
      {loading ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : menuItem ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden relative">
            <img 
              src={menuItem.image_url || '/placeholder.svg'} 
              alt={menuItem.name} 
              className="w-full h-full object-cover max-h-96"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <span className="absolute top-4 right-4 bg-kitchenia-orange text-white px-4 py-2 rounded-full font-bold shadow-md text-lg">
              Rs. {menuItem.price}
            </span>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{menuItem.name}</h1>
            <p className="text-kitchenia-orange text-xl font-semibold mb-4">Rs. {menuItem.price}</p>
            
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 mb-4">{menuItem.description}</p>
              <p className="text-sm text-gray-500">Category: <span className="capitalize">{menuItem.category}</span></p>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Quantity</div>
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="font-medium">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuantityChange(1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right mt-2 font-semibold">
                  Total: Rs. {menuItem.price * quantity}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 bg-kitchenia-orange hover:bg-orange-600"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                asChild 
                className="flex-1" 
                variant="outline"
              >
                <Link to="/order">Order Now</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Menu Item Not Found</h1>
          <p className="text-gray-500 mb-6">The menu item you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-kitchenia-orange hover:bg-orange-600">
            <Link to="/menu">Back to Menu</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default MenuItemDetailPage;
