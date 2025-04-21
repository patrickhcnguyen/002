interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-12 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatCard number="10k+" label="Active Users" />
        <StatCard number="98%" label="Client Satisfaction" />
        <StatCard number="50k+" label="Shifts Managed" />
        <StatCard number="24/7" label="Support" />
      </div>
    </section>
  );
}