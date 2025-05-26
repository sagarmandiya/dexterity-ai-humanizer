import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const API_KEY = import.meta.env.VITE_UNDETECTABLE_API_KEY;
const USER_ID = import.meta.env.VITE_UNDETECTABLE_USER_ID;
const USE_API = import.meta.env.VITE_USE_API;
const CHARACTER_LIMIT = 300;

const DemoSection = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and get their credits
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from("user_credits")
            .select("credits")
            .eq("user_id", user.id)
            .single();
          
          if (error) throw error;
          setUserCredits(data.credits);
        } catch (error) {
          console.error("Error fetching user credits:", error);
        }
      }
    };

    checkUser();
    setTimeout(() => setInputText(""), 0);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length > CHARACTER_LIMIT) {
      setInputText(text.substring(0, CHARACTER_LIMIT));
    } else {
      setInputText(text);
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({ title: "Please enter some text." });
      return;
    }

    if (inputText.length < 50) {
      toast({ title: "Please enter at least 50 characters of text." });
      return;
    }

    if (inputText.length > CHARACTER_LIMIT) {
      toast({
        title: "Character limit exceeded.",
        description: `Free demo limited to ${CHARACTER_LIMIT} characters.`,
      });
      return;
    }

    // Calculate credits needed for this operation
    const creditsNeeded = Math.max(1, Math.floor(inputText.length / 100));
    
    // Check if user has enough credits (only for logged in users)
    if (user && userCredits < creditsNeeded) {
      toast({
        title: "Insufficient credits",
        description: "You don't have enough credits to humanize this text. Please upgrade your plan.",
      });
      return;
    }

    setIsProcessing(true);
    setOutputText("");

    try {
      if (USE_API === "true") {
        const submitRes = await fetch("https://humanize.undetectable.ai/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
            user_id: USER_ID,
          },
          body: JSON.stringify({
            content: inputText,
            readability: "High School",
            purpose: "Essay",
            strength: "More Human",
            model: "v2",
          }),
        });

        const submitData = await submitRes.json();
        if (!submitRes.ok) {
          console.error("📛 API Error:", submitRes.status, submitData);
          if (submitData.error === "Insufficient credits") {
            toast({
              title: "You're out of credits!",
              description: "Please upgrade your plan or wait for your quota to refresh.",
            });
            return;
          }
          throw new Error(submitData.message || "Submission failed");
        }

        if (!submitData.id) throw new Error("Submission failed");

        const retries = 10;
        const delay = 1000;
        for (let i = 0; i < retries; i++) {
          const pollRes = await fetch("https://humanize.undetectable.ai/document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: API_KEY,
              user_id: USER_ID,
            },
            body: JSON.stringify({ id: submitData.id }),
          });

          const pollData = await pollRes.json();
          if (pollData.output) {
            setOutputText(pollData.output);
            
            // Deduct credits for logged in users after successful humanization
            if (user) {
              try {
                const { error: creditError } = await supabase.rpc("decrement_user_credits", {
                  amount: creditsNeeded,
                });

                if (creditError) {
                  console.error("Failed to update credits:", creditError);
                  toast({
                    title: "Warning",
                    description: "Text humanized but failed to update credits.",
                  });
                } else {
                  setUserCredits(prev => Math.max(0, prev - creditsNeeded));
                }
              } catch (error) {
                console.error("Credit deduction error:", error);
              }
            }

            toast({
              title: "Text humanized successfully!",
              description: user ? `${creditsNeeded} credits deducted.` : "Your AI-generated text now sounds more natural.",
            });
            return;
          }
          await new Promise((res) => setTimeout(res, delay));
        }

        throw new Error("Humanization timed out.");
      } else {
        // Simulated local output
        const simulatedOutput = inputText
          .replace(/AI/gi, "artificial intelligence")
          .replace(/algorithm/gi, "process")
          .replace(/automated/gi, "carefully crafted")
          .replace(/\./g, ". Actually,");

        await new Promise((res) => setTimeout(res, 1200));
        setOutputText(simulatedOutput);

        // Deduct credits for logged in users after successful simulation
        if (user) {
          try {
            const { error: creditError } = await supabase.rpc("decrement_user_credits", {
              amount: creditsNeeded,
            });

            if (creditError) {
              console.error("Failed to update credits:", creditError);
              toast({
                title: "Warning",
                description: "Text humanized but failed to update credits.",
              });
            } else {
              setUserCredits(prev => Math.max(0, prev - creditsNeeded));
            }
          } catch (error) {
            console.error("Credit deduction error:", error);
          }
        }

        toast({
          title: "Simulated humanization complete",
          description: user ? `${creditsNeeded} credits deducted. This was a mock result since API is disabled.` : "This was a mock result since API is disabled.",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({ title: "Error", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="demo" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Try the <span className="text-gradient">AI Humanizer</span>
            </h2>
            <p className="text-lg text-gray-600">
              Paste your AI-generated text below and see the difference.
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Credits remaining: {userCredits}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-lg">
            <Card className="shadow-sm border-r-0 lg:rounded-r-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Input Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your AI-generated text here..."
                  className="h-96 resize-none text-base border-0 focus-visible:ring-0"
                  value={inputText}
                  onChange={handleInputChange}
                  maxLength={CHARACTER_LIMIT}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {inputText.length}/{CHARACTER_LIMIT} characters
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-0 lg:rounded-l-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Humanized Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Humanized output will appear here..."
                  className="h-96 resize-none text-base border-0 focus-visible:ring-0"
                  value={outputText}
                  readOnly
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Button
              onClick={handleHumanize}
              disabled={!inputText.trim() || isProcessing}
              className="px-10 py-6 text-base"
              size="lg"
            >
              {isProcessing ? "Humanizing..." : "Humanize Text"}
              {!isProcessing && <ArrowRight className="ml-2 h-6 w-6" />}
            </Button>

            <p className="mt-5 text-base text-gray-500">
              Free demo limited to {CHARACTER_LIMIT} characters.{" "}
              <a href="#pricing" className="text-primary underline hover:no-underline">
                Upgrade
              </a>{" "}
              for unlimited usage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
