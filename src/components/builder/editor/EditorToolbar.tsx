import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Send, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBuilderContext } from "../BuilderContext";
import { supabase } from "@/lib/supabase";

interface EditorToolbarProps {
  previewMode: boolean;
  onTogglePreview: () => void;
  onBack: () => void;
}

const EditorToolbar = ({ previewMode, onTogglePreview, onBack }: EditorToolbarProps) => {
  const { config } = useBuilderContext();
  const [publishing, setPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [slugInput, setSlugInput] = useState(
    config.couple.combinedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "my-wedding"
  );
  const [showSlugDialog, setShowSlugDialog] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const slug = slugInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      const { error } = await supabase.from("wedding_sites").upsert(
        {
          slug,
          config: config as unknown as Record<string, unknown>,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
      if (error) throw error;
      setPublishedSlug(slug);
      setShowSlugDialog(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to publish. Please try again.";
      setPublishError(msg);
    } finally {
      setPublishing(false);
    }
  };

  const publishedUrl = publishedSlug ? `${window.location.origin}/site/${publishedSlug}` : null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-px bg-border" />

          {/* Couple names + date display */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground truncate">{config.couple.combinedName}</span>
              {config.event.displayDate && (
                <>
                  <span className="text-muted-foreground hidden sm:inline">·</span>
                  <span className="text-muted-foreground hidden sm:inline">{config.event.displayDate}</span>
                </>
              )}
            </div>
          </div>

          {/* Preview toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            className="gap-1.5 text-xs"
          >
            {previewMode ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Preview
              </>
            )}
          </Button>

          {/* Publish button */}
          <Button
            size="sm"
            onClick={() => setShowSlugDialog(true)}
            disabled={publishing}
            className="gap-1.5 text-xs"
          >
            {publishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {/* Spacer for fixed toolbar */}
      <div className="h-[49px]" />

      {/* Publish slug dialog */}
      <Dialog open={showSlugDialog} onOpenChange={setShowSlugDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Publish Your Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your site URL</label>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">{window.location.origin}/site/</span>
                <Input
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="your-names"
                  className="h-8 text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only letters, numbers, and hyphens. E.g., <code>prince-and-ann</code>
              </p>
            </div>

            {publishError && (
              <p className="text-sm text-destructive">{publishError}</p>
            )}

            <Button className="w-full" onClick={handlePublish} disabled={publishing || !slugInput.trim()}>
              {publishing ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Publishing…</>
              ) : (
                "Publish Site"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <AnimatePresence>
        {publishedUrl && (
          <Dialog open={!!publishedUrl} onOpenChange={() => setPublishedSlug(null)}>
            <DialogContent className="max-w-sm text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Your site is live!</h2>
                  <p className="text-sm text-muted-foreground">Share this link with your guests:</p>
                </div>
                <div className="w-full rounded-lg bg-muted px-3 py-2 text-sm font-mono break-all text-center">
                  {publishedUrl}
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigator.clipboard.writeText(publishedUrl)}
                  >
                    Copy Link
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => window.open(publishedUrl, "_blank")}
                  >
                    Open Site
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditorToolbar;
