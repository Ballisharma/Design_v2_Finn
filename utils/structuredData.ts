// Structured Data (Schema.org JSON-LD) Generators

export const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jumplings',
    url: 'https://jumplings.in',
    logo: 'https://jumplings.in/logo.png',
    description: 'Premium funky socks and accessories. Made in India with organic materials.',
    foundingDate: '2025',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'hello@jumplings.in',
        availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
        'https://www.facebook.com/jumplings',
        'https://www.instagram.com/jumplings',
        'https://www.linkedin.com/company/jumplings',
    ],
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'New Delhi',
        addressCountry: 'IN',
    },
});

export const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jumplings',
    url: 'https://jumplings.in',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jumplings.in/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});

interface ProductData {
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    image: string;
    category: string;
    brand?: string;
    sku?: string;
    stock?: number;
    rating?: number;
    reviewCount?: number;
}

export const generateProductSchema = (product: ProductData) => {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'Jumplings',
        },
        category: product.category,
        offers: {
            '@type': 'Offer',
            priceCurrency: product.currency || 'INR',
            price: product.price,
            availability:
                product.stock && product.stock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            url: `https://jumplings.in/product/${product.id}`,
            seller: {
                '@type': 'Organization',
                name: 'Jumplings',
            },
        },
    };

    // Add SKU if available
    if (product.sku) {
        schema.sku = product.sku;
    }

    // Add aggregate rating if available
    if (product.rating && product.reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
        };
    }

    return schema;
};

export const generateCollectionPageSchema = (name: string, description: string, url: string) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    url: url,
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
});
