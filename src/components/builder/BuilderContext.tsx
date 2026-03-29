import { createContext, useContext } from "react";
import type { WeddingConfig } from "@/types/wedding";

export type BuilderAction =
  | { type: "SET_DESIGN"; design: WeddingConfig["theme"]["design"] }
  | { type: "SET_PALETTE"; paletteId: string }
  | { type: "SET_THEME_COLORS"; colors: WeddingConfig["theme"]["colors"] }
  | { type: "SET_SECTION_TEXT"; path: string; value: string }
  | { type: "SET_SECTION_IMAGE"; path: string; src: string }
  | { type: "TOGGLE_SECTION"; section: keyof WeddingConfig["sections"] }
  | { type: "SET_FIELD"; path: string; value: unknown }
  | { type: "LOAD_CONFIG"; config: WeddingConfig };

export interface BuilderContextValue {
  isEditing: boolean;
  config: WeddingConfig;
  dispatch: React.Dispatch<BuilderAction>;
}

const defaultDispatch: React.Dispatch<BuilderAction> = () => {
  // no-op for non-editing contexts (e.g., /site/:slug)
};

export const BuilderContext = createContext<BuilderContextValue>({
  isEditing: false,
  config: {} as WeddingConfig,
  dispatch: defaultDispatch,
});

export function useBuilderContext() {
  return useContext(BuilderContext);
}
