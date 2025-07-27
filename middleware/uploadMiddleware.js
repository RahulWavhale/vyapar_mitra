// upload.js
import multer from 'multer';
import sharp from 'sharp';

/**
 * Memory storage for multer to handle image uploads in memory
 */
const storage = multer.memoryStorage();

/**
 * Multer middleware for handling multipart/form-data
 * Accepts any file for now (can filter by mimetype if needed)
 */
export const upload = multer({
  storage,
  // Optional: add file filter to accept only image files
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only image files are allowed!'), false);
  //   }
  // },
});

/**
 * Compress and resize image using Sharp.
 *
 * @param {Buffer} buffer - The image buffer from multer.
 * @param {Object} options - Optional compression settings.
 * @param {number} options.width - Resize width in pixels (default: 800).
 * @param {number} options.quality - JPEG quality (default: 70).
 * @returns {Promise<Buffer>} - Compressed image buffer.
 */
export const compressImage = async (buffer, options = {}) => {
  const { width = 800, quality = 70 } = options;

  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer provided to compressImage');
  }

  try {
    return await sharp(buffer)
      .resize({ width, withoutEnlargement: true }) // Prevent upscaling
      .jpeg({ quality }) // Convert to JPEG and compress
      .toBuffer();
  } catch (error) {
    console.error('❌ Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};
