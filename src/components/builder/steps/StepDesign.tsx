import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DESIGN_VARIANTS } from "@/constants/palettes";
import type { DesignVariant } from "@/types/wedding";

interface StepDesignProps {
  selected: DesignVariant;
  onSelect: (design: DesignVariant) => void;
}

const StepDesign = ({ selected, onSelect }: StepDesignProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Step 1 of 3</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Style</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pick the layout personality that feels most like you. You can always preview with your own content next.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DESIGN_VARIANTS.map((variant, i) => {
            const isSelected = selected === variant.id;
            return (
              <motion.button
                key={variant.id}
                onClick={() => onSelect(variant.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
                  relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/40 hover:shadow-md"
                  }
                `}
              >
                {/* Visual preview card */}
                <div className={`h-48 ${variant.previewBg} relative overflow-hidden`}>
                  <DesignPreview variant={variant.id} />
                </div>

                {/* Check indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-1">{variant.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">{variant.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{variant.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// Tiny visual previews for each design variant
const DesignPreview = ({ variant }: { variant: DesignVariant }) => {
  if (variant === "classic") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 p-6">
        <div className="w-16 h-1 bg-stone-300 rounded-full" />
        <div className="text-stone-400 text-2xl font-serif italic">A & B</div>
        <div className="w-10 h-0.5 bg-stone-300 rounded-full" />
        <div className="text-stone-300 text-xs tracking-widest uppercase">are getting married</div>
        <div className="w-8 h-8 rounded-full border border-stone-300 mt-2 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-stone-300" />
        </div>
      </div>
    );
  }

  if (variant === "modern") {
    return (
      <div className="h-full flex flex-col justify-between p-6">
        <div className="text-3xl font-black text-gray-800 leading-none">A<br/>& B</div>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="w-12 h-0.5 bg-gray-400" />
            <div className="text-xs text-gray-400 uppercase tracking-widest">2026</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // romantic
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-100/50 to-rose-50" />
      <div className="relative text-rose-300 text-3xl" style={{ fontFamily: "cursive" }}>A & B</div>
      <div className="relative text-xs text-rose-300 tracking-widest uppercase">forever begins</div>
      <div className="relative flex gap-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-200" />
        ))}
      </div>
    </div>
  );
};

export default StepDesign;
