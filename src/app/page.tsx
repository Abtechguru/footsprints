import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProductGrid from "@/components/ProductGrid";
import Team from "@/components/Team";
import Process from "@/components/Process";
import ValueProps from "@/components/ValueProps";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <ProductGrid />
      <ValueProps />
      <Process />
      <Team />
      <Newsletter />
      <Footer />
    </main>
  );
}
