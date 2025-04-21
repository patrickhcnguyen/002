import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogoUpload } from "@/components/LogoUpload";
import { LogoDisplay } from "@/components/LogoDisplay";
import { PositionRatesSection } from "./PositionRatesSection";
import { toast } from "sonner";

export function InvoiceSettingsContent() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [defaultTerms, setDefaultTerms] = useState({
    paymentTerms: "Net 30",
    terms: `Payment Terms:

All events must be paid in full prior to confirming the team.

Standard cancelation:
50% refund if canceled 6 days prior to the event and 75% refund if canceled 30 days prior to the event.

Extra time:
To prevent any miscommunication for billable hours please confirm with your Account Manager before asking our team to stay longer than what's scheduled.

Parking:
If parking is not provided to the team and no street parking is available, clients will be billed after the event to reimburse the team for their parking costs.

Breaks:
All team members are legally required to receive a 30 minute break on shifts of 6 hours or longer.`
  });

  useEffect(() => {
    // Load saved business info from localStorage
    const savedInfo = localStorage.getItem("businessInfo");
    if (savedInfo) {
      setBusinessInfo(JSON.parse(savedInfo));
    }

    // Load saved default terms from localStorage
    const savedTerms = localStorage.getItem("defaultTerms");
    if (savedTerms) {
      setDefaultTerms(JSON.parse(savedTerms));
    }
  }, []);

  const handleSave = () => {
    // Save business info
    localStorage.setItem("businessInfo", JSON.stringify(businessInfo));
    
    // Save default terms
    localStorage.setItem("defaultTerms", JSON.stringify(defaultTerms));
    
    // Show success message
    toast.success("Settings saved successfully!");
    
    // Log the saved data for debugging
    console.log('Saved business info:', businessInfo);
    console.log('Saved default terms:', defaultTerms);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Invoice Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your business information and default terms that appear on invoices.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <LogoDisplay />
          </div>
          <div>
            <h4 className="font-medium mb-2">Business Logo</h4>
            <LogoUpload />
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor="business-name" className="text-sm font-medium">
              Business Name
            </label>
            <Input
              id="business-name"
              value={businessInfo.name}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, name: e.target.value })
              }
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label htmlFor="business-address" className="text-sm font-medium">
              Business Address
            </label>
            <Textarea
              id="business-address"
              value={businessInfo.address}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, address: e.target.value })
              }
              placeholder="Enter your business address"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="business-phone" className="text-sm font-medium">
              Business Phone
            </label>
            <Input
              id="business-phone"
              type="tel"
              value={businessInfo.phone}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, phone: e.target.value })
              }
              placeholder="Enter your business phone"
            />
          </div>

          <div>
            <label htmlFor="business-email" className="text-sm font-medium">
              Business Email
            </label>
            <Input
              id="business-email"
              type="email"
              value={businessInfo.email}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, email: e.target.value })
              }
              placeholder="Enter your business email"
            />
          </div>

          <div>
            <label htmlFor="payment-terms" className="text-sm font-medium">
              Default Payment Terms
            </label>
            <Input
              id="payment-terms"
              value={defaultTerms.paymentTerms}
              onChange={(e) =>
                setDefaultTerms({ ...defaultTerms, paymentTerms: e.target.value })
              }
              placeholder="e.g., Net 30"
            />
          </div>

          <div>
            <label htmlFor="default-terms" className="text-sm font-medium">
              Default Terms
            </label>
            <Textarea
              id="default-terms"
              value={defaultTerms.terms}
              onChange={(e) =>
                setDefaultTerms({ ...defaultTerms, terms: e.target.value })
              }
              placeholder="Enter your default terms and conditions"
              rows={10}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>

      <PositionRatesSection />
    </div>
  );
}