import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
// import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CodeEditorDemo from "@/components/CodeEditorDemo";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`relative min-h-screen ${inter.className} bg-black text-white`}
    >
      {/* Gradient background effect */}
      <div className="fixed top-0 right-0 w-full h-full z-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-700 opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500 opacity-10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        {/* <HeroSection /> */}
        <CodeEditorDemo />
        <ServicesSection />
      </div>
    </main>
  );
}
