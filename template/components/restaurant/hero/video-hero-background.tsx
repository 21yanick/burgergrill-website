"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { VideoHeroProps } from "./types";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoHeroBackground({ 
  videoSrc, 
  fallbackImage, 
  children, 
  overlayOpacity = 0.4,
  className 
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection with intelligent video strategy
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      
      // Enable video on mobile for better UX - with performance optimizations
      setShowVideo(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video loading and performance optimization with smart mobile strategy
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    // Connection-aware loading for mobile optimization
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.saveData
    );

    // Lazy loading with network-aware strategy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // On mobile with slow connection, delay video loading slightly
            const loadDelay = (isMobile && isSlowConnection) ? 1000 : 0;
            
            setTimeout(() => {
              video.load();
            }, loadDelay);
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: isMobile ? 0.2 : 0.1 } // Larger threshold for mobile
    );

    const handleCanPlay = () => {
      setIsLoaded(true);
      // Ensure video plays smoothly
      video.play().catch(console.warn);
    };

    const handleLoadStart = () => {
      setIsLoaded(false);
    };

    const handleError = () => {
      console.warn('Video failed to load, using fallback');
      setShowVideo(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('error', handleError);
    
    // Start intersection observer
    observer.observe(video);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('error', handleError);
      observer.disconnect();
    };
  }, [showVideo]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.warn);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Video Background */}
      {showVideo && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload={isMobile ? "metadata" : "none"}
            poster=""
            disablePictureInPicture
            controlsList="nodownload"
          >
            {/* Mobile-optimized sources first */}
            {isMobile ? (
              <>
                <source src={videoSrc.replace('.mp4', '_mobile.webm')} type="video/webm" media="(max-width: 768px)" />
                <source src={videoSrc.replace('.mp4', '_mobile.mp4')} type="video/mp4" media="(max-width: 768px)" />
                <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
                <source src={videoSrc.replace('.mp4', '_optimized.mp4')} type="video/mp4" />
                <source src={videoSrc} type="video/mp4" />
              </>
            ) : (
              <>
                <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
                <source src={videoSrc.replace('.mp4', '_optimized.mp4')} type="video/mp4" />
                <source src={videoSrc} type="video/mp4" />
              </>
            )}
            {/* Fallback for unsupported browsers */}
            Your browser does not support the video tag.
          </video>
          
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0">
              {/* CSS-based gradient fallback */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/90" />
              
              {/* Pattern overlay for texture */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
              
              {/* Actual image overlay when available */}
              {fallbackImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
                  style={{ backgroundImage: `url(${fallbackImage})` }}
                />
              )}
            </div>
          )}
        </div>
      )}


      {/* Dark Overlay for Text Readability */}
      <div 
        className="absolute inset-0 z-10 bg-black transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Video Controls - Only show on desktop with video */}
      {showVideo && !isMobile && (
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-20 h-full min-h-screen flex items-center">
        {children}
      </div>

      {/* Performance Indicator */}
      {showVideo && !isLoaded && (
        <div className="absolute bottom-6 left-6 z-30">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
            <span>Laden...</span>
          </div>
        </div>
      )}

      {/* Accessibility: Video description for screen readers */}
      <div className="sr-only">
        Video zeigt die authentische Zubereitung von Cevapcici und anderen Grill-Spezialitäten 
        in der Burgergrill-Küche. Köche bereiten frische Zutaten zu und grillen die Spezialitäten 
        für optimalen Geschmack.
      </div>
    </div>
  );
}