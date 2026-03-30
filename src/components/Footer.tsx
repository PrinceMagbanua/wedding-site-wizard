import { motion } from "framer-motion";
import { Heart, Calendar, MapPin } from "lucide-react";
import EditableText from "./builder/editor/EditableText";

export interface FooterProps {
  coupleNames?: string;
  hashtag?: string;
  tagline?: string;
  showHashtag?: boolean;
  date?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  venue?: string;
  venueAddress?: string;
  dresscode?: string;
  dresscodeColors?: string;
  showDate?: boolean;
  showVenue?: boolean;
  copyrightText?: string;
  onCoupleNamesChange?: (value: string) => void;
  onHashtagChange?: (value: string) => void;
  onTaglineChange?: (value: string) => void;
  onCopyrightTextChange?: (value: string) => void;
}

const Footer = ({
  coupleNames = "Prince & Ann",
  hashtag = "#AnnFinallyFoundHerPrince",
  tagline = "We can't wait to celebrate this special day with you",
  showHashtag = true,
  date = "Saturday, February 7, 2026",
  ceremonyTime = "Ceremony 1:30 PM",
  receptionTime = "Reception 4:00 PM",
  venue = "Hampton Court",
  venueAddress = "Hillsborough Village, Muntinlupa",
  dresscode = "Semi-Formal Attire",
  dresscodeColors = "Sage Green Palette",
  showDate = true,
  showVenue = true,
  copyrightText,
  onCoupleNamesChange,
  onHashtagChange,
  onTaglineChange,
  onCopyrightTextChange,
}: FooterProps = {}) => {
  const handleScroll = (selector: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyright = copyrightText ?? `© ${new Date().getFullYear()} ${coupleNames}`;

  return (
    <footer
      className="relative bg-primary text-primary-foreground pb-16 pt-[100px] px-4 -mt-[120px] md:-mt-[120px] z-30"
      style={{
        // Broad browser support using polygon to approximate a smooth curve
        clipPath:
          "polygon(0% 11.5%, 10% 9%, 25% 8%, 40% 9%, 50% 11.5%, 60% 14%, 75% 15%, 90% 14%, 100% 11.5%, 100% 100%, 0% 100%)",
        WebkitClipPath:
          "polygon(0% 9%, 10% 9.5%, 20% 10.2%, 30% 10.8%, 40% 11.2%, 50% 11.5%, 60% 11.2%, 70% 10.8%, 80% 10.2%, 90% 9.6%, 100% 9%, 100% 100%, 0% 100%)",
        willChange: "clip-path",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="text-center mb-12 mt-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex mb-6"
          >
            <Heart className="h-12 w-12 fill-current" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">
            <EditableText as="span" value={coupleNames} onChange={onCoupleNamesChange ?? (() => {})} />
          </h2>
          {showHashtag && (
            <p className="text-xl font-light opacity-90">
              <EditableText as="span" value={hashtag} onChange={onHashtagChange ?? (() => {})} />
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {showDate && (
            <motion.a
              href="#details-section"
              onClick={handleScroll("#details-section")}
              whileHover={{ scale: 1.04 }}
              className="text-center cursor-pointer block"
            >
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Calendar className="h-8 w-8 mx-auto mb-3 opacity-80" />
              </motion.div>
              <h3 className="font-semibold mb-2">Date</h3>
              <p className="opacity-90">{date}</p>
              <p className="opacity-90">{ceremonyTime}</p>
              <p className="opacity-90">{receptionTime}</p>
            </motion.a>
          )}

          {showVenue && (
            <motion.a
              href="#details-section"
              onClick={handleScroll("#details-section")}
              whileHover={{ scale: 1.04 }}
              className="text-center cursor-pointer block"
            >
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <MapPin className="h-8 w-8 mx-auto mb-3 opacity-80" />
              </motion.div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="opacity-90">{venue}</p>
              <p className="opacity-90">{venueAddress}</p>
            </motion.a>
          )}

          <motion.a
            href="#attire-section"
            onClick={handleScroll("#attire-section")}
            whileHover={{ scale: 1.04 }}
            className="text-center cursor-pointer block"
          >
            <motion.div whileHover={{ scale: 1.15, rotate: 10 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <Heart className="h-8 w-8 mx-auto mb-3 opacity-80" />
            </motion.div>
            <h3 className="font-semibold mb-2">Dress Code</h3>
            <p className="opacity-90">{dresscode}</p>
            <p className="opacity-90">{dresscodeColors}</p>
          </motion.a>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="opacity-75 text-sm">
            <EditableText as="span" value={tagline} onChange={onTaglineChange ?? (() => {})} multiline />
          </p>
          <p className="opacity-75 text-sm mt-2">
            <EditableText as="span" value={copyright} onChange={onCopyrightTextChange ?? (() => {})} />
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
