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

      {/* Hover overlay */}
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
