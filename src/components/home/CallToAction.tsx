import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Workforce Management?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of businesses that trust Evershift for their temporary staffing needs.
        </p>
        <Link to="/dashboard">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            Start Your Journey
          </Button>
        </Link>
      </div>
    </section>
  );
}