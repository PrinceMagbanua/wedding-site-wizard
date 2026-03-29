import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PALETTES } from "@/constants/palettes";

interface StepPaletteProps {
  selectedId: string;
  onSelect: (paletteId: string) => void;
}

const StepPalette = ({ selectedId, onSelect }: StepPaletteProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Step 2 of 3</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Palette</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            These colors will apply to your entire site — headings, buttons, accents, and backgrounds.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {PALETTES.map((palette, i) => {
            const isSelected = selectedId === palette.id;
            return (
              <motion.button
                key={palette.id}
                onClick={() => onSelect(palette.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`
                  relative rounded-2xl border-2 p-5 text-left cursor-pointer transition-all duration-200
                  ${isSelected
                    ? "border-foreground shadow-lg"
                    : "border-border hover:border-foreground/30 hover:shadow-md"
                  }
                `}
              >
                {/* Color swatches */}
                <div className="flex gap-1.5 mb-4">
                  {palette.swatches.map((hex, si) => (
                    <div
                      key={si}
                      className={`h-8 rounded-full transition-all duration-200 ${
                        si === 0 ? "flex-[2]" : "flex-1"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>

                {/* Name + description */}
                <h3 className="font-semibold text-foreground mb-1">{palette.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{palette.description}</p>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-background" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default StepPalette;
