import React, { useState, useEffect, useMemo } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";

const images = [
  "pexels-pixabay-259588_z6o2v9",
  "pexels-pixasquare-1115804_ntadqq",
  "pexels-binyaminmellish-106399_qnas3c",
  "pexels-frans-van-heerden-201846-1438832_rbsijk",
  "pexels-pixabay-358636_p4jgdj",
  "pexels-davidmcbee-1546166_nq2yim",
];

// Dynamically import all images from the stock_images folder
const imageModules = import.meta.glob(
  "/src/assets/stock_images/*.{jpg,png,jpeg}",
  { eager: true }
);

export const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dw9xqq4hi",
    },
  });

  const cloudinaryImages = useMemo(() => {
    return images.map((publicId) => {
      const img = cld.image(publicId);
      img.resize(fill().width(1600).height(900))
      return img;
    })
  }, [cld])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cloudinaryImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [cloudinaryImages.length])
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
              animation:
                index === currentIndex ? "zoom 5s linear forwards" : "none",
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
};