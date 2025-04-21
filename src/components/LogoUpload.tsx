import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const LogoUpload = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    // Initialize from localStorage if exists
    return localStorage.getItem('companyLogo');
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5000000) {
      toast.error("File size too large. Please upload an image under 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setLogoUrl(url);
      localStorage.setItem('companyLogo', url);
      toast.success("Logo uploaded successfully!");
    };

    reader.onerror = () => {
      toast.error("Failed to read the image file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    localStorage.removeItem('companyLogo');
    toast.success("Logo removed successfully!");
  };

  return (
    <div className="flex items-center gap-2">
      {logoUrl ? (
        <div className="relative">
          <img 
            src={logoUrl} 
            alt="Company Logo" 
            className="h-12 w-12 rounded-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleRemoveLogo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <label htmlFor="logo-upload">
            <Button 
              variant="outline" 
              className="cursor-pointer rounded-full h-12 w-12 p-0" 
              asChild
            >
              <span className="flex items-center justify-center">
                <ImagePlus className="h-5 w-5" />
                <span className="sr-only">Add Logo</span>
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};