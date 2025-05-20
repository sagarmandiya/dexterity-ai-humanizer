
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Bypass AI Detection",
    description: "Our advanced algorithms transform AI-generated text to bypass detection tools with high success rates."
  },
  {
    title: "Maintain Original Meaning",
    description: "Text is humanized while perfectly preserving the original meaning and intent of your content."
  },
  {
    title: "Natural Language Flow",
    description: "Adds natural variations, colloquialisms, and human speech patterns that AI typically lacks."
  },
  {
    title: "Multiple Language Support",
    description: "Supports humanization across multiple languages including English, Spanish, French, and more."
  },
  {
    title: "Grammar Preservation",
    description: "Maintains grammatical correctness while adding human-like language variations."
  },
  {
    title: "Contextual Understanding",
    description: "Adapts humanization based on context, whether academic, professional, or casual writing."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Key <span className="text-gradient">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI Humanizer uses advanced language models to transform robotic text into natural human writing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-primary shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
