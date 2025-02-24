import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import Features from "@/components/homepage/Features";
import Hero from "@/components/homepage/Hero";
import Button from "@/components/UI/Button";
import HeroImg from "@/public/kokesa-hero.jpeg";
import StatsAndReviews from "@/components/homepage/Reviews";
import BusinessStats from "@/components/homepage/BusinessStats";

export default function Home() {
  return (
    <header className="relative w-full ">
      <div
        className="absolute inset-0 w-full h-[600px] lg:h-[680px] "
        style={{
          backgroundImage: `url(${HeroImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>

      <div className="relative">
        <div className="py-6 px-6 lg:px-8  max-container">
          <NavBar></NavBar>
        </div>
        <Hero />
      </div>

      <main>
        <Features />
        <BusinessStats />
        <StatsAndReviews />
      </main>
      <Footer />
    </header>
  );
}
