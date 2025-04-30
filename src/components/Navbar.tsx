
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Order', href: '/order' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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

    // Add scroll listener for navbar styling
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-kitchenia-orange font-display font-bold text-2xl">Kitchenia</span>
            </Link>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-gray-700 hover:text-kitchenia-orange font-medium transition-colors relative group",
                  location.pathname === item.href && "text-kitchenia-orange"
                )}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kitchenia-orange transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex">
            <Button asChild className="bg-kitchenia-orange hover:bg-orange-600 transition-all duration-300 rounded-full px-5">
              <Link to="/order" className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <Badge variant="secondary" className="bg-white text-kitchenia-orange ml-1">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/order" className="relative">
              <ShoppingCart className="h-6 w-6 text-kitchenia-orange" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-kitchenia-peach focus:outline-none transition-colors"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-kitchenia-peach text-kitchenia-orange"
                    : "text-gray-700 hover:bg-kitchenia-peach hover:text-kitchenia-orange"
                )}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Button asChild className="w-full bg-kitchenia-orange hover:bg-orange-600 transition-all duration-300">
                <Link to="/order" onClick={closeMenu} className="flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
