import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Features } from "@/components/home/Features";
import { Industries } from "@/components/home/Industries";
import { CallToAction } from "@/components/home/CallToAction";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/home/Footer";
import { BackToTop } from "@/components/home/BackToTop";
import { ClientLogos } from "@/components/home/ClientLogos";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ClientLogos />
      <Stats />
      <Features />
      <Industries />
      <Testimonials />
      <CallToAction />
      <Footer />
      <BackToTop />
    </div>
  );
}