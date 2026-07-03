// app/page.tsx

import CanvasComponent from "./Components/loader_page";
import PixelTrail from "@/components/PixelTrail";
import ImageTrail from "@/components/ImageTrail"

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">

      {/* Your blob animation */}
      <CanvasComponent />

      {/* Pixel trail */}
      <div className="absolute inset-0 z-[60]">
        <PixelTrail
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#5227ff"
          gooeyFilter={{
            id: "custom-goo-filter",
            strength: 2,
          }}
        />
      </div>
     
    </main>
  );
}