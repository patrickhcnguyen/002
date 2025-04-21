export function ClientLogos() {
  const logos = [
    { name: "TechCorp", url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=50&h=50&fit=crop" },
    { name: "HealthPlus", url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=50&h=50&fit=crop" },
    { name: "LogiTech", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=50&h=50&fit=crop" },
    { name: "BuildPro", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=50&h=50&fit=crop" },
  ];

  return (
    <section className="py-12 bg-background border-y">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-muted-foreground mb-8">Trusted by industry leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}