import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Smooth scrolling powered by Lenis (widely used, battle-tested).
// - Respects prefers-reduced-motion.
// - Does not fight native scrollbar drag or touch scrolling.
// - Keeps behavior consistent across browsers.
const SmoothScroll = () => {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // A lower lerp is smoother; duration is auto-managed internally.
      // Defaults are sensible; tweak if you want stronger/softer smoothing.
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // Sync on native scrolls triggered outside Lenis (e.g., programmatic)
    const onScroll = () => {
      // Lenis listens to scroll, but we can notify if needed in future.
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;


