import React, { useState, useEffect, useMemo } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { getCloudinaryImages, imageCollections } from "../services/imageService";

export const ImageSlideshow = ({ images = imageCollections.slideshow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cloudinaryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cloudinaryImages.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .animate-zoom {
          animation: zoom 5s linear forwards;
        }
      `}</style>
      {cloudinaryImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <AdvancedImage
            cldImg={img}
            className="w-full h-full object-cover transition-transform duration-1000"
            style={{
              transform: index === currentIndex ? "scale(1)" : "scale(1.08)",
              animation: index === currentIndex ? "zoom 5s linear forwards" : "none",
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
};
