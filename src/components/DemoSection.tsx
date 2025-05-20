
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const DemoSection = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleHumanize = () => {
    // This would normally call an API endpoint to process the text
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const humanizedText = simulateHumanization(inputText);
      setOutputText(humanizedText);
      setIsProcessing(false);
      
      toast({
        title: "Text humanized successfully!",
        description: "Your AI-generated text now sounds more natural and human-like.",
      });
    }, 1500);
  };

  // Simulated humanization logic (would be handled by backend API in production)
  const simulateHumanization = (text: string) => {
    if (!text.trim()) return "";
    
    // Simple text transformations to make text seem more human
    let humanizedText = text;
    
    // Add some variations and less formal language
    humanizedText = humanizedText.replace(/I am/g, "I'm");
    humanizedText = humanizedText.replace(/It is/g, "It's");
    humanizedText = humanizedText.replace(/cannot/g, "can't");
    
    // Add some filler words and conversational elements
    const sentences = humanizedText.split('. ');
    const enhancedSentences = sentences.map((sentence, i) => {
      if (i % 3 === 0 && sentence.length > 10) {
        return "Actually, " + sentence.charAt(0).toLowerCase() + sentence.slice(1);
      } else if (i % 4 === 0 && sentence.length > 10) {
        return "Honestly, " + sentence.charAt(0).toLowerCase() + sentence.slice(1);
      }
      return sentence;
    });
    
    humanizedText = enhancedSentences.join('. ');
    
    // Add some varied punctuation
    humanizedText = humanizedText.replace(/\.\s+/g, (match, offset) => {
      if (offset > 50 && offset < humanizedText.length - 60 && Math.random() > 0.7) {
        return "! ";
      }
      return match;
    });
    
    return humanizedText;
  };

  return (
    <section id="demo" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Try the <span className="text-gradient">AI Humanizer</span>
            </h2>
            <p className="text-lg text-gray-600">
              Paste your AI-generated text below and see the difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input: AI Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Paste your AI-generated text here..."
                  className="h-64 resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Output: Humanized Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Humanized output will appear here..."
                  className="h-64 resize-none"
                  value={outputText}
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleHumanize} 
              disabled={!inputText.trim() || isProcessing}
              className="px-8"
              size="lg"
            >
              {isProcessing ? "Humanizing..." : "Humanize Text"} 
              {!isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
            
            <p className="mt-4 text-sm text-gray-500">
              Free demo limited to 300 characters. <a href="#pricing" className="text-primary underline hover:no-underline">Upgrade</a> for unlimited usage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
