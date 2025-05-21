
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, CreditCard } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
      
      // Fetch user projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      } else if (projectsData) {
        setProjects(projectsData);
      }
      
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
      
      <div className="flex-1 bg-slate-50 p-4">
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
                        <TableHead className="text-right">Credits Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id} className="cursor-pointer hover:bg-slate-100" onClick={() => navigate(`/project/${project.id}`)}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{formatDate(project.created_at)}</TableCell>
                          <TableCell className="text-right">{project.credits_used}</TableCell>
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
