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

/**
 * Get optimized image props
 */
export const getOptimizedImageProps = ({
    src,
    alt,
    type = 'product',
    eager = false,
    className = ''
}: OptimizedImageProps) => {
    const srcSet = generateSrcSet(src);
    const sizes = getResponsiveSizes(type);
    const optimizedSrc = getImageFormat(src);

    return {
        src: optimizedSrc,
        srcSet,
        sizes,
        alt,
        loading: eager ? ('eager' as const) : ('lazy' as const),
        decoding: 'async' as const,
        className,
        ...(eager && { fetchPriority: 'high' as const })
    };
};

export default {
    generateSrcSet,
    getResponsiveSizes,
    optimizeImageUrl,
    getImageFormat,
    preloadImage,
    getOptimizedImageProps,
    supportsWebP
};
