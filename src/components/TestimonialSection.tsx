
const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Regular Customer",
    content: "The wraps from Kitchenia are amazing! So fresh and tasty, they remind me of my mother's cooking. Delivery is always on time as well.",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: 2,
    name: "Fatima Ahmed",
    role: "Food Lover",
    content: "I order their parathas at least twice a week. The quality has been consistently excellent, and the homemade taste is unmistakable!",
    avatar: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
  },
  {
    id: 3,
    name: "Sara Malik",
    role: "Busy Mom",
    content: "Kitchenia has made my life so much easier. I can serve fresh, homemade-style food to my family even on my busiest days.",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  }
];

const TestimonialSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-kitchenia-lightGray py-16">
      <div className="section-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - here's what our regular customers have to say
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">{testimonial.content}</p>
              <div className="mt-4 flex text-kitchenia-orange">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
