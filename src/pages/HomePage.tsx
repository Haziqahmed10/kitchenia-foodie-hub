
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
}

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true)
          .limit(3);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setFeaturedItems(data);
        }
      } catch (error: any) {
        toast({
          title: "Error loading featured menu items",
          description: error.message || "Failed to load menu items",
          variant: "destructive",
        });
        console.error("Error fetching featured menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, [toast]);

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
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <div key={id} className="food-card">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Link 
                  to={`/menu/${item.id}`} 
                  key={item.id} 
                  className="food-card group cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image_url || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-kitchenia-orange text-white px-3 py-1 rounded-full font-bold shadow-md">
                      Rs. {item.price}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="text-kitchenia-orange font-medium hover:underline text-center">
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
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

export default HomePage;
