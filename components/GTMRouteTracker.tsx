import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

const GTMRouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Ensure dataLayer exists
        window.dataLayer = window.dataLayer || [];

        // Push page_view event
        // We wrap this in a small timeout to ensure the title has potentially updated if handled by another effect,
        // though for simple SPAs often the title might be static or updated later.
        // Ideally, we just push the path.
        window.dataLayer.push({
            event: 'page_view',
            page_path: location.pathname + location.search,
            page_title: document.title
        });

    }, [location]);

    return null;
};

export default GTMRouteTracker;
