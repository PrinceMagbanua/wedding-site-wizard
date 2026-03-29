import { useState } from "react";
import { BuilderContext } from "../BuilderContext";
import type { BuilderAction } from "../BuilderContext";
import type { WeddingConfig } from "@/types/wedding";
import { useTheme } from "@/hooks/useTheme";
import SiteLayout from "../SiteLayout";
import EditorToolbar from "../editor/EditorToolbar";
import RsvpManagerDrawer from "@/components/rsvp-manager/RsvpManagerDrawer";

interface StepEditorProps {
  config: WeddingConfig;
  dispatch: React.Dispatch<BuilderAction>;
  onBack: () => void;
}

const StepEditor = ({ config, dispatch, onBack }: StepEditorProps) => {
  const [previewMode, setPreviewMode] = useState(false);

  // Inject theme CSS vars into the scoped [data-wedding-theme] element
  useTheme(config.theme.colors, config.theme.fonts);

  return (
    <BuilderContext.Provider
      value={{
        isEditing: !previewMode,
        config,
        dispatch,
      }}
    >
      <EditorToolbar
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode((p) => !p)}
        onBack={onBack}
      />

      {/* Scoped theme target + scrollable site preview */}
      <div data-wedding-theme className="relative">
        {!previewMode && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full backdrop-blur shadow-lg">
              Click any text or image to edit
            </div>
          </div>
        )}
        <SiteLayout config={config} standalone={false} />
      </div>

      {/* RSVP Manager floating button (uses slug from published site — shows a prompt if not yet published) */}
      <RsvpManagerDrawer slug="builder-preview" />
    </BuilderContext.Provider>
  );
};

export default StepEditor;
