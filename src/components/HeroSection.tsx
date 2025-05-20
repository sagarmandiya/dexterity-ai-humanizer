
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
            Make AI-Generated Text <span className="text-gradient">Sound Human</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our advanced AI text converter transforms robotic, AI-generated content into natural-sounding, human-like text that engages readers and bypasses AI detection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-base font-medium px-8" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              Try Humanizer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base font-medium px-8">
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>Trusted by 10,000+ content creators, students, and professionals</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
