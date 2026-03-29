import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentSrc?: string;
}

const ImageUploadModal = ({ open, onClose, onSelect, currentSrc }: ImageUploadModalProps) => {
  const [urlInput, setUrlInput] = useState(currentSrc ?? "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUrlConfirm = () => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
      onClose();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("wedding-assets")
        .upload(path, file, { upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from("wedding-assets").getPublicUrl(path);
      onSelect(data.publicUrl);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Replace Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex-1">
              <Link className="h-4 w-4 mr-2" />
              Paste URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                relative flex flex-col items-center justify-center gap-3
                rounded-xl border-2 border-dashed p-10 text-center transition-colors
                ${dragOver ? "border-primary bg-primary/5" : "border-border"}
              `}
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an image, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    PNG, JPG, WEBP · For venue foreground, use a PNG with transparent background
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleFileUpload(file);
                      };
                      input.click();
                    }}
                  >
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlConfirm()}
              />
            </div>
            {urlInput && (
              <div className="rounded-lg overflow-hidden border bg-muted/30 h-32">
                <img
                  src={urlInput}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            <Button className="w-full" onClick={handleUrlConfirm} disabled={!urlInput.trim()}>
              Use This Image
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
