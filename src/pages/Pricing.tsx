
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePlanSelect = (plan: any) => {
    if (!user) {
      // User is not logged in, redirect to auth page
      navigate("/auth");
    } else {
      // User is logged in, proceed to payment page
      navigate("/payment", { 
        state: { 
          plan: plan.name, 
          price: plan.price,
          credits: plan.credits 
        } 
      });
    }
  };

  const pricingPlans = [
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                  Simple, <span className="text-gradient">Transparent</span> Pricing
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose the plan that works best for your needs with no hidden fees.
                </p>
                
                {!user && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button className="flex items-center gap-2" onClick={() => navigate("/auth")}>
                      <LogIn className="h-4 w-4" />
                      <span>Log in to your account</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/auth?signup=true")}>
                      <UserPlus className="h-4 w-4" />
                      <span>Sign up for free</span>
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <Card 
                    key={index} 
                    className={`relative ${plan.isPopular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}
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
                        onClick={() => handlePlanSelect(plan)}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
