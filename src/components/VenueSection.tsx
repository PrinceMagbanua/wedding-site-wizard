import venueImageDefault from "@/assets/taller.png";
import venueFrontDefault from "@/assets/taller-venue-front.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Images } from "lucide-react";
import EditableText from "./builder/editor/EditableText";
import ImageManagerModal from "./builder/editor/ImageManagerModal";
import { useBuilderContext } from "./builder/BuilderContext";

export interface VenueSectionProps {
  backgroundImage?: string;
  /**
   * Foreground PNG cutout (ideally with transparent background for the
   * tilt-shift effect). Falls back to the default venue-front PNG.
   */
  foregroundImage?: string;
  venueName?: string;
  overlayOpacity?: number;
  onVenueNameChange?: (value: string) => void;
  onBackgroundImageChange?: (src: string) => void;
  onForegroundImageChange?: (src: string) => void;
}

const VenueSection = ({
  backgroundImage,
  foregroundImage,
  venueName = "Sacred Heart of Jesus Parish",
  overlayOpacity = 0.4,
  onVenueNameChange,
  onBackgroundImageChange,
  onForegroundImageChange,
}: VenueSectionProps = {}) => {
  const { isEditing } = useBuilderContext();
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [fgPickerOpen, setFgPickerOpen] = useState(false);
  const bgSrc = backgroundImage ?? venueImageDefault;
  const fgSrc = foregroundImage ?? venueFrontDefault;

  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? [-300, 100] : [-610, 100]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  void foregroundY;

  return (
  <>
    <section ref={sectionRef} className="relative h-[70vh] md:h-[1100px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgSrc}
          alt={venueName}
          className="h-full w-full object-bottom object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-hero-overlay/40 via-transparent to-hero-overlay/40"
          style={{ opacity: overlayOpacity }}
        />
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
          src={bgSrc}
          alt={`${venueName} blur overlay`}
          className="h-full w-full object-cover object-bottom blur-[3px]"
        />
      </div>

      {/* Giant title — raised to z-20 in edit mode so it sits above the foreground PNG */}
      <motion.div style={{ y: textY, pointerEvents: isEditing ? "auto" : "none" }} className={`absolute inset-0 flex items-center justify-center ${isEditing ? "z-20" : "z-10"}`}>
        <h2 className="text-center px-4 text-white/95 drop-shadow-xl font-bold tracking-heavy" style={{ fontSize: "8vw", lineHeight: 1 }}>
          {isEditing ? (
            <EditableText
              as="span"
              value={venueName}
              onChange={onVenueNameChange ?? (() => {})}
            />
          ) : venueName.includes(" ") ? (
            <>
              {venueName.split(" ").slice(0, Math.ceil(venueName.split(" ").length / 2)).join(" ")} <br />
              {venueName.split(" ").slice(Math.ceil(venueName.split(" ").length / 2)).join(" ")}
            </>
          ) : venueName}
        </h2>
      </motion.div>

      {/* Foreground subject cutout (PNG) — always pointer-events-none so it never blocks editing */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
        <img
          src={fgSrc}
          alt={`${venueName} foreground`}
          className="h-full w-full object-cover object-bottom select-none pointer-events-none"
        />
      </div>

      {/* Image edit buttons — builder only, z-30 so they sit above all layers */}
      {isEditing && (
        <div className="absolute bottom-4 right-4 z-30 flex gap-2">
          {onForegroundImageChange && (
            <button
              type="button"
              onClick={() => setFgPickerOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 shadow-lg transition-colors backdrop-blur-sm"
            >
              <Images className="h-3.5 w-3.5" />
              Edit Foreground
            </button>
          )}
          {onBackgroundImageChange && (
            <button
              type="button"
              onClick={() => setBgPickerOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 shadow-lg transition-colors backdrop-blur-sm"
            >
              <Images className="h-3.5 w-3.5" />
              Edit Background
            </button>
          )}
        </div>
      )}
    </section>

    {onBackgroundImageChange && (
      <ImageManagerModal
        open={bgPickerOpen}
        onClose={() => setBgPickerOpen(false)}
        images={backgroundImage ? [backgroundImage] : []}
        onChange={(srcs) => onBackgroundImageChange(srcs[0] ?? "")}
        title="Venue Background Image"
        maxImages={1}
        minImages={0}
      />
    )}
    {onForegroundImageChange && (
      <ImageManagerModal
        open={fgPickerOpen}
        onClose={() => setFgPickerOpen(false)}
        images={foregroundImage ? [foregroundImage] : []}
        onChange={(srcs) => onForegroundImageChange(srcs[0] ?? "")}
        title="Venue Foreground Image"
        maxImages={1}
        minImages={0}
      />
    )}
  </>
  );
};

export default VenueSection;
