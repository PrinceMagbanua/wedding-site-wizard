import { motion } from "framer-motion";
import { Heart, Calendar, MapPin } from "lucide-react";

const Footer = () => {
  const handleScroll = (selector: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          <h2 className="text-4xl font-bold mb-4">Prince & Ann</h2>
          <p className="text-xl font-light opacity-90">
            #AnnFinallyFoundHerPrince
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
            <p className="opacity-90">Saturday, February 7, 2026</p>
            <p className="opacity-90">Ceremony 1:30 PM</p>
            <p className="opacity-90">Reception 4:00 PM</p>
          </motion.a>

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
            <p className="opacity-90">Hampton Court</p>
            <p className="opacity-90">Hillsborough Village, Muntinlupa</p>
          </motion.a>

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
            <p className="opacity-90">Semi-Formal Attire</p>
            <p className="opacity-90">Sage Green Palette</p>
          </motion.a>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="opacity-75 text-sm">
            We can't wait to celebrate this special day with you
          </p>
          <p className="opacity-75 text-sm mt-2">
            © 2026 Prince & Ann
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
