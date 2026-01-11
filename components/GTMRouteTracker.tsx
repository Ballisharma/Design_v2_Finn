import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

const GTMRouteTracker = () => {
    const location = useLocation();
    const previousPathRef = useRef<string>('');

    useEffect(() => {
        // Ensure dataLayer exists
        window.dataLayer = window.dataLayer || [];

        // Helper function to generate page name from pathname
        const getPageName = (pathname: string): string => {
            if (pathname === '/') return 'Home';

            // Remove leading/trailing slashes and split by dash or slash
            const segments = pathname.replace(/^\/|\/$/g, '').split('/');
            const lastSegment = segments[segments.length - 1];

            // Convert kebab-case to Title Case
            return lastSegment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // Helper function to push to dataLayer
        const pushPageView = () => {
            const pageData = {
                event: 'page_view',
                page_path: location.pathname + location.search,
                page_title: document.title,
                page_name: getPageName(location.pathname),
                page_location: window.location.href
            };

            window.dataLayer.push(pageData);

            // Log for debugging (can be removed in production)
            console.log('GTM Page View:', pageData);
        };

        // Only track if pathname actually changed (not just query params on same page)
        const currentPath = location.pathname;
        if (currentPath === previousPathRef.current) {
            return;
        }
        previousPathRef.current = currentPath;

        // Strategy: Use a small timeout to allow react-helmet-async to update the title
        // Also set up a MutationObserver as a fallback to catch the title change
        let timeoutId: NodeJS.Timeout;
        let observer: MutationObserver | null = null;
        let hasFired = false;

        // Setup MutationObserver to watch for title changes
        const titleElement = document.querySelector('title');
        if (titleElement) {
            observer = new MutationObserver(() => {
                if (!hasFired) {
                    hasFired = true;
                    clearTimeout(timeoutId);
                    pushPageView();
                    observer?.disconnect();
                }
            });

            observer.observe(titleElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        // Fallback timeout in case MutationObserver doesn't fire
        // 150ms is enough for react-helmet-async to update in most cases
        timeoutId = setTimeout(() => {
            if (!hasFired) {
                hasFired = true;
                pushPageView();
                observer?.disconnect();
            }
        }, 150);

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            observer?.disconnect();
        };

    }, [location]);

    return null;
};

export default GTMRouteTracker;
