// Initialize API key
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

// Cache to store fetched images and avoid redundant API calls
const imageCache = new Map();

/**
 * Helper to fetch from Pexels API
 */
const fetchPexels = async (endpoint, params = {}) => {
    if (!API_KEY) {
        console.warn('Pexels API Key is missing');
        return null;
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Pexels API Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Pexels request failed:', error);
        throw error;
    }
};

/**
 * Search for destination images on Pexels
 * @param {string} destination - The city/destination name
 * @param {number} count - Number of images to fetch (default: 4)
 * @returns {Promise<Array>} Array of image objects with src and alt
 */
export const searchDestinationImages = async (destination, count = 4) => {
    // Check cache first
    const cacheKey = `${destination.toLowerCase()}-${count}`;
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    try {
        // Search for images related to the destination
        const query = `${destination} travel landmark cityscape`;
        const data = await fetchPexels('/search', {
            query,
            per_page: count,
            orientation: 'landscape'
        });

        if (data && data.photos && data.photos.length > 0) {
            const images = data.photos.map(photo => ({
                id: photo.id,
                src: photo.src.large2x, // High quality image
                srcMedium: photo.src.large, // Medium quality for mobile
                srcSmall: photo.src.medium, // Small for thumbnails
                alt: photo.alt || `${destination} travel destination`,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
                avgColor: photo.avg_color,
            }));

            // Cache the results
            imageCache.set(cacheKey, images);
            return images;
        }

        return [];
    } catch (error) {
        console.error('Error fetching images from Pexels:', error);
        // Return empty array on error for graceful degradation
        return [];
    }
};

/**
 * Search for day-specific destination images
 * @param {string} destination - The city/destination name
 * @param {number} dayNumber - The day number to get unique image
 * @param {string} searchQuery - Optional: Gemini-provided search query for this specific day
 * @returns {Promise<Object|null>} Single image object or null
 */
export const searchDayImage = async (destination, dayNumber = 1, searchQuery = null) => {
    // Create cache key
    const cacheKey = searchQuery 
        ? `${destination.toLowerCase()}-${searchQuery.toLowerCase()}`
        : `${destination.toLowerCase()}-day-${dayNumber}`;
    
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    try {
        let query;
        
        // Use Gemini-provided search query if available, otherwise fallback
        if (searchQuery) {
            query = searchQuery;
        } else {
            // Fallback queries if Gemini didn't provide one
            const fallbackQueries = [
                `${destination} famous landmark iconic building architecture`,
                `${destination} skyline cityscape sunset panorama`,
                `${destination} tourist attraction popular destination travel`,
                `${destination} street view urban city center downtown`,
                `${destination} aerial view bird eye city landscape`,
            ];
            const queryIndex = (dayNumber - 1) % fallbackQueries.length;
            query = fallbackQueries[queryIndex];
        }

        // Fetch high-quality images
        const data = await fetchPexels('/search', {
            query,
            per_page: 10,
            orientation: 'landscape'
        });

        if (data && data.photos && data.photos.length > 0) {
            // Use first result for Gemini queries (most relevant), or rotate for fallback
            const photoIndex = searchQuery ? 0 : ((dayNumber - 1) % data.photos.length);
            const photo = data.photos[photoIndex];
            
            const image = {
                id: photo.id,
                src: photo.src.large2x,
                srcMedium: photo.src.large,
                srcSmall: photo.src.medium,
                alt: photo.alt || `${destination} - ${searchQuery || 'cityscape'}`,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
                avgColor: photo.avg_color,
            };

            // Cache the result
            imageCache.set(cacheKey, image);
            return image;
        }

        return null;
    } catch (error) {
        console.error('Error fetching day image from Pexels:', error);
        return null;
    }
};

// Keep the old function for backward compatibility but mark as deprecated
export const searchActivityImage = searchDayImage;

/**
 * Clear the image cache
 */
export const clearImageCache = () => {
    imageCache.clear();
};

export default {
    searchDestinationImages,
    searchActivityImage,
    searchDayImage,
    clearImageCache,
};
