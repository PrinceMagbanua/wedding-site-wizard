import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Images } from "lucide-react";
// import banner1 from "@/assets/photos/banner-1.jpg";
import banner2 from "@/assets/photos/banner-2.jpg";
// import banner3 from "@/assets/photos/banner-3.jpg";
// import banner4 from "@/assets/photos/banner-4.jpg";
import { Button } from "./ui/button";
import EditableText from "./builder/editor/EditableText";
import ImageManagerModal from "./builder/editor/ImageManagerModal";
import { useBuilderContext } from "./builder/BuilderContext";

// const defaultImages = [banner1, banner2, banner3, banner4];
const defaultImages = [banner2];

export interface HeroSectionProps {
  backgroundImages?: string[];
  coupleNames?: string;
  tagline?: string;
  showRsvpButton?: boolean;
  rsvpButtonLabel?: string;
  overlayOpacity?: number;
  onCoupleNamesChange?: (value: string) => void;
  onTaglineChange?: (value: string) => void;
  onBackgroundImagesChange?: (images: string[]) => void;
}

const HeroSection = ({
  backgroundImages,
  coupleNames = "Prince & Ann",
  tagline = "ARE GETTING MARRIED",
  showRsvpButton = true,
  rsvpButtonLabel = "RSVP Now",
  overlayOpacity,
  onCoupleNamesChange,
  onTaglineChange,
  onBackgroundImagesChange,
}: HeroSectionProps = {}) => {
  const { isEditing } = useBuilderContext();
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const heroImages = backgroundImages ?? defaultImages;

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 40,
    damping: 20,
    mass: 1.2,
  });
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(smoothY, [0, 300], [1, 0]);
  const maskY = useTransform(smoothY, [0, 300], ["0%", "100%"]);

  void maskY; // used in original masking effect

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  const heroOverlayStyle = overlayOpacity !== undefined
    ? { background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,${overlayOpacity}) 100%)` }
    : { background: "var(--gradient-hero)" };

  return (
  <>
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
          style={heroOverlayStyle}
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
              <EditableText
                as="span"
                value={coupleNames}
                onChange={onCoupleNamesChange ?? (() => {})}
              />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-xl font-light tracking-widest md:text-2xl">
              <EditableText
                as="span"
                value={tagline}
                onChange={onTaglineChange ?? (() => {})}
              />
            </p>
          </motion.div>

          {showRsvpButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
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
                  <span className="relative z-10">{rsvpButtonLabel}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Edit background images button — outside parallax div so z-index isn't trapped in its stacking context */}
      {isEditing && (
        <button
          type="button"
          onClick={() => setImageManagerOpen(true)}
          className="absolute bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 shadow-lg transition-colors backdrop-blur-sm"
        >
          <Images className="h-3.5 w-3.5" />
          Edit Background
          {heroImages.length > 1 && (
            <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {heroImages.length}
            </span>
          )}
        </button>
      )}

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

    {/* Image manager for hero background slideshow */}
    {isEditing && onBackgroundImagesChange && (
      <ImageManagerModal
        open={imageManagerOpen}
        onClose={() => setImageManagerOpen(false)}
        images={backgroundImages ?? []}
        onChange={onBackgroundImagesChange}
        title="Hero Background Images"
        maxImages={5}
        minImages={0}
      />
    )}
  </>
  );
};

export default HeroSection;
