import venueImage from "@/assets/taller.png";
import venueFront from "@/assets/taller-venue-front.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const VenueSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax mappings (subtle, to feel like a delay)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Responsive parallax range: shallower on mobile
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? [-300, 100] : [-610, 100]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0,0]);

  return (
    <section ref={sectionRef} className="relative h-[70vh] md:h-[1100px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={venueImage}
          alt="Hampton Court Venue"
          className="h-full w-full object-bottom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hero-overlay/40 via-transparent to-hero-overlay/40" />
      </div>

      {/* Miniature blur overlay (tilt-shift style on edges) */}
      <div
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 58%, rgba(0,0,0,0.15) 72%, rgba(0,0,0,0.85) 100%)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0.15) 72%, rgba(0,0,0,0.85) 100%)",
        }}
      >
        <img
          src={venueImage}
          alt="Hampton Court Venue blur overlay"
          className="h-full w-full object-cover object-bottom blur-[3px]"
        />
      </div>

      {/* Giant title behind the subject */}
      <motion.div style={{ y: textY }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h2 className="text-center px-4 text-white/95 drop-shadow-xl font-bold tracking-heavy" style={{ fontSize: "8vw", lineHeight: 1 }}>
          Sacred Heart of <br/> Jesus Parish
        </h2>
      </motion.div>

      {/* Foreground subject cutout (PNG) */}
      <div className="absolute inset-0 z-10 flex items-end justify-center">
        <img
          src={venueFront}
          alt="Hampton Court foreground"
          className="h-full w-full object-cover object-bottom select-none pointer-events-none"
        />
      </div>
    </section>
  );
};

export default VenueSection;
