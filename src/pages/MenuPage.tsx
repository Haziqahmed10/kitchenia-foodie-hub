
import MenuSection from "@/components/MenuSection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MenuPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 bg-kitchenia-peach">
        <div className="section-container text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Explore our selection of freshly prepared, homemade favorites made with love
          </p>
        </div>
      </div>
      <MenuSection />
      <div className="py-12 bg-white">
        <div className="section-container text-center">
          <Button asChild className="bg-kitchenia-orange hover:bg-orange-600">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuPage;
