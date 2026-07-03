'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const section = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const letters = "GSAPY".split("");
  const lettersRef = useRef<HTMLSpanElement[]>([]);
lettersRef.current = [];
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
       const rect = heading.current!.getBoundingClientRect();
      const targetScale = window.innerWidth / rect.width;

const scrollDistance = window.innerHeight;
     gsap.to(heading.current, {
  scale: targetScale,
  x: "40vw",
  y: "35vh",
  ease: "none",
  scrollTrigger: {
    trigger: section.current,
    start: "top top",
    end: "+=" + scrollDistance,
    scrub: true,
    pin: true,
  },
});
      gsap.to(lettersRef.current, {
  y: "random(-5,5)",
  rotation: "random(-3,3)",
  stagger: 0.05,
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: "sine.inOut",
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
  {letters.map((letter, index) => (
  <span
    key={index}
    ref={(el) => {
      if (el) lettersRef.current[index] = el;
    }}
    className="inline-block"
  >
    {letter}
  </span>
))}
</h1>
    </section>
  );
}