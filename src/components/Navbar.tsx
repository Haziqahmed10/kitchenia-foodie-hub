
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/#menu' },
    { name: 'About', href: '/#about' },
    { name: 'Order', href: '/order' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
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
                  "text-gray-700 hover:text-kitchenia-orange font-medium transition-colors",
                  (location.pathname === item.href || (location.pathname === '/' && item.href.startsWith('/#'))) && "text-kitchenia-orange"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex">
            <Button asChild className="bg-kitchenia-orange hover:bg-orange-600">
              <Link to="/order">Order Now</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-kitchenia-peach focus:outline-none"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md font-medium",
                  (location.pathname === item.href || (location.pathname === '/' && item.href.startsWith('/#')))
                    ? "bg-kitchenia-peach text-kitchenia-orange"
                    : "text-gray-700 hover:bg-kitchenia-peach hover:text-kitchenia-orange"
                )}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Button asChild className="w-full bg-kitchenia-orange hover:bg-orange-600">
                <Link to="/order" onClick={closeMenu}>Order Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
