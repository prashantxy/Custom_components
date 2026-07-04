'use client';

import PixelTrail from '@/components/PixelTrail';
import { useState } from 'react';
import Hero from './Components/Hero';
import CanvasComponent from './Components/loader_page';
import Animate3 from './Components/three';

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <main className="relative min-h-[300vh]">

      {!loaderDone && (
        <CanvasComponent
          onComplete={() => setLoaderDone(true)}
        />
      )}
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

      {loaderDone && (
        <>
          <Animate3/>
          <Hero />
         
        </>
      )}
      <section className="h-screen bg-black" />

    <section className="h-screen bg-red-500" />

    </main>
  );
}