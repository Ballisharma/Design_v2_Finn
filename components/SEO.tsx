import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'product' | 'article';
    structuredData?: object | object[];
    noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = 'https://jumplings.in/og-image.jpg', // Default OG image
    url,
    type = 'website',
    structuredData,
    noindex = false,
}) => {
    const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://jumplings.in');
    const siteName = 'Jumplings';

    // Ensure structured data is an array for consistent handling
    const structuredDataArray = structuredData
        ? Array.isArray(structuredData)
            ? structuredData
            : [structuredData]
        : [];

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Canonical URL */}
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph Tags (Facebook, LinkedIn) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@Jumplings" />
            <meta name="twitter:creator" content="@Jumplings" />

            {/* Additional SEO Meta Tags */}
            <meta name="author" content="Jumplings" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* Structured Data (JSON-LD) */}
            {structuredDataArray.map((data, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
