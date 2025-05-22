
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for trying it out",
      credits: 50,
      features: [
        "50 credits per month",
        "Standard humanization quality",
        "Basic AI detection avoidance",
        "Email support"
      ],
      buttonText: "Select Plan",
      isPopular: false
    },
    {
      name: "Basic",
      price: "$5",
      period: "/month",
      description: "Great for occasional use",
      credits: 500,
      features: [
        "500 credits per month",
        "Enhanced humanization quality",
        "Advanced AI detection avoidance",
        "Priority email support",
        "Tone adjustment"
      ],
      buttonText: "Select Plan",
      isPopular: true
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      description: "For professional content creators",
      credits: 2000,
      features: [
        "2000 credits per month",
        "Premium humanization quality",
        "Best-in-class AI detection avoidance",
        "Priority support with 24h response",
        "Custom tone settings",
        "API access"
      ],
      buttonText: "Select Plan",
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`${plan.isPopular ? 'border-primary shadow-lg shadow-primary/20 relative' : ''}`}
              >
                {plan.isPopular && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-primary text-white text-xs py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-5 p-3 bg-gray-50 rounded-md text-center">
                    <span className="text-xl font-bold text-primary">{plan.credits}</span>
                    <span className="text-gray-600"> credits per month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/pricing">{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
