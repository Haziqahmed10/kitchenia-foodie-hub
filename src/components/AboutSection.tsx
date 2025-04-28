
import { Phone, Utensils, Truck } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16" id="about">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-kitchenia-peach rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1549590143-d5855148a9d5?q=80&w=1000&auto=format&fit=crop" 
                alt="Kitchen with homemade food preparation" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-[260px]">
              <div className="text-kitchenia-orange font-semibold text-lg mb-1">Our Promise</div>
              <p className="text-gray-600 text-sm">
                Every dish is prepared fresh, with love, using traditional recipes
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">About Kitchenia</h2>
            <p className="text-gray-700">
              Kitchenia was born from a passion for authentic homemade food. We believe everyone deserves access to fresh, delicious meals that remind them of home.
            </p>
            <p className="text-gray-700">
              Our small-scale kitchen specializes in traditional desi cuisine, focusing on wraps, shawarmas, parathas and other favorites - all prepared with the same care and attention as a home kitchen.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="bg-kitchenia-peach p-2 rounded-full mr-4">
                  <Utensils className="text-kitchenia-orange h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Homemade Quality</h3>
                  <p className="text-gray-600">Made with love just like in a mother's kitchen</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-kitchenia-peach p-2 rounded-full mr-4">
                  <Truck className="text-kitchenia-orange h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Fresh Delivery</h3>
                  <p className="text-gray-600">Delivered to your doorstep fresh and hot</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-kitchenia-peach p-2 rounded-full mr-4">
                  <Phone className="text-kitchenia-orange h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Easy Ordering</h3>
                  <p className="text-gray-600">Simple ordering process with multiple payment options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
