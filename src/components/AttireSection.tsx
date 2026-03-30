import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, X, Image as ImageIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import EditableText from "./builder/editor/EditableText";
import ImageUploadModal from "./builder/editor/ImageUploadModal";
import { useBuilderContext } from "./builder/BuilderContext";
import type { AttireInspoGroup } from "@/types/wedding";

export interface PaletteColor {
  name: string;
  color: string; // hex
}

export interface AttrireSectionProps {
  heading?: string;
  dresscode?: string;
  dresscodeInstructions?: string;
  palette?: PaletteColor[];
  inspoGroups?: AttireInspoGroup[];
  onHeadingChange?: (value: string) => void;
  onDresscodeChange?: (value: string) => void;
  onDresscodeInstructionsChange?: (value: string) => void;
  onInspoGroupsChange?: (groups: AttireInspoGroup[]) => void;
}

const defaultPalette: PaletteColor[] = [
  { name: "Deep Olive", color: "#4a6a45" },
  { name: "Garden Green", color: "#5c7f53" },
  { name: "Soft Sage", color: "#7ea56a" },
  { name: "Fresh Mint", color: "#4faa76" },
  { name: "Sage Khaki", color: "#a7b38c" },
];

import men1 from "@/assets/attire/men-1.jpg";
import men2 from "@/assets/attire/men-2.jpg";
import men3 from "@/assets/attire/men-3.jpg";
import men4 from "@/assets/attire/men-4.jpg";
import women1 from "@/assets/attire/women-1.jpg";
import women2 from "@/assets/attire/women-2.jpg";
import women3 from "@/assets/attire/women-3.jpg";
import women4 from "@/assets/attire/women-4.jpg";

const defaultInspoGroups: AttireInspoGroup[] = [
  {
    label: "For her",
    description: "Dress · Skirt · Blazer · Jumpsuit",
    looks: [
      { title: "Soft florals", image: women1 },
      { title: "Champagne satin", image: women2 },
      { title: "Romantic sleeves", image: women3 },
      { title: "Mixed neutrals", image: women4 },
    ],
  },
  {
    label: "For him",
    description: "Long Sleeves · Polo · Slacks · Blazer",
    looks: [
      { title: "Sage suiting", image: men1 },
      { title: "Black-tie optional", image: men2 },
      { title: "Modern charcoal", image: men3 },
      { title: "Casual luxe", image: men4 },
    ],
  },
];

const MAX_GROUPS = 4;
const MAX_LOOKS = 4;
const MIN_LOOKS = 1;

