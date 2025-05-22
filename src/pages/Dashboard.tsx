
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, CreditCard, Trash2, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  title: string;
  created_at: string;
  credits_used: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
    } else if (projectsData) {
      setProjects(projectsData);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate("/auth");
        return;
      }
      
      setUserEmail(data.session.user.email);
      
      // Fetch user credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits')
        .single();
      
      if (creditsError) {
        console.error("Error fetching credits:", creditsError);
      } else if (creditsData) {
        setCredits(creditsData.credits);
      }
      
      await fetchProjects();
      
      setIsLoading(false);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("You have been signed out");
  };

  const startNewProject = () => {
    navigate("/humanize");
  };

  const deleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);
      
      if (error) {
        throw error;
      }
      
      // Update projects list
      setProjects(projects.filter(project => project.id !== projectToDelete));
      toast.success("Project deleted successfully");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setProjectToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 bg-slate-50 p-4 pt-24">
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Header with logout button */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button onClick={handleLogout} variant="outline">
                Log out
              </Button>
            </div>
            
            {/* User info and credits card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-2">{userEmail}</p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
                      <span className="font-medium">Available Credits</span>
                      <span className="text-xl font-bold text-primary">{credits}</span>
                    </div>
                    <Link to="/pricing">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Upgrade Plan</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Humanize Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Make AI-generated content undetectable by AI detectors. Transform your text to appear more human-like.
                  </p>
                  <Button className="w-full flex items-center gap-2" onClick={startNewProject}>
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Projects history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't created any projects yet.</p>
                    <p className="mt-2">Start by creating a new project above.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Credits Used</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => navigate(`/project/${project.id}`)}>
                            {project.title}
                          </TableCell>
                          <TableCell>{formatDate(project.created_at)}</TableCell>
                          <TableCell>{project.credits_used}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    Delete Project
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => {
                                      setProjectToDelete(project.id);
                                      deleteProject();
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
