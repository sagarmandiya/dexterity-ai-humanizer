
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const HumanizeText = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Project");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHumanize = async () => {
    // Simple validation
    if (!inputText.trim()) {
      toast.error("Please enter some text to humanize.");
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would call an AI humanization service
      // For now, we'll just simulate it with a simple transformation
      setTimeout(() => {
        // This is a placeholder implementation - in a real app this would use a proper AI service
        const humanized = inputText
          .split(".")
          .map(sentence => {
            // Add some variation to sentence structure
            if (Math.random() > 0.7 && sentence.length > 10) {
              return sentence + ", don't you think?";
            }
            return sentence;
          })
          .join(".")
          .replace(/AI/gi, "artificial intelligence")
          .replace(/algorithm/gi, "process")
          .replace(/automated/gi, "carefully crafted");
          
        setOutputText(humanized);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      toast.error("Failed to humanize text. Please try again.");
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
      // Calculate credits used (simplified - in a real app this would depend on text length/complexity)
      const creditsUsed = Math.max(1, Math.floor(inputText.length / 100));

      // Insert the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title,
          input_text: inputText,
          output_text: outputText,
          credits_used: creditsUsed
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Update user credits
      const { error: creditError } = await supabase.rpc(
        'decrement_user_credits',
        { amount: creditsUsed }
      );

      if (creditError) {
        // If credits update fails, we should handle this better in a real app
        console.error("Failed to update credits:", creditError);
        toast.error("Project saved but failed to update credits.");
      } else {
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

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="container mx-auto py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Humanize Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium">Project Title</label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="input-text" className="block mb-2 text-sm font-medium">Input Text</label>
              <Textarea
                id="input-text"
                placeholder="Paste AI-generated text here..."
                className="min-h-[150px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-2 text-right text-sm text-muted-foreground">
                {inputText.length} characters
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleHumanize} 
                disabled={isProcessing || !inputText.trim()}
              >
                {isProcessing ? "Processing..." : "Humanize"}
              </Button>
            </div>
            
            {outputText && (
              <div className="mt-4">
                <label htmlFor="output-text" className="block mb-2 text-sm font-medium">Humanized Text</label>
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
              <Button 
                onClick={saveProject} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Project"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HumanizeText;
