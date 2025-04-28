
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-kitchenia-peach to-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613612205207-1d2a7245fe82?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Homemade Taste, <span className="text-kitchenia-orange">Delivered Fresh</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              Authentic desi food made with love and care. From delicious wraps and shawarma to flavorful parathas - all prepared just like home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-kitchenia-orange hover:bg-orange-600 text-lg">
                <Link to="/order">Order Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-kitchenia-orange text-kitchenia-orange hover:bg-kitchenia-peach hover:text-kitchenia-orange text-lg">
                <Link to="/#menu">View Menu</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block animate-fade-in">
            <div className="aspect-square rounded-full bg-kitchenia-orange/10 p-8">
              <img 
                src="https://images.unsplash.com/photo-1662116663302-5ef623fb1d9d?q=80&w=1000&auto=format&fit=crop" 
                alt="Delicious wraps and rolls" 
                className="rounded-full object-cover w-full h-full shadow-xl"
              />
            </div>
            <div className="absolute top-5 -right-10 bg-white rounded-lg shadow-lg p-4 max-w-[180px]">
              <div className="font-bold text-kitchenia-orange">Fresh Ingredients</div>
              <div className="text-sm text-gray-600">Quality ingredients for authentic taste</div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-lg shadow-lg p-4 max-w-[180px]">
              <div className="font-bold text-kitchenia-orange">Homemade Style</div>
              <div className="text-sm text-gray-600">Just like mother's kitchen</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
