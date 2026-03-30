import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useBuilderContext } from "../BuilderContext";
import ImageUploadModal from "./ImageUploadModal";

interface EditableImageProps {
  src: string;
  alt?: string;
  onChange: (newSrc: string) => void;
  className?: string;
  children: React.ReactNode;
}

const ImageIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1.1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

/**
 * Wraps any image or image container. In edit mode, shows a `+` overlay on
 * hover and opens ImageUploadModal on click. In preview mode renders children
 * as-is.
 */
const EditableImage = ({ src, alt, onChange, className, children }: EditableImageProps) => {
  const { isEditing } = useBuilderContext();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div className={`relative group ${className ?? ""}`}>
      {children}

      {/* Hover overlay with replace button */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-200 rounded-inherit flex items-center justify-center pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg"
          aria-label={`Replace image${alt ? `: ${alt}` : ""}`}
        >
          <Plus className="h-5 w-5 text-foreground" />
        </motion.button>
      </div>

      {/* Hover badge — mirrors the EditableText badge so users can distinguish what they'll edit */}
      <div className="absolute left-0 top-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
        <span className="flex items-center gap-1 rounded-br-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-md whitespace-nowrap">
          <ImageIcon />
          Image
        </span>
      </div>

      <ImageUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={onChange}
        currentSrc={src}
      />
    </div>
  );
};

export default EditableImage;
