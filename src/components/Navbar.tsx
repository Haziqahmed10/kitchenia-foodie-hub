
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully!",
        description: "You have been signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.nav
      className="bg-white shadow-md sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-2xl text-gray-800">
              Kitchenia
            </Link>
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.full_name as string} />
                      <AvatarFallback>{(user?.user_metadata?.full_name as string)?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kitchenia-orange"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </motion.nav>
  );
};

const NavLinks = () => (
  <div className="ml-10 flex items-baseline space-x-4">
    <Link
      to="/"
      className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 px-4 py-2 rounded-md hover:bg-gray-100"
    >
      Home
    </Link>
    <Link
      to="/menu"
      className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 px-4 py-2 rounded-md hover:bg-gray-100"
    >
      Menu
    </Link>
    <Link
      to="/about"
      className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 px-4 py-2 rounded-md hover:bg-gray-100"
    >
      About
    </Link>
    <Link
      to="/order"
      className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 px-4 py-2 rounded-md hover:bg-gray-100"
    >
      Order
    </Link>
  </div>
);

const MobileMenu = ({ isOpen, toggleMenu }: { isOpen: boolean; toggleMenu: () => void }) => (
  <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <Link
        to="/"
        className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
      >
        Home
      </Link>
      <Link
        to="/menu"
        className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
      >
        Menu
      </Link>
      <Link
        to="/about"
        className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
      >
        About
      </Link>
      <Link
        to="/order"
        className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
      >
        Order
      </Link>
      {isOpen && (
        <Link
          to="/my-orders"
          className="text-gray-700 hover:text-kitchenia-orange transition-colors duration-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
        >
          My Orders
        </Link>
      )}
    </div>
  </div>
);

export default Navbar;
