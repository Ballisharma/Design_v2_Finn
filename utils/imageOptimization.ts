/**
 * Image Optimization Utilities
 * Provides helpers for responsive images and lazy loading
 */

/**
 * Generate srcset for responsive images
 * Works with Unsplash or WordPress images
 */
export const generateSrcSet = (imageUrl: string, widths: number[] = [400, 800, 1200]): string => {
    // Check if it's an Unsplash image
    if (imageUrl.includes('unsplash.com')) {
        return widths
            .map(width => `${imageUrl}&w=${width} ${width}w`)
            .join(', ');
    }

    // Check if it's a WordPress image
    if (imageUrl.includes('jumplings.in') || imageUrl.includes('wp-content')) {
        // WordPress typically supports width parameter
        return widths
            .map(width => `${imageUrl}?w=${width} ${width}w`)
            .join(', ');
    }

    // For other CDNs, return original
    return `${imageUrl} 1200w`;
};

/**
 * Generate sizes attribute for responsive images
 */
export const getResponsiveSizes = (type: 'hero' | 'product' | 'thumbnail' | 'full'): string => {
    const sizesMap = {
        hero: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw',
        product: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
        thumbnail: '(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px',
        full: '100vw'
    };

    return sizesMap[type] || '100vw';
};

/**
 * Optimize image URL for specific width
 */
export const optimizeImageUrl = (url: string, width: number): string => {
    if (url.includes('unsplash.com')) {
        // Add Unsplash optimization parameters
        const hasQuery = url.includes('?');
        return `${url}${hasQuery ? '&' : '?'}w=${width}&auto=format&fit=crop&q=80`;
    }

    if (url.includes('jumplings.in') || url.includes('wp-content')) {
        return `${url}?w=${width}`;
    }

    return url;
};

/**
 * Check if browser supports WebP
 */
export const supportsWebP = (() => {
    if (typeof window === 'undefined') return false;

    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
})();

/**
 * Get optimal image format
 */
export const getImageFormat = (url: string): string => {
    if (supportsWebP && url.includes('unsplash.com')) {
        return `${url}&fm=webp`;
    }
    return url;
};

/**
 * Preload critical images
 */
export const preloadImage = (url: string, type: 'image' | 'fetch' = 'image'): void => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Image component props helper
 */
export interface OptimizedImageProps {
    src: string;
    alt: string;
    type?: 'hero' | 'product' | 'thumbnail' | 'full';
    eager?: boolean; // Load immediately without lazy loading
    className?: string;
}

export interface ImageOptimizationOptions {
    priority?: boolean; // Set fetchPriority to high
    sizes?: string; // Custom sizes attribute
    type?: 'hero' | 'product' | 'thumbnail' | 'full';
    className?: string;
}

/**
 * Get optimized image props - supports two signatures:
 * 1. Object style: getOptimizedImageProps({ src, alt, type, eager })
 * 2. Function style: getOptimizedImageProps(src, alt, options)
 */
export function getOptimizedImageProps(props: OptimizedImageProps): any;
export function getOptimizedImageProps(src: string, alt: string, options?: ImageOptimizationOptions): any;
export function getOptimizedImageProps(
    srcOrProps: string | OptimizedImageProps,
    alt?: string,
    options?: ImageOptimizationOptions
): any {
    // Determine which signature was used
    const isObjectStyle = typeof srcOrProps === 'object';

    const src = isObjectStyle ? srcOrProps.src : srcOrProps;
    const altText = isObjectStyle ? srcOrProps.alt : alt!;
    const eager = isObjectStyle ? (srcOrProps.eager ?? false) : (options?.priority ?? false);
    const customSizes = isObjectStyle ? undefined : options?.sizes;
    const type = isObjectStyle ? (srcOrProps.type ?? 'product') : (options?.type ?? 'product');
    const className = isObjectStyle ? (srcOrProps.className ?? '') : (options?.className ?? '');

    const srcSet = generateSrcSet(src);
    const sizes = customSizes || getResponsiveSizes(type);
    const optimizedSrc = getImageFormat(src);

    return {
        src: optimizedSrc,
        srcSet,
        sizes,
        alt: altText,
        loading: eager ? ('eager' as const) : ('lazy' as const),
        decoding: 'async' as const,
        ...(className && { className }),
        ...(eager && { fetchPriority: 'high' as const })
    };
}

export default {
    generateSrcSet,
    getResponsiveSizes,
    optimizeImageUrl,
    getImageFormat,
    preloadImage,
    getOptimizedImageProps,
    supportsWebP
};
