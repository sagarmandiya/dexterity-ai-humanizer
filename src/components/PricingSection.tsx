
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out the service",
      features: [
        "300 characters per conversion",
        "Standard humanization",
        "3 conversions per day",
        "Basic AI detection avoidance"
      ],
      buttonText: "Get Started",
      isPopular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "For professionals and content creators",
      features: [
        "Unlimited characters per conversion",
        "Enhanced humanization quality",
        "Unlimited conversions",
        "Advanced AI detection avoidance",
        "Priority support",
        "Custom tone settings"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "5 team members",
        "API access",
        "Administrative dashboard",
        "Custom integrations",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
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
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
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
                  >
                    {plan.buttonText}
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
