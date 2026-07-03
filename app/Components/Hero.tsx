'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const section = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const textWidth = heading.current!.offsetWidth;
        const screenWidth = window.innerWidth;
        const targetScale = screenWidth / textWidth;
      gsap.to(heading.current, {
        scale: targetScale,
        x: "40vw",
        y: "35vh",
        ease: "none",

        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=" + targetScale * 300,
          scrub: true,
          pin: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative h-screen bg-[#111] overflow-hidden"
    >
      <h1
        ref={heading}
        className="
          absolute
          top-120
          left-10
          text-7xl
          font-bold
          text-white
          origin-top-left
        "
      >
        GSAPY
      </h1>
    </section>
  );
}