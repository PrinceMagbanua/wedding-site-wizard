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
import type { WeddingConfig } from "@/types/wedding";

interface SiteLayoutProps {
  config: WeddingConfig;
  /** When true, renders SmoothScroll and BackgroundMusic inside layout */
  standalone?: boolean;
}

const SiteLayout = ({ config, standalone = false }: SiteLayoutProps) => {
  const { sections, theme, hero, welcome, gallery, events, rsvp, attire, gifts, venue, music, footer } = config;

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
            dayOfWeek={config.event.dayOfWeek}
            displayDate={config.event.displayDate}
            ceremony={{
              label: events.ceremony.label,
              time: events.ceremony.time,
              venueName: events.ceremony.venueName,
              address: events.ceremony.address,
              mapUrl: events.ceremony.mapUrl,
            }}
            reception={{
              label: events.reception.label,
              time: events.reception.time,
              venueName: events.reception.venueName,
              address: events.reception.address,
              mapUrl: events.reception.mapUrl,
            }}
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
          />
        </div>
      )}

      {sections.gifts && (
        <div className="relative">
          <SectionToggle sectionKey="gifts" />
          <GiftsSection
            heading={gifts.heading}
            message={[gifts.message]}
            showAccountDetails={gifts.showAccountDetails}
            accounts={gifts.accounts}
            registryLink={gifts.registryLink || undefined}
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
          />
        </div>
      )}

      {sections.footer && (
        <div className="relative">
          <SectionToggle sectionKey="footer" />
          <Footer
            coupleNames={config.couple.combinedName}
            hashtag={config.couple.hashtag}
            showHashtag={footer.showHashtag}
            date={config.event.displayDate ? `${config.event.dayOfWeek}, ${config.event.displayDate}` : undefined}
            venue={events.reception.venueName}
            venueAddress={events.reception.address}
            dresscode={attire.dresscode.value}
            showDate={footer.showDate}
            showVenue={footer.showVenue}
            copyrightText={footer.copyrightText || undefined}
          />
        </div>
      )}
    </div>
  );
};

export default SiteLayout;
