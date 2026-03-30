/**
 * SiteLayout renders all wedding site sections from a WeddingConfig.
 * Used by both StepEditor (builder preview) and SiteRenderer (/site/:slug).
 *
 * Each section is wrapped in a `relative` div so SectionToggle can position
 * itself correctly. Sections hidden via config.sections are not rendered.
 */
import HeroSection from "@/components/HeroSection";
import PhotoGallery from "@/components/PhotoGallery";
import EventDetails from "@/components/EventDetails";
import RSVPSection from "@/components/RSVPSection";
import AttireSection from "@/components/AttireSection";
import GiftsSection from "@/components/GiftsSection";
import VenueSection from "@/components/VenueSection";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import BackgroundMusic from "@/components/BackgroundMusic";
import SmoothScroll from "@/components/SmoothScroll";
import SectionToggle from "./editor/SectionToggle";
import { useBuilderContext } from "./BuilderContext";
import type { WeddingConfig } from "@/types/wedding";
import type { AttireInspoGroup } from "@/types/wedding";

interface SiteLayoutProps {
  config: WeddingConfig;
  /** When true, renders SmoothScroll and BackgroundMusic inside layout */
  standalone?: boolean;
}

const SiteLayout = ({ config, standalone = false }: SiteLayoutProps) => {
  const { sections, theme, hero, welcome, gallery, events, rsvp, attire, gifts, venue, music, footer } = config;
  const { dispatch } = useBuilderContext();

  // Single-field text setter
  const setText = (path: string) => (value: string) =>
    dispatch({ type: "SET_SECTION_TEXT", path, value });

  // Arbitrary value setter (for arrays, objects, booleans)
  const setField = (path: string) => (value: unknown) =>
    dispatch({ type: "SET_FIELD", path, value });

  // Location field setter for ceremony/reception sub-fields
  const setLocation = (prefix: "events.ceremony" | "events.reception") =>
    (field: string, value: string) =>
      dispatch({ type: "SET_SECTION_TEXT", path: `${prefix}.${field}`, value });

  return (
    <div>
      {standalone && <SmoothScroll />}
      {standalone && theme.showBackgroundMusic && (
        <BackgroundMusic
          src={music.src || undefined}
          autoplay={music.autoplay}
          loop={music.loop}
          defaultVolume={music.defaultVolume}
        />
      )}

      <ParallaxBackground show={theme.showFloralAccents} />

      {sections.hero && (
        <div className="relative">
          <SectionToggle sectionKey="hero" />
          <HeroSection
            backgroundImages={hero.backgroundImages.length > 0 ? hero.backgroundImages : undefined}
            coupleNames={config.couple.combinedName}
            tagline={hero.tagline}
            showRsvpButton={hero.showRsvpButton}
            rsvpButtonLabel={hero.rsvpButtonLabel}
            overlayOpacity={hero.overlayOpacity}
            onCoupleNamesChange={setText("couple.combinedName")}
            onTaglineChange={setText("hero.tagline")}
            onBackgroundImagesChange={setField("hero.backgroundImages") as (images: string[]) => void}
          />
        </div>
      )}

      {sections.welcome && (
        <div className="relative">
          <SectionToggle sectionKey="welcome" />
          <PhotoGallery
            heading={welcome.heading}
            body={[welcome.body]}
            photos={gallery.images.length > 0 ? gallery.images : undefined}
            onHeadingChange={setText("welcome.heading")}
            onBodyChange={setText("welcome.body")}
            onPhotosChange={(srcs) =>
              dispatch({
                type: "SET_FIELD",
                path: "gallery.images",
                value: srcs.map((src, i) => ({ src, alt: gallery.images[i]?.alt ?? "" })),
              })
            }
          />
        </div>
      )}

      {sections.gallery && gallery.images.length > 0 && (
        <div className="relative">
          <SectionToggle sectionKey="gallery" />
          {/* Additional gallery if separate from welcome photos */}
        </div>
      )}

      {sections.events && (
        <div className="relative">
          <SectionToggle sectionKey="events" />
          <EventDetails
            heading={events.heading}
            onHeadingChange={setText("events.heading")}
            dayOfWeek={config.event.dayOfWeek}
            onDayOfWeekChange={setText("event.dayOfWeek")}
            displayDate={config.event.displayDate}
            onDisplayDateChange={setText("event.displayDate")}
            ceremony={{
              label: events.ceremony.label,
              time: events.ceremony.time,
              venueName: events.ceremony.venueName,
              address: events.ceremony.address,
              mapUrl: events.ceremony.mapUrl,
              wazeUrl: events.ceremony.wazeUrl,
            }}
            onCeremonyChange={setLocation("events.ceremony")}
            reception={{
              label: events.reception.label,
              time: events.reception.time,
              venueName: events.reception.venueName,
              address: events.reception.address,
              mapUrl: events.reception.mapUrl,
              wazeUrl: events.reception.wazeUrl,
            }}
            onReceptionChange={setLocation("events.reception")}
          />
        </div>
      )}

      {sections.rsvp && (
        <div className="relative">
          <SectionToggle sectionKey="rsvp" />
          <RSVPSection
            heading={rsvp.heading}
            subheading={rsvp.subheading}
            instructions={rsvp.instructions}
            showNote={rsvp.showNote}
            noteTitle={rsvp.noteTitle}
            onHeadingChange={setText("rsvp.heading")}
            onSubheadingChange={setText("rsvp.subheading")}
            onInstructionsChange={setText("rsvp.instructions")}
            onNoteTitleChange={setText("rsvp.noteTitle")}
            onToggleNote={() => dispatch({ type: "SET_FIELD", path: "rsvp.showNote", value: !rsvp.showNote })}
          />
        </div>
      )}

      {sections.attire && (
        <div className="relative">
          <SectionToggle sectionKey="attire" />
          <AttireSection
            heading={attire.heading}
            dresscode={attire.dresscode.value}
            dresscodeInstructions={attire.dresscode.description}
            palette={attire.palette.map((c) => ({ name: c.name, color: c.hex }))}
            inspoGroups={attire.inspoGroups as AttireInspoGroup[]}
            onHeadingChange={setText("attire.heading")}
            onDresscodeChange={setText("attire.dresscode.value")}
            onDresscodeInstructionsChange={setText("attire.dresscode.description")}
            onInspoGroupsChange={setField("attire.inspoGroups") as (groups: AttireInspoGroup[]) => void}
          />
        </div>
      )}

      {sections.gifts && (
        <div className="relative">
          <SectionToggle sectionKey="gifts" />
          <GiftsSection
            heading={gifts.heading}
            message={[gifts.message]}
            footnote={gifts.footnote}
            showAccountDetails={gifts.showAccountDetails}
            accounts={gifts.accounts}
            registryLink={gifts.registryLink || undefined}
            onHeadingChange={setText("gifts.heading")}
            onMessageChange={setText("gifts.message")}
            onFootnoteChange={setText("gifts.footnote")}
          />
        </div>
      )}

      {sections.venue && (
        <div className="relative">
          <SectionToggle sectionKey="venue" />
          <VenueSection
            backgroundImage={venue.backgroundImage || undefined}
            foregroundImage={venue.foregroundImage || undefined}
            venueName={venue.venueName}
            overlayOpacity={venue.overlayOpacity}
            onVenueNameChange={setText("venue.venueName")}
            onBackgroundImageChange={(src) => dispatch({ type: "SET_FIELD", path: "venue.backgroundImage", value: src })}
            onForegroundImageChange={(src) => dispatch({ type: "SET_FIELD", path: "venue.foregroundImage", value: src })}
          />
        </div>
      )}

      {sections.footer && (
        <div className="relative">
          <SectionToggle sectionKey="footer" />
          <Footer
            coupleNames={config.couple.combinedName}
            hashtag={config.couple.hashtag}
            tagline={footer.tagline}
            showHashtag={footer.showHashtag}
            date={config.event.displayDate ? `${config.event.dayOfWeek}, ${config.event.displayDate}` : undefined}
            venue={events.reception.venueName}
            venueAddress={events.reception.address}
            dresscode={attire.dresscode.value}
            showDate={footer.showDate}
            showVenue={footer.showVenue}
            copyrightText={footer.copyrightText || undefined}
            onCoupleNamesChange={setText("couple.combinedName")}
            onHashtagChange={setText("couple.hashtag")}
            onTaglineChange={setText("footer.tagline")}
            onCopyrightTextChange={setText("footer.copyrightText")}
          />
        </div>
      )}
    </div>
  );
};

export default SiteLayout;
