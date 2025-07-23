import { IMAGEKIT_CONFIG, IMAGEKIT_DEFAULTS } from '@/config/imageKit';

interface ImageKitTransformation {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  focus?: 'auto' | 'face' | 'center';
  progressive?: boolean;
}

/**
 * Optimizes ImageKit URL with transformations
 * @param path Image path on ImageKit
 * @param options Transformation options
 * @returns Optimized ImageKit URL
 */
export const optimizeImageKitUrl = (path: string, options: ImageKitTransformation = {}): string => {
  if (!path) return '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const transformations: string[] = [];
  
  // Add transformations
  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.format && options.format !== 'auto') transformations.push(`f-${options.format}`);
  if (options.crop) transformations.push(`c-${options.crop}`);
  if (options.focus) transformations.push(`fo-${options.focus}`);
  if (options.progressive) transformations.push('pr-true');
  
  // Build URL
  const baseUrl = IMAGEKIT_CONFIG.urlEndpoint;
  if (transformations.length === 0) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  const transformationString = transformations.join(',');
  return `${baseUrl}/tr:${transformationString}/${cleanPath}`;
};

/**
 * Generates responsive ImageKit sources
 * @param path Image path
 * @param sizes Array of widths
 * @returns Object with srcSet and sizes
 */
export const getResponsiveImageKitSources = (
  path: string, 
  sizes: number[] = [320, 640, 960, 1280]
): { srcSet: string; sizes: string } => {
  const srcSet = sizes
    .map(size => `${optimizeImageKitUrl(path, { width: size, quality: IMAGEKIT_DEFAULTS.quality })} ${size}w`)
    .join(', ');
  
  const sizesAttr = sizes
    .map((size, index) => {
      if (index === sizes.length - 1) return `${size}px`;
      return `(max-width: ${size}px) ${size}px`;
    })
    .join(', ');
  
  return { srcSet, sizes: sizesAttr };
};

/**
 * Generates low quality placeholder
 * @param path Image path
 * @param options Placeholder options
 * @returns Low quality placeholder URL
 */
export const getLowQualityPlaceholder = (
  path: string, 
  options: { width?: number; quality?: number } = {}
): string => {
  return optimizeImageKitUrl(path, {
    width: options.width || 30,
    quality: options.quality || 10,
    format: 'auto'
  });
};

/**
 * Preloads ImageKit images
 * @param paths Array of image paths
 * @param options Preload options
 */
export const preloadImageKitImages = async (
  paths: string[], 
  options: { quality?: number; batchSize?: number } = {}
): Promise<void> => {
  const { quality = IMAGEKIT_DEFAULTS.quality, batchSize = 3 } = options;
  
  const preloadBatch = async (batch: string[]) => {
    const promises = batch.map(path => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload: ${path}`));
        img.src = optimizeImageKitUrl(path, { quality });
      });
    });
    
    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  };
  
  // Process in batches
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    await preloadBatch(batch);
  }
};

/**
 * Converts Cloudinary URL to ImageKit path
 * @param cloudinaryUrl Full Cloudinary URL
 * @returns ImageKit path or original URL if not Cloudinary
 */
export const convertCloudinaryToImageKit = (cloudinaryUrl: string): string => {
  if (!cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }
  
  // Extract filename from Cloudinary URL
  const urlParts = cloudinaryUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  
  // Remove any Cloudinary transformations and get clean filename
  const cleanFilename = filename.split('?')[0];
  
  return cleanFilename;
};