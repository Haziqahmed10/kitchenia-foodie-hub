
import AboutSection from "@/components/AboutSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 bg-kitchenia-peach">
        <div className="section-container text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Learn more about our journey, values, and what makes our food special
          </p>
        </div>
      </div>
      <AboutSection />
      <TestimonialSection />
      <CTASection />
    </motion.div>
  );
};

export default AboutPage;
