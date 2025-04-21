import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

function TestimonialCard({ quote, author, role, company }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border">
      <Quote className="h-8 w-8 text-primary mb-4" />
      <p className="text-muted-foreground mb-4 italic">{quote}</p>
      <div>
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}, {company}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      quote: "Evershift has transformed how we manage our temporary workforce. The scheduling and timesheet features have saved us countless hours.",
      author: "Sarah Johnson",
      role: "HR Director",
      company: "EventPro Solutions"
    },
    {
      quote: "The payroll integration is seamless, and the customer support team is always there when we need them. Couldn't be happier!",
      author: "Michael Chen",
      role: "Operations Manager",
      company: "Logistics Plus"
    },
    {
      quote: "We've reduced our administrative overhead by 40% since implementing Evershift. It's been a game-changer for our business.",
      author: "Emily Rodriguez",
      role: "Staffing Coordinator",
      company: "Healthcare Staffing Inc"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Clients Say</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Trusted by businesses across various industries to streamline their workforce management
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}