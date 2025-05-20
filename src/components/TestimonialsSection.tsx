
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "SJ",
    quote: "AI Humanizer has transformed my workflow. My content is now indistinguishable from human writing, saving me hours of editing time.",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    avatar: "MC",
    quote: "Our marketing copy now has the perfect balance of efficiency and human touch. AI Humanizer is an essential tool for our team.",
  },
  {
    name: "Jessica Rivera",
    role: "Freelance Writer",
    avatar: "JR",
    quote: "I use AI for research but struggled with making it sound natural. This tool delivers exactly what it promises - humanized text that flows naturally.",
  },
  {
    name: "David Patel",
    role: "Academic Researcher",
    avatar: "DP",
    quote: "The ability to maintain technical accuracy while adding a human touch to my papers has been invaluable for my academic publishing.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              What Our <span className="text-gradient">Users Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of writers, marketers, and students trust AI Humanizer for their content needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-white">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <blockquote className="flex-grow mb-4">
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    </blockquote>
                    <footer>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </footer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="p-4 bg-primary/10 rounded-lg inline-block">
              <p className="font-medium">
                Join 10,000+ satisfied users improving their content with AI Humanizer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
