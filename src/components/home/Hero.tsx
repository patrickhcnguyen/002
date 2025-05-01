import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { LogoDisplay } from "@/components/LogoDisplay";
// import SignUpForm from "@/pages/Auth/signUp";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";



export function Hero() {
  const session = useSession();

  function isAuthenticated() {
    if (session) {
      return true;
    }
    return false;
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="py-4 px-6 border-b fixed w-full top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogoDisplay />
            <span className="text-2xl font-bold text-primary">Evershift</span>
          </div>
          <div className="flex gap-4">
            <Link to="/staffing-request">
              <Button variant="outline" className="bg-accent text-white hover:bg-accent/90">
                Request Staff
              </Button>
            </Link>
            {isAuthenticated() ? (
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            ) : (
              <Link to="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            )}
              {isAuthenticated() ? (
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Simplify Your Temporary Workforce Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Evershift helps you efficiently manage, schedule, and optimize your temporary workforce with powerful tools and insights.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 animate-scale-in">
                  Get Started
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="animate-scale-in">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}