import React, { useState } from 'react';
import { IKImage, IKContext } from 'imagekitio-react';
import { IMAGEKIT_CONFIG } from '@/config/imageKit';
import { cn } from '@/lib/utils';
import { getLowQualityPlaceholder } from '@/utils/imageKitUtils';

interface ImageKitImageProps {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  loading?: 'lazy';
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const ImageKitImage: React.FC<ImageKitImageProps> = ({
  path,
  alt,
  width,
  height,
  className,
  quality = 80,
  format = 'auto',
  loading = 'lazy',
  onLoad,
  onError,
  priority = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError) {
    return (
      <div 
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <IKContext
      publicKey={IMAGEKIT_CONFIG.publicKey}
      urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
      transformationPosition={IMAGEKIT_CONFIG.transformationPosition}
    >
      <div className={cn("relative overflow-hidden", className)}>
        {/* Low quality placeholder */}
        {!imageLoaded && (
          <img
            src={getLowQualityPlaceholder(path)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
            aria-hidden="true"
          />
        )}
        
        {/* Main image */}
        <IKImage
          path={path}
          alt={alt}
          width={width?.toString()}
          height={height?.toString()}
          transformation={[
            {
              height: height?.toString(),
              width: width?.toString(),
              quality: quality,
              format: format === 'auto' ? undefined : format
            }
          ]}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </IKContext>
  );
};