import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const API_KEY = import.meta.env.VITE_UNDETECTABLE_API_KEY;
const USER_ID = import.meta.env.VITE_UNDETECTABLE_USER_ID;
const USE_API = import.meta.env.VITE_USE_API;
const CHARACTER_LIMIT = 300;

const DemoSection = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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

    if (!API_KEY || !USER_ID) {
      toast({ title: "API credentials missing." });
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
            toast({
              title: "Text humanized successfully!",
              description: "Your AI-generated text now sounds more natural.",
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
        toast({
          title: "Simulated humanization complete",
          description: "This was a mock result since API is disabled.",
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
