
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  // Get plan details from location state
  const { plan, price, credits } = location.state || { 
    plan: "Basic", 
    price: "$5", 
    credits: 500 
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      setUser(data.session.user);
      
      // Pre-fill email
      if (data.session.user.email) {
        setFormData(prev => ({
          ...prev,
          email: data.session.user.email
        }));
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format card number input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) return;
    
    // Add spaces after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) return;
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    setFormData(prev => ({
      ...prev,
      expiry: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be a payment processor integration in a real app
      // For now, we'll simulate payment success and credit the user
      
      // Check if it's not a free plan
      if (price !== "$0") {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Add credits to user account
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          credits: credits,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success(`Successfully subscribed to ${plan} plan! ${credits} credits added to your account.`);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  // If price is free, auto-submit
  useEffect(() => {
    if (price === "$0" && user?.id) {
      handleSubmit(new Event('submit') as any);
    }
  }, [price, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate("/pricing")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to plans</span>
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete your subscription</CardTitle>
                <CardDescription>
                  {plan} plan ({price}{price !== "$0" ? "/month" : ""})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-5 p-3 bg-gray-50 rounded-md text-center">
                  <span className="text-xl font-bold text-primary">{credits}</span>
                  <span className="text-gray-600"> credits will be added to your account</span>
                </div>
                
                {price !== "$0" ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on card</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="John Smith" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        required
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <div className="relative">
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          required
                          className="pl-10"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry date</Label>
                        <Input 
                          id="expiry" 
                          name="expiry" 
                          placeholder="MM/YY" 
                          value={formData.expiry}
                          onChange={handleExpiryChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          name="cvc" 
                          placeholder="123" 
                          maxLength={3}
                          value={formData.cvc}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : `Subscribe for ${price}/month`}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Free Plan Selected</h3>
                    <p className="text-gray-500 mb-4">Your account will be credited with {credits} credits.</p>
                    <Button 
                      onClick={handleSubmit}
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Activate Free Plan"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
