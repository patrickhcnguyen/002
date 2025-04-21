import { Link } from "react-router-dom";
import { LogoDisplay } from "@/components/LogoDisplay";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <LogoDisplay />
              </div>
              <span className="text-xl font-bold">Evershift</span>
            </div>
            <p className="text-sm opacity-80">
              Simplifying temporary workforce management for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer" />
              <Twitter className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer" />
              <Linkedin className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer" />
              <Instagram className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="opacity-80 hover:opacity-100">About Us</Link></li>
              <li><Link to="/features" className="opacity-80 hover:opacity-100">Features</Link></li>
              <li><Link to="/pricing" className="opacity-80 hover:opacity-100">Pricing</Link></li>
              <li><Link to="/contact" className="opacity-80 hover:opacity-100">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="opacity-80 hover:opacity-100">Privacy Policy</Link></li>
              <li><Link to="/terms" className="opacity-80 hover:opacity-100">Terms of Service</Link></li>
              <li><Link to="/security" className="opacity-80 hover:opacity-100">Security</Link></li>
              <li><Link to="/compliance" className="opacity-80 hover:opacity-100">Compliance</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm opacity-80 mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <p className="text-center text-sm opacity-80">
            © {new Date().getFullYear()} Evershift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}