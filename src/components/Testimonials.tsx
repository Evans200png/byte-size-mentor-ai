
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  name: string;
  courses: string[];
  testimonial: string;
  rating: number;
  profileImage: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alice Wanjiku",
    courses: ["Cyber Security", "AI & Machine Learning"],
    testimonial: "TechBites made complex topics simple! The videos, notes, and quizzes helped me master cyber security and AI at my own pace.",
    rating: 5,
    profileImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "John Otieno",
    courses: ["Web Development", "Cloud Computing"],
    testimonial: "I loved the bite-sized lessons and interactive quizzes. I can now confidently build websites and understand cloud platforms!",
    rating: 5,
    profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Mary Njeri",
    courses: ["Mobile Development", "Data Science"],
    testimonial: "TechBites' microlearning approach kept me motivated. I enjoyed the progress tracking and learned mobile apps and data analysis efficiently.",
    rating: 5,
    profileImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Brian Mwangi",
    courses: ["AI & Machine Learning", "Web Development"],
    testimonial: "The platform's videos, structured notes, and hands-on quizzes made learning AI and web dev enjoyable and practical.",
    rating: 5,
    profileImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=150&fit=crop&crop=face"
  }
];

const Testimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Learners Say
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                {/* Profile Image */}
                <div className="mb-4">
                  <img
                    src={testimonial.profileImage}
                    alt={`${testimonial.name}'s profile`}
                    className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-blue-100"
                  />
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {testimonial.name}
                </h3>

                {/* Courses */}
                <div className="mb-3">
                  {testimonial.courses.map((course, courseIndex) => (
                    <span
                      key={courseIndex}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {course}
                    </span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  "{testimonial.testimonial}"
                </p>

                {/* Star Rating */}
                <div className="flex justify-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center">
          <Button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join Them – Start Learning Today!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
