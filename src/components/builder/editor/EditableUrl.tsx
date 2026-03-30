import { useState } from "react";
import { Check, X, Link } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBuilderContext } from "../BuilderContext";

interface EditableUrlProps {
  /** Current URL value — empty string means "not set". */
  value: string;
  onChange: (url: string) => void;
  /** Label shown in the ghost button and popover header, e.g. "Add Maps Link". */
  addLabel: string;
  /** The normal link button to render when a URL is set (passed as children). */
  children: React.ReactNode;
}

/**
 * In non-edit mode: renders `children` when URL is set, nothing when empty.
 * In edit mode:
 *   - Empty URL → ghost dashed "Add X Link" button that opens the popover.
 *   - URL set   → renders children with a hover ring + edit indicator, click opens popover.
 */
const EditableUrl = ({ value, onChange, addLabel, children }: EditableUrlProps) => {
  const { isEditing } = useBuilderContext();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!isEditing) {
    return value ? <>{children}</> : null;
  }

  const handleOpen = (next: boolean) => {
    if (next) setDraft(value); // reset draft to current value when opening
    setOpen(next);
  };

  const handleConfirm = () => {
    onChange(draft.trim());
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setDraft("");
    setOpen(false);
  };

  const trigger = value ? (
    // URL is set — show the link button with a hover ring so it's clear it's editable
    <div className="relative group/edurl inline-block cursor-pointer">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/0 group-hover/edurl:ring-primary/60 transition-all duration-150"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-5 left-0 flex items-center gap-1 rounded-t-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground opacity-0 group-hover/edurl:opacity-100 transition-opacity duration-150 shadow-md whitespace-nowrap z-50"
      >
        <Link className="h-2.5 w-2.5" />
        Edit link
      </span>
    </div>
  ) : (
    // URL is empty — ghost dashed button
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-muted-foreground/30 bg-transparent px-3 py-1.5 text-xs text-muted-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
    >
      <Link className="h-3 w-3" />
      {addLabel}
    </button>
  );

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start" side="top">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {addLabel}
          </p>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") {
                setDraft(value);
                setOpen(false);
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            {value && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClear}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
            <Button size="sm" onClick={handleConfirm}>
              <Check className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditableUrl;
