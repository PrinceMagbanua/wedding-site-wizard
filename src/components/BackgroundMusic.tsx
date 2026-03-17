import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import musicSrc from "@/assets/music/collide-howie-day-instrumental.mp3";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bounceActive, setBounceActive] = useState(false);

  // Ensure loop and baseline audio config on mount
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current.muted = false;
    audioRef.current.volume = 0.5;
  }, []);

  // Allow other components (e.g., HeroSection) to start music
  useEffect(() => {
    const handlePlayRequest = () => {
      startPlaying();
    };
    window.addEventListener("app:play-music", handlePlayRequest as EventListener);
    return () => {
      window.removeEventListener("app:play-music", handlePlayRequest as EventListener);
    };
  }, []);

  // Periodic bounce attention every ~10s when not playing
  useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    if (!isPlaying) {
      intervalId = window.setInterval(() => {
        setBounceActive(true);
        // stop bounce after animation duration
        timeoutId = window.setTimeout(() => setBounceActive(false), 800);
      }, 10000);
    } else {
      setBounceActive(false);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  const startPlaying = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0.5;
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Playback will fail if not initiated by a user gesture; ignore.
    }
  };

  const stopPlaying = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicSrc} preload="auto" />
      {/* Fixed play/stop toggle with hover label and bounce on initial load */}
      <div className="fixed top-4 right-4 z-[10000]">
        <div className="relative group">
          {/* Slide-out label to the left */}
          <span
            className="pointer-events-none absolute right-full mr-2 mt-1 select-none rounded-full bg-white/90 px-3 py-1 text-sm text-black shadow-md ring-1 ring-black/10 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap w-auto"
            style={{ width: "auto" }}
            aria-hidden
          >
            {isPlaying ? "Stop Music" : "Play Music"}
          </span>
          <motion.button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Stop background music" : "Play background music"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md ring-1 ring-black/10 backdrop-blur transition-colors hover:bg-white"
            animate={bounceActive ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {isPlaying ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default BackgroundMusic;


