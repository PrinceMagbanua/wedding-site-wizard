import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Images } from "lucide-react";
import lrwn4041 from "@/assets/photos/LRWN4622.jpg";
import lrwn4124 from "@/assets/photos/LRWN4129.jpg";
import lrwn4144 from "@/assets/photos/LRWN4144.jpg";
import EditableText from "./builder/editor/EditableText";
import ImageManagerModal from "./builder/editor/ImageManagerModal";
import { useBuilderContext } from "./builder/BuilderContext";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface PhotoGalleryProps {
  heading?: string;
  body?: string[];
  closingLine?: string;
  photos?: GalleryPhoto[];
  onHeadingChange?: (value: string) => void;
  onBodyChange?: (value: string) => void;
  onPhotosChange?: (srcs: string[]) => void;
}

const defaultPhotos: GalleryPhoto[] = [
  { src: lrwn4124, alt: "Candid look", caption: "Quiet glances" },
  { src: lrwn4144, alt: "Sunlit portrait", caption: "Sunlit moments" },
  { src: lrwn4041, alt: "City stroll", caption: "City strolls" },
];

const PhotoGallery = ({
  heading = "Hello, Family & Friends!",
  body = [
    "After 7 wonderful years of love and laughter, we're thrilled to celebrate this special moment with you. Here you'll find all the details about our big day—from the venue to what to wear—to make things easy and memorable for everyone.",
  ],
  closingLine = "Your presence means everything to us. Let's create unforgettable memories together! ♡",
  photos = defaultPhotos,
  onHeadingChange,
  onBodyChange,
  onPhotosChange,
}: PhotoGalleryProps = {}) => {
  const { isEditing } = useBuilderContext();
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textScrollProgress = useScroll({
    target: textRef,
    offset: ["start end", "end start"],
  }).scrollYProgress;

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const titleY = useTransform(textScrollProgress, [0, 0.3, 0.6, 1], [50, 0, 0, -20]);
  const titleOpacity = useTransform(textScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  const subtitleY = useTransform(textScrollProgress, [0.1, 0.4, 0.7, 1], [30, 0, 0, -15]);
  const subtitleOpacity = useTransform(textScrollProgress, [0.1, 0.3, 0.9, 1], [0, 1, 1, 0.8]);

  const displayPhotos = photos.slice(0, 3);
  const yTransforms = [y1, y2, y3];

  return (
  <>
    <section ref={containerRef} className="py-20 px-4 bg-background relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2 }}
        className="container mx-auto max-w-6xl"
      >
        {/* Greeting Content Section */}
        <motion.div
          ref={textRef}
          style={{
            y: titleY,
            opacity: titleOpacity,
          }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="mb-8"
          >
            <motion.h1
              style={{
                y: titleY,
                opacity: titleOpacity,
              }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-6"
            >
              <EditableText
                as="span"
                value={heading}
                onChange={onHeadingChange ?? (() => {})}
              />
            </motion.h1>

            <motion.div
              style={{
                y: subtitleY,
                opacity: subtitleOpacity,
              }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              {body.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                >
                  {i === 0 ? (
                    <EditableText
                      as="span"
                      value={para}
                      onChange={onBodyChange ?? (() => {})}
                      multiline
                    />
                  ) : para}
                </motion.p>
              ))}

              {closingLine && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base md:text-lg font-medium text-primary/90"
                >
                  {closingLine}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Photo Gallery Section */}
        <motion.div
          ref={photosRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-16"
        >
          {/* Manage photos button — builder only */}
          {isEditing && onPhotosChange && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setImageManagerOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted transition-colors"
              >
                <Images className="h-3.5 w-3.5" />
                Manage Gallery Photos
                <span className="ml-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {displayPhotos.length}
                </span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {displayPhotos.map((photo, idx) => {
              const yTransform = yTransforms[idx % yTransforms.length];
              const delay = 0.15 * idx;
              const hoverTilt = idx % 2 === 0 ? 5 : -5;

              return (
                <motion.div
                  key={photo.src}
                  style={{ y: isMobile ? 0 : yTransform }}
                  initial={{ opacity: 0, scale: 0.7, rotateX: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.8,
                    delay,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: hoverTilt,
                    transition: { duration: 0.3 }
                  }}
                  className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
                >
                  <div className="relative h-[420px] md:h-[500px] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>

    {isEditing && onPhotosChange && (
      <ImageManagerModal
        open={imageManagerOpen}
        onClose={() => setImageManagerOpen(false)}
        images={photos.map((p) => p.src)}
        onChange={onPhotosChange}
        title="Gallery Photos"
        maxImages={9}
        minImages={0}
      />
    )}
  </>
  );
};

export default PhotoGallery;
