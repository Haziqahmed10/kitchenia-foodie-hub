
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  active: boolean | null;
}

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setMenuItems(data);
        }
      } catch (error: any) {
        toast({
          title: "Error loading menu",
          description: error.message || "Failed to load menu items",
          variant: "destructive",
        });
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();

    // Set up a realtime subscription for menu updates
    const channel = supabase
      .channel('menu_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items' 
        }, 
        () => {
          // Refetch data when changes occur
          fetchMenuItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  const filteredItems = activeTab === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white shadow-md rounded-full p-1">
            <TabsTrigger value="all" className="rounded-full px-6">All</TabsTrigger>
            <TabsTrigger value="shawarma" className="rounded-full px-6">Shawarma</TabsTrigger>
            <TabsTrigger value="paratha" className="rounded-full px-6">Parathas</TabsTrigger>
            <TabsTrigger value="wrap" className="rounded-full px-6">Wraps</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
          {loading ? (
            // Loading state - show skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="food-card">
                  <Skeleton className="h-52 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="food-card group hover-lift stagger-item animate-fade-in opacity-0" style={{animationDelay: `${index * 0.1}s`}}>
                  <Link to={`/menu/${item.id}`} className="h-52 overflow-hidden relative block">
                    <img 
                      src={item.image_url || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.name}</h3>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 bg-kitchenia-orange text-white px-3 py-1 rounded-full font-bold shadow-md">
                      Rs. {item.price}
                    </span>
                  </Link>
                  <div className="p-4">
                    <Link to={`/menu/${item.id}`}>
                      <h3 className="font-bold text-lg mb-2 hover:text-kitchenia-orange transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" className="flex-1 border-kitchenia-orange text-kitchenia-orange hover:bg-kitchenia-peach">
                        <Link to={`/menu/${item.id}`}>View Details</Link>
                      </Button>
                      <Button asChild className="flex-1 bg-kitchenia-orange hover:bg-orange-600">
                        <Link to={`/order?item=${item.id}`}>Order</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No menu items found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSection;
