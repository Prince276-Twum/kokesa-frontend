import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import Features from "@/components/homepage/Features";
import Hero from "@/components/homepage/Hero";
import BusinessStats from "@/components/homepage/BusinessStats";
import Reviews from "@/components/homepage/Reviews";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with background */}
      <div className="relative bg-secondary">
        {/* The NavBar component has its own container */}
        <NavBar />

        {/* Hero section */}
        <Hero />
      </div>

      {/* Main content */}
      <main className="flex-grow">
        <Features />
        <BusinessStats />
        <Reviews />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
