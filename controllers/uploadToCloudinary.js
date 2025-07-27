import cloudinary from '../config/cloudinary.js';

/**
 * Upload a raw image buffer (from multer) to Cloudinary without transformation.
 * @param {Buffer} buffer - Raw image buffer.
 * @param {string} folder - Cloudinary folder to store the image.
 * @returns {Promise<string>} - Secure URL of uploaded image.
 */
export const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      console.error('❌ Invalid buffer passed to uploadToCloudinary');
      return reject(new Error('Invalid buffer'));
    }

    if (!folder || typeof folder !== 'string') {
      console.error('❌ Invalid folder name provided to uploadToCloudinary');
      return reject(new Error('Invalid folder name'));
    }

    console.log('🔄 Starting Cloudinary upload...');
    console.log('📁 Target folder:', folder);

    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary Upload Error:', error);
            return reject(new Error(`Upload failed: ${error.message}`));
          }

          if (!result?.secure_url) {
            console.error('❌ Upload failed: No secure_url in Cloudinary response');
            return reject(new Error('Upload failed: No URL returned'));
          }

          console.log('✅ Upload successful. URL:', result.secure_url);
          resolve(result.secure_url);
        }
      );

      stream.end(buffer);
    } catch (err) {
      console.error('❌ Exception during Cloudinary upload:', err);
      reject(new Error('Unexpected error during Cloudinary upload'));
    }
  });
};
