
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const menuItems: MenuItem[] = [
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
    id: 3,
    name: "Aloo Paratha",
    description: "Whole wheat paratha stuffed with spiced potatoes and served with yogurt",
    price: 200,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
    category: "paratha"
  },
  {
    id: 4,
    name: "Chicken Cheese Paratha",
    description: "Flaky paratha with chicken and cheese stuffing",
    price: 280,
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=1000&auto=format&fit=crop",
    category: "paratha"
  },
  {
    id: 5,
    name: "Veggie Wrap",
    description: "Fresh vegetables with hummus and our special dressing",
    price: 250,
    image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?q=80&w=1000&auto=format&fit=crop",
    category: "wrap"
  },
  {
    id: 6,
    name: "Chicken Tikka Wrap",
    description: "Spicy chicken tikka wrapped with mint chutney and salad",
    price: 320,
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1000&auto=format&fit=crop",
    category: "wrap"
  },
];

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredItems = activeTab === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white shadow-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="shawarma">Shawarma</TabsTrigger>
            <TabsTrigger value="paratha">Parathas</TabsTrigger>
            <TabsTrigger value="wrap">Wraps</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="food-card group">
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute bottom-2 right-2 bg-kitchenia-orange text-white px-2 py-1 rounded-md font-bold">
                    Rs. {item.price}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Button asChild variant="outline" className="w-full border-kitchenia-orange text-kitchenia-orange hover:bg-kitchenia-peach">
                    <Link to={`/order?item=${item.id}`}>Order Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSection;
