import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepDesign from "./steps/StepDesign";
import StepPalette from "./steps/StepPalette";
import StepEditor from "./steps/StepEditor";
import { useBuilderState } from "@/hooks/useBuilderState";
import { PALETTES } from "@/constants/palettes";
import type { WeddingConfig } from "@/types/wedding";

interface BuilderWizardProps {
  initialConfig?: WeddingConfig;
}

const BuilderWizard = ({ initialConfig }: BuilderWizardProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { config, dispatch } = useBuilderState(initialConfig);

  // Derive selected palette ID from current theme colors
  const selectedPaletteId =
    PALETTES.find(
      (p) => p.colors.primary === config.theme.colors.primary
    )?.id ?? "sage-garden";

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  if (step === 3) {
    return (
      <StepEditor
        config={config}
        dispatch={dispatch}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                  s <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-6 rounded transition-colors ${
                    s < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="gap-1.5 text-sm"
        >
          {step === 2 ? "Start Editing" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Step content */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepDesign
                selected={config.theme.design}
                onSelect={(design) => dispatch({ type: "SET_DESIGN", design })}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepPalette
                selectedId={selectedPaletteId}
                onSelect={(paletteId) => dispatch({ type: "SET_PALETTE", paletteId })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuilderWizard;
