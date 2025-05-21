
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface Project {
  id: string;
  title: string;
  input_text: string;
  output_text: string;
  created_at: string;
  credits_used: number;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details.");
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDate(project.created_at)} · {project.credits_used} credits used
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Original Text</h3>
              <div className="bg-slate-100 p-4 rounded-md whitespace-pre-wrap">
                {project.input_text}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Humanized Text</h3>
              <div className="bg-slate-100 p-4 rounded-md whitespace-pre-wrap">
                {project.output_text}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(project.output_text);
                toast.success("Copied to clipboard");
              }}
            >
              Copy Humanized Text
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProjectView;
