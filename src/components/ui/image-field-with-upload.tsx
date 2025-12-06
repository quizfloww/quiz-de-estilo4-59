import React, { useRef, useState, useId } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFieldWithUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  thumbnailSize?: "sm" | "md" | "lg";
}

export const ImageFieldWithUpload: React.FC<ImageFieldWithUploadProps> = ({
  label = "URL da Imagem",
  value,
  onChange,
  placeholder = "https://...",
  className,
  thumbnailSize = "md",
}) => {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const thumbnailHeight = {
    sm: "h-16",
    md: "h-24",
    lg: "h-32",
  }[thumbnailSize];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImageError(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      {/* Thumbnail com preview */}
      <div
        onClick={handleThumbnailClick}
        className={cn(
          "relative w-full rounded-md border-2 border-dashed cursor-pointer transition-all overflow-hidden",
          "hover:border-primary hover:bg-muted/30",
          value && !imageError
            ? "border-muted bg-muted/10"
            : "border-muted-foreground/25",
          thumbnailHeight
        )}
      >
        {value && !imageError ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8"
                onClick={handleThumbnailClick}
              >
                <Upload className="w-4 h-4 mr-1" />
                Trocar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={handleRemoveImage}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ImagePlus className="w-6 h-6 mb-1" />
            <span className="text-xs">
              {isUploading ? "Carregando..." : "Clique para upload"}
            </span>
          </div>
        )}
      </div>

      {/* Input de URL */}
      <div className="flex gap-2">
        <Input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setImageError(false);
          }}
          placeholder={placeholder}
          className="flex-1 text-xs"
        />
      </div>

      {/* Input de arquivo escondido */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageFieldWithUpload;
