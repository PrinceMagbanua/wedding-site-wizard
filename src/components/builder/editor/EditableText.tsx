import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useBuilderContext } from "../BuilderContext";

type TextTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: TextTag;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

const BLOCK_TAGS = new Set<TextTag>(["h1", "h2", "h3", "h4", "p"]);

const PencilIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

/**
 * When BuilderContext.isEditing is false, renders as a plain element.
 * When isEditing is true, wraps in a relative container that shows:
 *   - a white ring (visible on any background, dark or light) on hover
 *   - a small "Text" badge at the top-left on hover so users know what they'll edit
 *   - a primary-color ring when actively focused/editing
 */
const EditableText = ({
  value,
  onChange,
  as: Tag = "span",
  className,
  multiline = false,
  placeholder = "Click to edit...",
}: EditableTextProps) => {
  const { isEditing } = useBuilderContext();
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  if (!isEditing) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  // Use a block-level wrapper for block tags, inline for span
  const WrapEl: "div" | "span" = BLOCK_TAGS.has(Tag) ? "div" : "span";

  return (
    <WrapEl className="relative group/edtext">
      <Tag
        ref={ref as React.RefObject<never>}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={cn(
          className,
          "relative outline-none cursor-text rounded-sm transition-shadow",
          // Hover: white ring + dark outer shadow — visible on dark (hero) and light backgrounds
          !focused &&
            "group-hover/edtext:ring-2 group-hover/edtext:ring-white group-hover/edtext:shadow-[0_0_0_3px_rgba(0,0,0,0.30)]",
          // Active editing: primary ring
          focused && "ring-2 ring-primary shadow-[0_0_0_3px_rgba(0,0,0,0.15)]",
          !value &&
            "before:content-[attr(data-placeholder)] before:text-muted-foreground/50 before:pointer-events-none"
        )}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          const newVal = e.currentTarget.textContent ?? "";
          if (newVal !== value) onChange(newVal);
        }}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") {
            e.preventDefault();
            ref.current?.blur();
          }
          if (e.key === "Escape") ref.current?.blur();
        }}
        dangerouslySetInnerHTML={focused ? undefined : { __html: value || "" }}
      >
        {focused ? value : undefined}
      </Tag>

      {/* Hover badge — shows what will be edited, hidden while typing */}
      {!focused && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-50 -translate-y-full flex items-center gap-1 rounded-t-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/edtext:opacity-100 whitespace-nowrap"
        >
          <PencilIcon />
          Text
        </span>
      )}
    </WrapEl>
  );
};

export default EditableText;
