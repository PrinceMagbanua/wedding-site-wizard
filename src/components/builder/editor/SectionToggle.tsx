import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useBuilderContext } from "../BuilderContext";
import type { WeddingConfig } from "@/types/wedding";

interface SectionToggleProps {
  sectionKey: keyof WeddingConfig["sections"];
}

/**
 * A floating pill at the top-right of each section in the builder editor.
 * Renders nothing when isEditing is false (live site).
 */
const SectionToggle = ({ sectionKey }: SectionToggleProps) => {
  const { isEditing, config, dispatch } = useBuilderContext();

  if (!isEditing) return null;

  const isVisible = config.sections[sectionKey];

  return (
    <motion.div
      className="absolute top-3 right-3 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => dispatch({ type: "TOGGLE_SECTION", section: sectionKey })}
        className={`
          flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg
          border transition-colors
          ${isVisible
            ? "bg-white/90 border-border text-foreground hover:bg-white"
            : "bg-black/70 border-transparent text-white hover:bg-black/80"
          }
        `}
      >
        {isVisible ? (
          <>
            <Eye className="h-3.5 w-3.5" />
            Hide section
          </>
        ) : (
          <>
            <EyeOff className="h-3.5 w-3.5" />
            Show section
          </>
        )}
      </button>
    </motion.div>
  );
};

export default SectionToggle;
