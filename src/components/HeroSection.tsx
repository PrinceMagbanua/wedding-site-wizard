import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import banner1 from "@/assets/photos/banner-1.jpg";
import banner2 from "@/assets/photos/banner-2.jpg";
// import banner3 from "@/assets/photos/banner-3.jpg";
// import banner4 from "@/assets/photos/banner-4.jpg";
import { Button } from "./ui/button";

// const heroImages = [banner1, banner2, banner3, banner4];
const heroImages = [banner2];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 40,
    damping: 20,
    mass: 1.2,
  });
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(smoothY, [0, 300], [1, 0]);
  const maskY = useTransform(smoothY, [0, 300], ["0%", "100%"]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const scrollToRSVP = () => {
    // Start background music on RSVP click
    try {
      window.dispatchEvent(new CustomEvent("app:play-music"));
    } catch {
      // no-op
    }
    const rsvpSection = document.getElementById("rsvp-section");
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate confetti circles for mask
  const confettiCircles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    size: 20 + Math.random() * 40,
  }));

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 parallax"
      >
        <div className="absolute inset-0">
          {heroImages.map((image, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.div
                key={image}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 1.02,
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0"
          style={{
            background: "var(--gradient-hero)",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center text-center text-white"
      >
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="mb-4 text-6xl font-bold tracking-wide md:text-8xl">
              Prince & Ann
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-xl font-light tracking-widest md:text-2xl">
              ARE GETTING MARRIED
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* <p className="mb-8 text-lg font-light tracking-wide md:text-xl">
              Join us in celebrating our love
            </p> */}
            <div className="relative inline-block w-full">
              <Button
                onClick={scrollToRSVP}
                size="lg"
                className={`
                  relative overflow-hidden
                  px-5 py-5
                  text-lg md:text-xl
                  font-regular
                  shadow-2xl
                  border border-white
                  bg-white
                  text-green-700 
                  hover:text-green-800 hover:bg-white
                  transition-all duration-200
                  outline-white/40
                  min-w-[170px]
                `}
                style={{
                  letterSpacing: "0.05em",
                  boxShadow: "0 0 38px 0 rgba(200,223,194,0.40), 0 2px 10px rgb(0 0 0 / 0.15)"
                }}
              >
                <span className="relative z-10">RSVP Now</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
