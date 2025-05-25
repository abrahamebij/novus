import Navigation from "@/components/home/Navigation";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import CTASection from "@/components/home/CTASection";

export default function NovusLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Final CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
