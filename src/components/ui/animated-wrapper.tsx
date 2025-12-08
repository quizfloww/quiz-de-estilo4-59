
import React from 'react';

// Extended animation types to support all AnimationConfig types
type AnimationType = 
  | 'fade' 
  | 'fade-in' 
  | 'scale' 
  | 'scale-in' 
  | 'slide-up' 
  | 'slide-down' 
  | 'bounce' 
  | 'pulse' 
  | 'none';

interface AnimatedWrapperProps {
  animation?: AnimationType;
  show: boolean;
  duration?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

const getAnimationClass = (animation: AnimationType): string => {
  switch (animation) {
    case 'fade':
    case 'fade-in':
      return 'animate-fade-in';
    case 'scale':
    case 'scale-in':
      return 'animate-scale-in';
    case 'slide-up':
      return 'animate-slide-up';
    case 'slide-down':
      return 'animate-slide-down';
    case 'bounce':
      return 'animate-bounce';
    case 'pulse':
      return 'animate-pulse';
    case 'none':
    default:
      return '';
  }
};

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  animation = 'fade',
  show,
  duration = 300,
  delay = 0,
  className = '',
  children
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setMounted(true), delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay]);

  if (!show || !mounted) return null;

  const animationClass = getAnimationClass(animation);

  return (
    <div 
      className={`${animationClass} ${className}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  style
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
