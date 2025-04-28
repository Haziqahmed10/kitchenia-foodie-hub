
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-kitchenia-orange to-red-500 text-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Taste Homemade Goodness?</h2>
          <p className="text-lg mb-8 text-white/90">
            Order now and experience the authentic flavors of our kitchen delivered fresh to your doorstep.
          </p>
          <Button asChild size="lg" className="bg-white text-kitchenia-orange hover:bg-kitchenia-peach">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
