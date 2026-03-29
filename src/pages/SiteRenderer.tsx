import { useParams } from "react-router-dom";
import { useWeddingSite } from "@/hooks/useWeddingSite";
import { useTheme } from "@/hooks/useTheme";
import { BuilderContext } from "@/components/builder/BuilderContext";
import SiteLayout from "@/components/builder/SiteLayout";
import RsvpManagerDrawer from "@/components/rsvp-manager/RsvpManagerDrawer";
import { Loader2, Heart } from "lucide-react";

const SiteRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: config, isLoading, error } = useWeddingSite(slug ?? "");

  // Apply theme globally on /site/:slug (not scoped — it IS the site)
  useTheme(config?.theme.colors, config?.theme.fonts, ":root");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading your wedding site…</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Site not found</h1>
        <p className="text-muted-foreground max-w-sm">
          We couldn't find a wedding site at this URL. The couple may not have published their site yet,
          or the link may be incorrect.
        </p>
        <a href="/builder" className="text-sm text-primary underline underline-offset-4">
          Create your own wedding site →
        </a>
      </div>
    );
  }

  return (
    // isEditing=false → no edit chrome rendered by SectionToggle / EditableText
    <BuilderContext.Provider
      value={{
        isEditing: false,
        config,
        dispatch: () => {},
      }}
    >
      <SiteLayout config={config} standalone={true} />
      <RsvpManagerDrawer slug={slug ?? ""} />
    </BuilderContext.Provider>
  );
};

export default SiteRenderer;
