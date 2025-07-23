
import React from 'react';
import { ImageKitImage } from '@/components/ui/ImageKitImage';
import { convertCloudinaryToImageKit } from '@/utils/imageKitUtils';

interface ImageBlockPreviewProps {
  content: {
    imageUrl?: string;
    imageAlt?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    style?: any;
  };
}

const ImageBlockPreview: React.FC<ImageBlockPreviewProps> = ({ content }) => {
  const imageStyle = {
    width: content.width || '100%',
    height: content.height || 'auto',
    borderRadius: content.borderRadius || '0.5rem',
    ...content.style
  };

  return (
    <div className="text-center">
      {content.imageUrl ? (
        <ImageKitImage
          path={convertCloudinaryToImageKit(content.imageUrl)}
          alt={content.imageAlt || 'Imagem'}
          className="mx-auto"
          quality={85}
          format="auto"
        />
      ) : (
        <div className="bg-gray-100 h-48 flex items-center justify-center rounded-lg">
          <p className="text-gray-400">Selecione uma imagem</p>
        </div>
      )}
    </div>
  );
};

export default ImageBlockPreview;
