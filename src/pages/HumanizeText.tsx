import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_KEY = import.meta.env.VITE_UNDETECTABLE_API_KEY;
const USER_ID = import.meta.env.VITE_UNDETECTABLE_USER_ID;
const ENV_USE_API = import.meta.env.VITE_USE_API;

const HumanizeText = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Project");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [maxCharacters, setMaxCharacters] = useState(null);

  // 🔁 Runtime override of USE_API
  const [useAPI, setUseAPI] = useState(ENV_USE_API === "true");

  useEffect(() => {
    const fetchUserCredits = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_credits")
          .select("credits")
          .single();

        if (error) throw error;
        setUserCredits(data.credits);
        setMaxCharacters(data.credits <= 0 ? 300 : null);
      } catch (error) {
        console.error("Error fetching user credits:", error);
        toast.error("Failed to fetch user credits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCredits();
    setTimeout(() => setInputText(""), 0);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (maxCharacters !== null && text.length > maxCharacters) {
      setInputText(text.substring(0, maxCharacters));
    } else {
      setInputText(text);
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to humanize.");
      return;
    }

    if (inputText.length < 50) {
      toast.error("Please enter at least 50 characters.");
      return;
    }

    setIsProcessing(true);
    setOutputText("");

    try {
      if (useAPI) {
        const response = await fetch("https://humanize.undetectable.ai/submit", {
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
            model: "v11",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("🔴 API Error:", response.status, data);
          if (data.error === "Insufficient credits") {
            toast.error("You're out of credits. Please upgrade your plan.");
            return;
          }
          throw new Error(data.message || "Submission failed");
        }

        if (!data.id) throw new Error("Submission failed");

        let retries = 10;
        let output = "";
        while (retries-- > 0) {
          const check = await fetch("https://humanize.undetectable.ai/document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: API_KEY,
              user_id: USER_ID,
            },
            body: JSON.stringify({ id: data.id }),
          });

          const checkData = await check.json();
          if (checkData.output) {
            output = checkData.output;
            break;
          }
          await new Promise((res) => setTimeout(res, 1000));
        }

        if (!output) throw new Error("Humanization failed to complete in time.");
        setOutputText(output);
        toast.success("Text humanized successfully!");
      } else {
        const simulatedOutput = inputText
          .replace(/AI/gi, "artificial intelligence")
          .replace(/algorithm/gi, "process")
          .replace(/automated/gi, "carefully crafted")
          .replace(/\./g, ". Actually,");

        await new Promise((res) => setTimeout(res, 1200));
        setOutputText(simulatedOutput);
        toast.success("Simulated humanization complete (API disabled).");
      }
    } catch (error: any) {
      console.error("Humanize error:", error);
      toast.error(error.message || "Failed to humanize text.");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveProject = async () => {
    if (!outputText) {
      toast.error("Please humanize text before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      const creditsUsed = Math.max(1, Math.floor(inputText.length / 100));

      if (userCredits < creditsUsed) {
        toast.error("You don't have enough credits to save this project.");
        setIsSubmitting(false);
        return;
      }

      const { error: projectError } = await supabase
        .from("projects")
        .insert({
          title,
          input_text: inputText,
          output_text: outputText,
          credits_used: creditsUsed,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select();

      if (projectError) throw projectError;

      const { error: creditError } = await supabase.rpc("decrement_user_credits", {
        amount: creditsUsed,
      });

      if (creditError) {
        console.error("Failed to update credits:", creditError);
        toast.error("Project saved but failed to update credits.");
      } else {
        setUserCredits((prev) => {
          const newCredits = Math.max(0, prev - creditsUsed);
          if (newCredits <= 0) setMaxCharacters(300);
          return newCredits;
        });
        toast.success("Project saved successfully!");
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(error.message || "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 bg-slate-50 p-4">
          <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <p>Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-slate-50 p-4 pt-24">
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Use Live API</span>
              <Switch checked={useAPI} onCheckedChange={setUseAPI} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Humanize Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {maxCharacters === 300 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're out of credits! Input is limited to 300 characters.
                    <a href="/pricing" className="ml-1 underline">
                      Upgrade your plan
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              )}
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium">
                  Project Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="input-text" className="block mb-2 text-sm font-medium">
                  Input Text {maxCharacters !== null && `(Limited to ${maxCharacters} characters)`}
                </label>
                <Textarea
                  id="input-text"
                  placeholder="Paste AI-generated text here..."
                  className="min-h-[150px]"
                  value={inputText}
                  onChange={handleInputChange}
                  maxLength={maxCharacters}
                />
                <div className="mt-2 text-right text-sm text-muted-foreground">
                  {inputText.length} {maxCharacters !== null && `/ ${maxCharacters}`} characters
                </div>
              </div>
              <div className="text-center">
                <Button onClick={handleHumanize} disabled={isProcessing || !inputText.trim()}>
                  {isProcessing ? "Processing..." : "Humanize"}
                </Button>
              </div>
              {outputText && (
                <div className="mt-4">
                  <label htmlFor="output-text" className="block mb-2 text-sm font-medium">
                    Humanized Text
                  </label>
                  <Textarea
                    id="output-text"
                    className="min-h-[150px] bg-slate-50"
                    value={outputText}
                    readOnly
                  />
                  <div className="mt-2 text-right text-sm text-muted-foreground">
                    {outputText.length} characters
                  </div>
                </div>
              )}
            </CardContent>
            {outputText && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(outputText);
                    toast.success("Copied to clipboard");
                  }}
                >
                  Copy Text
                </Button>
                <Button onClick={saveProject} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Project"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HumanizeText;
