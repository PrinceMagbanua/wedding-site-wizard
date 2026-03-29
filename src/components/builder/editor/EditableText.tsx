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

/**
 * When BuilderContext.isEditing is false, renders as a plain element.
 * When isEditing is true, adds a hover ring and click-to-edit behavior.
 * Uses contentEditable so it looks native in the live preview.
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

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={cn(
        className,
        "relative outline-none cursor-text",
        "hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 rounded-sm",
        focused && "ring-2 ring-primary ring-offset-1",
        !value && "before:content-[attr(data-placeholder)] before:text-muted-foreground/50 before:pointer-events-none"
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
        if (e.key === "Escape") {
          ref.current?.blur();
        }
      }}
      // Restore value on every render to keep in sync (only when not focused)
      dangerouslySetInnerHTML={focused ? undefined : { __html: value || "" }}
    >
      {focused ? value : undefined}
    </Tag>
  );
};

export default EditableText;
