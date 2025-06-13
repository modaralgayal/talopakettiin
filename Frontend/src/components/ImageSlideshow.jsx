import React, { useState, useEffect, useMemo } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { getCloudinaryImages, imageCollections } from "../services/imageService";

export const ImageSlideshow = ({ images = imageCollections.slideshow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get images based on dynamic window size
  const cloudinaryImages = useMemo(() => {
    return getCloudinaryImages(images, {
      width: windowSize.width,
      height: windowSize.height,
    });
  }, [images, windowSize]);

  // Slideshow timer with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cloudinaryImages.length);
        setIsTransitioning(false);
      }, 1000); // Match this with the transition duration
    }, 6000); // Increased to 6 seconds for better viewing experience
    return () => clearInterval(timer);
  }, [cloudinaryImages.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-zoom {
          animation: zoom 6s ease-out forwards;
        }
        .image-overlay {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }
      `}</style>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 image-overlay z-10" />
      
      {cloudinaryImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? "opacity-100 transform scale-100" 
              : "opacity-0 transform scale-105"
          }`}
        >
          <AdvancedImage
            cldImg={img}
            className="w-full h-full object-cover"
            style={{
              transform: index === currentIndex ? "scale(1)" : "scale(1.1)",
              animation: index === currentIndex ? "zoom 6s ease-out forwards" : "none",
              willChange: "transform, opacity",
            }}
          />
        </div>
      ))}
    </div>
  );
};
