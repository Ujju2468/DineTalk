/**
 * resizeImageFile
 * ----------------
 * Client-side resize + compress for recipe photo uploads. The recipe image
 * is stored as a data URL directly on the Recipe document (no backend file
 * upload endpoint exists), so shrinking it before it ever gets that big is
 * what keeps documents — and page load — fast.
 *
 * Accepts files up to MAX_UPLOAD_BYTES (5MB) from the picker, then resizes
 * down to a sane max dimension and re-compresses as JPEG, backing off
 * quality automatically if the result is still large.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB — hard cap on what we'll even attempt to read
const DEFAULT_MAX_DIMENSION = 1600;              // px, longest side
const DEFAULT_TARGET_BYTES = 700 * 1024;         // aim to land under ~700KB after compression
const MIN_QUALITY = 0.45;

const dataUrlByteLength = (dataUrl) => {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
};

export function resizeImageFile(file, {
  maxDimension = DEFAULT_MAX_DIMENSION,
  targetBytes = DEFAULT_TARGET_BYTES,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided.'));
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    if (file.size > MAX_UPLOAD_BYTES) {
      return reject(new Error(`That image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please choose one under 5MB.`));
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      // Step quality down until we're under the target size (or hit the floor)
      let quality = 0.86;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      while (dataUrlByteLength(dataUrl) > targetBytes && quality > MIN_QUALITY) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve({
        dataUrl,
        width,
        height,
        bytes: dataUrlByteLength(dataUrl),
        originalBytes: file.size,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read that image — try a different file.'));
    };

    img.src = objectUrl;
  });
}
