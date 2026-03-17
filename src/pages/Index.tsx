import HeroSection from '@/components/HeroSection';
import GreetingSection from '@/components/GreetingSection';
import EventDetails from '@/components/EventDetails';
import PhotoGallery from '@/components/PhotoGallery';
import RSVPSection from '@/components/RSVPSection';
import AttireSection from '@/components/AttireSection';
import GiftsSection from '@/components/GiftsSection';
import VenueSection from '@/components/VenueSection';
import Footer from '@/components/Footer';
import ParallaxBackground from '@/components/ParallaxBackground';

const Index = () => {
  return (
    <div className="relative overflow-x-hidden">
      <ParallaxBackground />
      <div className="relative z-10">
      <HeroSection />
        {/* 
          removed for now, not needed for now
          <GreetingSection /> 
        */}
        <PhotoGallery />
        <EventDetails />
        <RSVPSection />
        <AttireSection />
        <GiftsSection />
        <VenueSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
