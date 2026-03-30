import { useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUploadModal from "./ImageUploadModal";

interface ImageManagerModalProps {
  open: boolean;
  onClose: () => void;
  /** Current array of image URLs. */
  images: string[];
  /** Called with the full updated array whenever any image is added, replaced, or removed. */
  onChange: (images: string[]) => void;
  title?: string;
  maxImages?: number;
  minImages?: number;
}

/**
 * Manages an ordered list of images: replace individual slots, add new ones,
 * remove existing ones. Reuses ImageUploadModal for the actual file/URL picking.
 *
 * Used for hero background slideshow, gallery photos, and attire inspo looks.
 */
const ImageManagerModal = ({
  open,
  onClose,
  images,
  onChange,
  title = "Manage Images",
  maxImages = 10,
  minImages = 0,
}: ImageManagerModalProps) => {
  // Index of the slot currently being replaced (null = adding a new image)
  const [pickerTarget, setPickerTarget] = useState<number | null | "add">(null);

  const handleSelect = (url: string) => {
    if (pickerTarget === "add") {
      onChange([...images, url]);
    } else if (typeof pickerTarget === "number") {
      const next = [...images];
      next[pickerTarget] = url;
      onChange(next);
    }
    setPickerTarget(null);
  };

  const handleRemove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const canAdd = images.length < maxImages;
  const canRemove = images.length > minImages;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {images.length} of {maxImages} image{maxImages !== 1 ? "s" : ""}
              {minImages > 0 ? ` · minimum ${minImages}` : ""}
            </p>

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((src, idx) => (
                <div key={`${src}-${idx}`} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={src}
                    alt={`Image ${idx + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* Hover overlay: replace */}
                  <button
                    type="button"
                    onClick={() => setPickerTarget(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
                    aria-label={`Replace image ${idx + 1}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white text-foreground text-xs font-medium px-2 py-1 rounded-full shadow">
                      <ImageIcon className="h-3 w-3" />
                      Replace
                    </span>
                  </button>

                  {/* Remove button */}
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {/* Slot label */}
                  <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                    {idx + 1}
                  </span>
                </div>
              ))}

              {/* Add new image slot */}
              {canAdd && (
                <button
                  type="button"
                  onClick={() => setPickerTarget("add")}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
                  aria-label="Add image"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-xs font-medium">Add</span>
                </button>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single-image picker used for both replace and add */}
      <ImageUploadModal
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={handleSelect}
        currentSrc={typeof pickerTarget === "number" ? images[pickerTarget] : ""}
      />
    </>
  );
};

export default ImageManagerModal;
