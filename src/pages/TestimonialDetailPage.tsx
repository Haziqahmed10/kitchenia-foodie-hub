
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Regular Customer",
    content: "The wraps from Kitchenia are amazing! So fresh and tasty, they remind me of my mother's cooking. Delivery is always on time as well.",
    avatar: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
    extendedContent: "I've been ordering from Kitchenia for months now, and the consistency in quality and service is remarkable. Their wraps have become a weekly staple in my household. The ingredients are always fresh, and you can taste the care they put into each dish.",
  },
  {
    id: 2,
    name: "Fatima Ahmed",
    role: "Food Lover",
    content: "I order their parathas at least twice a week. The quality has been consistently excellent, and the homemade taste is unmistakable!",
    avatar: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    extendedContent: "As someone who's very particular about authentic taste, I can confidently say that Kitchenia's parathas are the closest you can get to homemade goodness. The stuffing is generous, and the texture is perfect - crispy on the outside and soft inside.",
  },
  {
    id: 3,
    name: "Sara Malik",
    role: "Busy Mom",
    content: "Kitchenia has made my life so much easier. I can serve fresh, homemade-style food to my family even on my busiest days.",
    avatar: "https://images.unsplash.com/photo-1439886183900-e79ec0057170",
    extendedContent: "As a working mother, finding time to cook fresh meals can be challenging. Kitchenia has been a lifesaver. My kids love their food, and I love that I can trust the quality. Their delivery is always prompt, which helps me plan our meals better.",
  }
];

const TestimonialDetailPage = () => {
  const { id } = useParams();
  const testimonial = testimonials.find(t => t.id === Number(id));

  if (!testimonial) {
    return (
      <div className="section-container py-16 min-h-screen">
        <div className="text-center">
          <p className="text-xl">Testimonial not found</p>
          <Button asChild className="mt-4">
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-16 min-h-screen animate-fade-in">
      <Button 
        variant="ghost" 
        asChild 
        className="mb-8 hover:bg-orange-100"
      >
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-6 mb-8">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{testimonial.name}</h1>
            <p className="text-gray-600">{testimonial.role}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-xl italic text-gray-700 border-l-4 border-kitchenia-orange pl-4">
            "{testimonial.content}"
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {testimonial.extendedContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDetailPage;
