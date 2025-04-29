
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      
      <section className="bg-kitchenia-lightGray py-16" id="menu-preview">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Popular Items</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A glimpse of our most loved dishes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 5].map((id) => {
              const item = menuItems.find(item => item.id === id);
              if (!item) return null;
              
              return (
                <div key={item.id} className="food-card group">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="text-kitchenia-orange font-semibold">Rs. {item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-kitchenia-orange hover:bg-orange-600">
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <AboutSection />
      <TestimonialSection />
      <CTASection />
    </motion.div>
  );
};

// This is just for the HomePage component to show menu highlights
const menuItems = [
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
    id: 5,
    name: "Veggie Wrap",
    description: "Fresh vegetables with hummus and our special dressing",
    price: 250,
    image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?q=80&w=1000&auto=format&fit=crop",
    category: "wrap"
  },
];

export default HomePage;