const AttireSection = ({
  heading = "Attire & Colors",
  dresscode = "Semi-Formal",
  dresscodeInstructions = "We kindly encourage our guests to wear these colors for our special day.",
  palette = defaultPalette,
  inspoGroups,
  onHeadingChange,
  onDresscodeChange,
  onDresscodeInstructionsChange,
  onInspoGroupsChange,
}: AttrireSectionProps = {}) => {
  const { isEditing } = useBuilderContext();

  // Use prop groups if provided (from config), else fall back to built-in defaults
  const groups = inspoGroups && inspoGroups.length > 0 ? inspoGroups : defaultInspoGroups;

  // Track which image slot is being replaced: { groupIdx, lookIdx } or { groupIdx, mode: "add" }
  const [pickerState, setPickerState] = useState<
    { groupIdx: number; lookIdx: number } | { groupIdx: number; mode: "add" } | null
  >(null);

  // ─── Group mutation helpers ───────────────────────────────────────────────

  const updateGroups = (next: AttireInspoGroup[]) => onInspoGroupsChange?.(next);

  const setGroupField = (idx: number, field: "label" | "description", value: string) => {
    updateGroups(groups.map((g, i) => (i === idx ? { ...g, [field]: value } : g)));
  };

  const addGroup = () => {
    if (groups.length >= MAX_GROUPS) return;
    updateGroups([...groups, { label: "New Group", description: "", looks: [] }]);
  };

  const removeGroup = (idx: number) => {
    updateGroups(groups.filter((_, i) => i !== idx));
  };

  const handleImageSelect = (url: string) => {
    if (!pickerState) return;
    const { groupIdx } = pickerState;
    const group = groups[groupIdx];
    let newLooks: AttireInspoGroup["looks"];

    if ("mode" in pickerState) {
      // Adding a new look
      newLooks = [
        ...group.looks,
        { title: `Look ${group.looks.length + 1}`, image: url },
      ];
    } else {
      // Replacing an existing look
      newLooks = group.looks.map((look, i) =>
        i === pickerState.lookIdx ? { ...look, image: url } : look
      );
    }

    updateGroups(groups.map((g, i) => (i === groupIdx ? { ...g, looks: newLooks } : g)));
    setPickerState(null);
  };

  const removeLook = (groupIdx: number, lookIdx: number) => {
    const group = groups[groupIdx];
    if (group.looks.length <= MIN_LOOKS) return;
    const newLooks = group.looks.filter((_, i) => i !== lookIdx);
    updateGroups(groups.map((g, i) => (i === groupIdx ? { ...g, looks: newLooks } : g)));
  };

  return (
    <section id="attire-section" className="py-20 px-4" style={{ background: "var(--gradient-sage)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-5xl"
      >
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex"
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
          <h2 className="mb-3 text-5xl font-bold text-foreground md:text-6xl">
            <EditableText as="span" value={heading} onChange={onHeadingChange ?? (() => {})} />
          </h2>
        </div>

        <div className="space-y-8">
          {/* Dress code + palette card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <Card className="relative overflow-hidden border-none bg-card/90 p-8 shadow-xl backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-transparent" />
              <div className="relative space-y-8">
                <div className="grid gap-8 md:grid-cols-[1.1fr_auto] md:items-center">
                  <div className="space-y-3 md:text-left text-center">
                    <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Dress Code</p>
                    <h3 className="text-2xl font-semibold text-foreground">
                      <EditableText as="span" value={dresscode} onChange={onDresscodeChange ?? (() => {})} />
                    </h3>
                    <div className="space-y-3 text-base text-muted-foreground">
                      <p className="text-center md:text-left">
                        <EditableText as="span" value={dresscodeInstructions} onChange={onDresscodeInstructionsChange ?? (() => {})} multiline />
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 sm:grid sm:grid-cols-5 sm:gap-6 md:justify-self-end">
                    {palette.map((tone, index) => (
                      <motion.div
                        key={tone.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="flex w-[30%] flex-col items-center justify-center text-center sm:w-auto"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className="inline-block h-12 w-12 rounded-full ring-2 ring-border shadow-lg sm:h-14 sm:w-14"
                            style={{ backgroundColor: tone.color }}
                            aria-label={tone.name}
                          />
                        </div>
                        <div className="flex-1 flex items-start justify-center w-full min-h-[2.2rem]">
                          <p className="mt-2 text-[11px] font-medium text-foreground/80 leading-tight break-words w-full sm:text-xs">
                            {tone.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Inspiration card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-none bg-card/90 p-8 shadow-xl backdrop-blur">
              <div className="mb-4 space-y-1">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Inspiration</p>
                <h3 className="text-2xl font-semibold text-foreground pb-6">What to wear</h3>
              </div>

              <div className="space-y-6">
                {groups.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-3">
                    {/* Group header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          <EditableText
                            as="span"
                            value={group.label}
                            onChange={(v) => setGroupField(groupIdx, "label", v)}
                          />
                        </p>
                        {(group.description || isEditing) && (
                          <p className="text-xs text-muted-foreground">
                            <EditableText
                              as="span"
                              value={group.description ?? ""}
                              onChange={(v) => setGroupField(groupIdx, "description", v)}
                              placeholder="Add subtitle (e.g. Dress · Skirt · Blazer)"
                            />
                          </p>
                        )}
                      </div>
                      {/* Remove group button */}
                      {isEditing && groups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGroup(groupIdx)}
                          title="Remove this group"
                          className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors mt-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Looks grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                      {group.looks.map((look, lookIdx) => (
                        isEditing ? (
                          /* Edit mode: replace / remove */
                          <div key={lookIdx} className="group relative overflow-hidden rounded-2xl border bg-muted/40 shadow-sm">
                            <div className="aspect-[4/5] relative overflow-hidden">
                              {look.image ? (
                                <img
                                  src={look.image}
                                  alt={look.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-muted">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                              )}

                              {/* Replace overlay */}
                              <button
                                type="button"
                                onClick={() => setPickerState({ groupIdx, lookIdx })}
                                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
                              >
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white text-foreground text-xs font-medium px-2 py-1 rounded-full shadow">
                                  <ImageIcon className="h-3 w-3" />
                                  Replace
                                </span>
                              </button>

                              {/* Remove look */}
                              {group.looks.length > MIN_LOOKS && (
                                <button
                                  type="button"
                                  onClick={() => removeLook(groupIdx, lookIdx)}
                                  className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Live mode: lightbox dialog */
                          <Dialog key={look.title}>
                            <DialogTrigger asChild>
                              <motion.button
                                type="button"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: lookIdx * 0.04 }}
                                className="group relative overflow-hidden rounded-2xl border bg-muted/40 shadow-sm"
                              >
                                <img
                                  src={look.image}
                                  alt={look.title}
                                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </motion.button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl overflow-hidden p-0">
                              <DialogClose asChild>
                                <button type="button" className="w-full">
                                  <img
                                    src={look.image}
                                    alt={look.title}
                                    className="w-full max-h-[80vh] object-cover"
                                  />
                                </button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                        )
                      ))}

                      {/* Add look slot (edit mode only, max 4 per group) */}
                      {isEditing && group.looks.length < MAX_LOOKS && (
                        <button
                          type="button"
                          onClick={() => setPickerState({ groupIdx, mode: "add" })}
                          className="aspect-[4/5] rounded-2xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 text-muted-foreground/50 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          <Plus className="h-6 w-6" />
                          <span className="text-xs font-medium">Add Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add group button (edit mode only, max 4 groups) */}
                {isEditing && groups.length < MAX_GROUPS && (
                  <button
                    type="button"
                    onClick={addGroup}
                    className="mt-4 w-full rounded-xl border-2 border-dashed border-muted-foreground/25 py-4 flex items-center justify-center gap-2 text-sm text-muted-foreground/60 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Row
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Single image picker for all look replacement / addition */}
      <ImageUploadModal
        open={pickerState !== null}
        onClose={() => setPickerState(null)}
        onSelect={handleImageSelect}
        currentSrc={
          pickerState && !("mode" in pickerState)
            ? groups[pickerState.groupIdx]?.looks[pickerState.lookIdx]?.image ?? ""
            : ""
        }
      />
    </section>
  );
};

export default AttireSection;
