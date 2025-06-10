import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: "dw9xqq4hi",
  },
});

// Default image transformations
const defaultTransformations = {
  width: 1600,
  height: 900,
};

/**
 * Get a Cloudinary image with specified transformations
 * @param {string} publicId - The Cloudinary public ID of the image
 * @param {Object} options - Optional transformations
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @returns {Object} Cloudinary image object
 */
export const getCloudinaryImage = (publicId, options = {}) => {
  const img = cld.image(publicId);
  const {
    width = defaultTransformations.width,
    height = defaultTransformations.height,
  } = options;

  img.resize(fill().width(width).height(height));
  return img;
};

/**
 * Get multiple Cloudinary images with specified transformations
 * @param {string[]} publicIds - Array of Cloudinary public IDs
 * @param {Object} options - Optional transformations
 * @returns {Object[]} Array of Cloudinary image objects
 */
export const getCloudinaryImages = (publicIds, options = {}) => {
  return publicIds.map((publicId) => getCloudinaryImage(publicId, options));
};

// Predefined image collections
export const imageCollections = {
  slideshow: ["s3_llejwe", "s2_pltl26", "s4_xucptc", "s1_lkwtie"],
  icons: {
    google: "google_h79wym",
  },
};
