// Image Optimization - Sistema de otimização automática de imagens
// Adiciona query parameters de otimização para Cloudinary

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?:
    | "auto"
    | "auto:best"
    | "auto:good"
    | "auto:eco"
    | "auto:low"
    | number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
  gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  dpr?: 1 | 2 | 3 | "auto";
  fetchPriority?: "high" | "low" | "auto";
  lazy?: boolean;
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  quality: "auto:best",
  format: "auto",
  dpr: "auto",
  lazy: true,
};

/**
 * Detecta se a URL é do Cloudinary
 */
function isCloudinaryUrl(url: string): boolean {
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
}

/**
 * Otimiza URL de imagem adicionando query parameters
 *
 * Exemplos:
 * - optimizeImageUrl(url, { width: 400 }) → url?w=400&q=auto:best&f=auto
 * - optimizeImageUrl(url, { quality: 80, format: 'webp' }) → url?q=80&f=webp
 */
export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) return "";

  // Se a URL já tem transformações Cloudinary complexas, não modificar
  if (url.includes("/upload/") && /\/upload\/[^\/]+\//.test(url)) {
    return url;
  }

  // Merge com opções padrão
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Se for Cloudinary, usar transformações nativas
  if (isCloudinaryUrl(url)) {
    return optimizeCloudinaryUrl(url, opts);
  }

  // Para outras CDNs, usar query parameters genéricos
  return optimizeGenericUrl(url, opts);
}

/**
 * Otimização específica para Cloudinary
 * Usa transformações na URL path em vez de query params
 */
function optimizeCloudinaryUrl(
  url: string,
  options: ImageOptimizationOptions
): string {
  // Cloudinary usa formato: /upload/w_400,q_auto,f_auto/image.jpg

  const transformations: string[] = [];

  if (options.width) {
    transformations.push(`w_${options.width}`);
  }

  if (options.height) {
    transformations.push(`h_${options.height}`);
  }

  if (options.quality) {
    const q =
      typeof options.quality === "number"
        ? options.quality
        : options.quality.replace(":", "_");
    transformations.push(`q_${q}`);
  }

  if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  if (options.gravity) {
    transformations.push(`g_${options.gravity}`);
  }

  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  }

  // Se não há transformações a adicionar, retornar URL original
  if (transformations.length === 0) {
    return url;
  }

  // Se já tem transformações na URL, não duplicar
  if (url.includes("/upload/") && !url.match(/\/upload\/v\d+/)) {
    const transform = transformations.join(",");
    // Evitar duplicação verificando se já existe a pasta upload
    if (url.match(/\/upload\/[^/]+\//)) {
      return url; // Já tem transformações, não modificar
    }
    return url.replace("/upload/", `/upload/${transform}/`);
  }

  // Para URLs com versão (v123456)
  if (url.includes("/upload/v") && url.match(/\/upload\/v\d+/)) {
    const transform = transformations.join(",");
    return url.replace(/\/upload\/(v\d+)\//, `/upload/${transform}/$1/`);
  }

  return url;
}

/**
 * Otimização genérica usando query parameters
 */
function optimizeGenericUrl(
  url: string,
  options: ImageOptimizationOptions
): string {
  const params = new URLSearchParams();

  if (options.width) params.append("w", options.width.toString());
  if (options.height) params.append("h", options.height.toString());
  if (options.quality) {
    const q =
      typeof options.quality === "number"
        ? options.quality.toString()
        : options.quality;
    params.append("q", q);
  }
  if (options.format) params.append("f", options.format);

  const queryString = params.toString();
  if (!queryString) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${queryString}`;
}

/**
 * Gera srcset para imagens responsivas
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map((w) => `${optimizeImageUrl(url, { width: w })} ${w}w`)
    .join(", ");
}

/**
 * Determina tamanho ideal baseado no contexto
 */
export function getOptimalSize(
  context: "mobile" | "tablet" | "desktop"
): number {
  const sizes = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  };
  return sizes[context];
}

/**
 * Preload de imagem crítica
 */
export function preloadImage(
  url: string,
  options?: ImageOptimizationOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedUrl = optimizeImageUrl(url, options);

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
    img.src = optimizedUrl;
  });
}

/**
 * Preload de múltiplas imagens
 */
export async function preloadImages(
  urls: string[],
  options?: ImageOptimizationOptions
): Promise<void> {
  await Promise.all(urls.map((url) => preloadImage(url, options)));
}

/**
 * Gera props otimizados para tag <img>
 */
export function getOptimizedImageProps(
  url: string,
  options: ImageOptimizationOptions & {
    alt?: string;
    sizes?: string;
  } = {}
): {
  src: string;
  srcSet?: string;
  alt: string;
  loading: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
} {
  const {
    alt = "",
    sizes,
    lazy = true,
    fetchPriority,
    width,
    height,
    ...optimizeOpts
  } = options;

  return {
    src: optimizeImageUrl(url, optimizeOpts),
    srcSet: sizes ? generateSrcSet(url) : undefined,
    alt,
    loading: lazy ? "lazy" : "eager",
    fetchPriority,
    width,
    height,
  };
}

/**
 * Calcula aspect ratio de uma imagem
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Dimensões recomendadas por tipo de bloco
 */
export const RECOMMENDED_SIZES = {
  logo: { width: 200, height: 80 },
  styleImage: { width: 238, height: 400 },
  guideImage: { width: 540, height: 720 },
  guideImageThumbnail: { width: 80, height: 107 },
  beforeAfter: { width: 400, height: 600 },
  testimonialAvatar: { width: 80, height: 80 },
  bonusImage: { width: 300, height: 400 },
  mentorImage: { width: 400, height: 500 },
  heroImage: { width: 1200, height: 800 },
} as const;

/**
 * Otimiza imagem baseado no tipo de bloco
 */
export function optimizeByBlockType(
  url: string,
  blockType: keyof typeof RECOMMENDED_SIZES,
  quality: ImageOptimizationOptions["quality"] = "auto:best"
): string {
  const size = RECOMMENDED_SIZES[blockType];
  return optimizeImageUrl(url, {
    width: size.width,
    quality,
    format: "auto",
  });
}
