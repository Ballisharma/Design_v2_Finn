#!/usr/bin/env tsx
/**
 * Dynamic Sitemap Generator for Jumplings
 * 
 * This script fetches all products from the WooCommerce backend
 * and generates an updated sitemap.xml including product pages.
 * 
 * Usage: npm run generate:sitemap
 */

import * as fs from 'fs';
import * as path from 'path';

const WORDPRESS_URL = process.env.VITE_WORDPRESS_URL || 'https://jumplings.in';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

interface Product {
    id: string;
    slug: string;
    modified?: string;
}

// Static routes with priorities
const staticRoutes = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/shop', priority: 0.9, changefreq: 'weekly' },
    { loc: '/grip-socks', priority: 0.8, changefreq: 'weekly' },
    { loc: '/yoga-grip-socks', priority: 0.8, changefreq: 'weekly' },
    { loc: '/sea-urchin-lamp', priority: 0.8, changefreq: 'weekly' },
    { loc: '/sea-urchin-lamp-v2', priority: 0.7, changefreq: 'weekly' },
    { loc: '/sea-urchin-beast', priority: 0.7, changefreq: 'weekly' },
    { loc: '/yoga-socks-social', priority: 0.7, changefreq: 'weekly' },
    { loc: '/about', priority: 0.5, changefreq: 'monthly' },
    { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
    { loc: '/shipping', priority: 0.4, changefreq: 'monthly' },
    { loc: '/returns', priority: 0.4, changefreq: 'monthly' },
    { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { loc: '/terms', priority: 0.3, changefreq: 'yearly' },
];

async function fetchProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100`, {
            headers: {
                'Authorization': 'Basic Y2tfNzE3ZGIzZjJkYjY5OWViM2M4Yjc3NDI1ZTI4Y2NiNzE2ZDM2NjFmMzpjc19iNTM2NTc4MzgxMTEyYmY3YmUwNTgxZWVhYWQwM2QzZjZkOTYzNTIz'
            }
        });

        if (!response.ok) {
            console.warn('Failed to fetch products from WooCommerce, using static routes only');
            return [];
        }

        const products = await response.json();
        return products.map((p: any) => ({
            id: p.id.toString(),
            slug: p.slug,
            modified: p.modified || new Date().toISOString(),
        }));
    } catch (error) {
        console.warn('Error fetching products:', error);
        return [];
    }
}

function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function generateSitemap(products: Product[]): string {
    const baseUrl = 'https://jumplings.in';
    const today = formatDate(new Date());

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

    // Add static routes
    staticRoutes.forEach(route => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${route.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += '  </url>\n\n';
    });

    // Add product routes
    if (products.length > 0) {
        xml += '  <!-- Product Pages -->\n';
        products.forEach(product => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
            xml += `    <lastmod>${formatDate(product.modified || today)}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += '  </url>\n\n';
        });
    }

    xml += '</urlset>\n';
    return xml;
}

async function main() {
    console.log('🗺️  Generating sitemap...');

    // Fetch products
    console.log('📦 Fetching products from WooCommerce...');
    const products = await fetchProducts();
    console.log(`✓ Found ${products.length} products`);

    // Generate sitemap
    const sitemap = generateSitemap(products);

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    console.log(`✓ Sitemap generated successfully at ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${staticRoutes.length + products.length}`);
}

main().catch(err => {
    console.error('❌ Error generating sitemap:', err);
    process.exit(1);
});
