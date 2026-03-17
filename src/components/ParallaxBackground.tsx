import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import leaf1 from "@/assets/leaf-1.png";
import leaf2 from "@/assets/leaf-2.png";

const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 40,
    mass: 1.2,
  });

  const y1 = useTransform(smoothProgress, [0, 1], [0, -70]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, 70]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -50]);
  const y4 = useTransform(smoothProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 100]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top left leaf */}
      <motion.img
        src={leaf1}
        alt=""
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        style={{ y: y1, rotate: rotate1 }}
        className="absolute -top-20 -left-20 w-64 h-64"
      />

      {/* Top right floral */}
      <motion.img
        src={leaf2}
        alt=""
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-40 -right-32 w-80 h-80"
      />

      {/* Middle left floral */}
      <motion.img
        src={leaf2}
        alt=""
        initial={{ opacity: 0, scale: 0, x: -50 }}
        animate={{ opacity: 0.5, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        style={{ y: y3, rotate: rotate2 }}
        className="absolute top-1/3 -left-24 w-72 h-72"
      />

      {/* Middle right leaf */}
      <motion.img
        src={leaf1}
        alt=""
        initial={{ opacity: 0, scale: 0, x: 50 }}
        animate={{ opacity: 0.5, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        style={{ y: y4, rotate: rotate1 }}
        className="absolute top-1/2 -right-20 w-56 h-56"
      />

      {/* Bottom left leaf */}
      <motion.img
        src={leaf1}
        alt=""
        initial={{ opacity: 0, scale: 0, rotate: -30 }}
        animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        style={{ y: y2, rotate: rotate1 }}
        className="absolute bottom-20 -left-28 w-96 h-96"
      />

      {/* Bottom right floral */}
      <motion.img
        src={leaf2}
        alt=""
        initial={{ opacity: 0, scale: 0, rotate: 30 }}
        animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
        style={{ y: y1, rotate: rotate2 }}
        className="absolute bottom-40 -right-24 w-64 h-64"
      />
    </div>
  );
};

export default ParallaxBackground;
