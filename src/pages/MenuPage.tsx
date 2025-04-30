
import MenuSection from "@/components/MenuSection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const MenuPage = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('kitcheniaCart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        const count = cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
        setCartItemCount(count);
      }
    };

    // Initial count
    updateCartCount();

    // Listen for storage events
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for when we update cart ourselves
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 bg-gradient-to-r from-kitchenia-peach to-kitchenia-lightOrange">
        <div className="section-container text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Explore our selection of freshly prepared, homemade favorites made with love
          </p>
          
          <Card className="mt-8 shadow-lg border-0 max-w-md mx-auto bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <Link to="/menu?category=shawarma" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="font-medium">Fresh Shawarmas</span>
                  <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                </Link>
                <Link to="/menu?category=paratha" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="font-medium">Homemade Parathas</span>
                  <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                </Link>
                <Link to="/menu?category=wrap" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="font-medium">Specialty Wraps</span>
                  <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {cartItemCount > 0 && (
            <div className="mt-6">
              <Button asChild className="bg-kitchenia-orange hover:bg-orange-600">
                <Link to="/order" className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart ({cartItemCount})
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="py-8 bg-white">
        <div className="section-container">
          <MenuSection />
        </div>
      </div>
      
      <div className="py-12 bg-kitchenia-lightGray">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Place Your Order?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Experience our delicious meals delivered straight to your door or pick up at our location.
          </p>
          <Button asChild size="lg" className="bg-kitchenia-orange hover:bg-orange-600">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuPage;
