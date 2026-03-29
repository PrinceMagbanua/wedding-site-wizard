import { useState } from "react";
import { motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import RsvpGuestTable from "./RsvpGuestTable";

interface RsvpManagerDrawerProps {
  slug: string;
}

/**
 * Floating button + slide-in Sheet panel for managing RSVP guests.
 * Only renders on /builder and /site/:slug routes.
 */
const RsvpManagerDrawer = ({ slug }: RsvpManagerDrawerProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Only show on builder and site routes
  const shouldShow =
    location.pathname === "/builder" ||
    location.pathname.startsWith("/site/");

  if (!shouldShow || !slug) return null;

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
        aria-label="Open RSVP Manager"
      >
        <Users className="h-6 w-6" />
      </motion.button>

      {/* Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                RSVP Manager
              </SheetTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Managing guests for <code className="text-primary">{slug}</code>
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <RsvpGuestTable slug={slug} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default RsvpManagerDrawer;
