
import MenuSection from "@/components/MenuSection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

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

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="py-12 bg-gradient-to-r from-kitchenia-peach to-kitchenia-lightOrange overflow-hidden">
        <div className="section-container text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            variants={itemVariants}
          >
            Our Menu
          </motion.h1>
          <motion.p 
            className="text-gray-700 max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            Explore our selection of freshly prepared, homemade favorites made with love
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Card className="mt-8 shadow-lg border-0 max-w-md mx-auto bg-white/90 backdrop-blur-sm hover-lift">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-2">
                  <Link to="/menu?category=shawarma" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="font-medium">Fresh Shawarmas</span>
                    <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                  </Link>
                  <Link to="/menu?category=paratha" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="font-medium">Homemade Parathas</span>
                    <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                  </Link>
                  <Link to="/menu?category=wrap" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="font-medium">Specialty Wraps</span>
                    <ChevronRight className="h-5 w-5 text-kitchenia-orange" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {cartItemCount > 0 && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild className="bg-kitchenia-orange hover:bg-orange-600 rounded-full px-6">
                <Link to="/order" className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart
                  <Badge variant="secondary" className="bg-white text-kitchenia-orange ml-2">
                    {cartItemCount}
                  </Badge>
                </Link>
              </Button>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Place Your Order?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Experience our delicious meals delivered straight to your door or pick up at our location.
            </p>
            <Button asChild size="lg" className="bg-kitchenia-orange hover:bg-orange-600 rounded-full px-8">
              <Link to="/order" className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuPage;
