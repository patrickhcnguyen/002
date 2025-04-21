import { 
  GlassWater,
  Stethoscope,
  Factory,
  Store,
  Truck,
  Building,
  Construction,
  Wrench
} from "lucide-react";

interface IndustryCardProps {
  icon: React.ReactNode;
  title: string;
}

function IndustryCard({ icon, title }: IndustryCardProps) {
  return (
    <div className="p-6 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors text-center">
      <div className="text-primary mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

export function Industries() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">Industries We Serve</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
          Tailored solutions for various industries requiring temporary workforce management
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <IndustryCard icon={<GlassWater className="h-8 w-8" />} title="Events & Hospitality" />
          <IndustryCard icon={<Stethoscope className="h-8 w-8" />} title="Healthcare" />
          <IndustryCard icon={<Factory className="h-8 w-8" />} title="Manufacturing & Warehouse" />
          <IndustryCard icon={<Store className="h-8 w-8" />} title="Retail & Customer Service" />
          <IndustryCard icon={<Truck className="h-8 w-8" />} title="Logistics & Transportation" />
          <IndustryCard icon={<Building className="h-8 w-8" />} title="Office & Administrative" />
          <IndustryCard icon={<Construction className="h-8 w-8" />} title="Construction" />
          <IndustryCard icon={<Wrench className="h-8 w-8" />} title="Industrial & Skilled Trade" />
        </div>
      </div>
    </section>
  );
}