import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { RoomEntryCard } from "@/components/landing/RoomEntryCard";
import { EditorPreview } from "@/components/landing/EditorPreview";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        <Hero />
        <RoomEntryCard />
        <EditorPreview />
      </main>

      <Footer />
    </div>
  );
}
