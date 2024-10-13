import axios from 'axios';

export async function getImageUrl(recipeUrl) {
    const cheerio = await import('cheerio'); // Use dynamic import
    const headers = {
        "User-Agent": "YourAppName/1.0 (ContactEmail@example.com)"
    };
    try {
        if (recipeUrl.includes('pinterest.com')) {
            return await getPinterestImageUrl(recipeUrl, cheerio, headers);
        }

        const response = await axios.get(recipeUrl, { headers });
        if (response.status !== 200) {
            console.log(`Failed to retrieve recipe page: HTTP ${response.status}`);
            return null;
        }

        const $ = cheerio.load(response.data);

        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) {
            return ogImage;
        }

        const scripts = $('script[type="application/ld+json"]');
        for (let i = 0; i < scripts.length; i++) {
            const jsonContent = $(scripts[i]).html().trim();
            try {
                const data = JSON.parse(jsonContent);
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                    if (item.image) {
                        return Array.isArray(item.image) ? item.image[0] : item.image;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        const contentImages = $('img');
        for (let i = 0; i < contentImages.length; i++) {
            const src = $(contentImages[i]).attr('src');
            if (src && !src.includes('default')) {
                return src;
            }
        }

        console.warn("Image URL not found in the recipe page.");
        return null;
    } catch (error) {
        console.error(`Error fetching image URL: ${error.message}`);
        return null;
    }
}

async function getPinterestImageUrl(url, cheerio, headers) {
    try {
        const response = await axios.get(url, { headers });
        if (response.status !== 200) {
            console.log(`Failed to retrieve Pinterest page: HTTP ${response.status}`);
            return null;
        }

        const $ = cheerio.load(response.data);

        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) {
            return ogImage;
        }

        const scripts = $('script[type="application/ld+json"]');
        for (let i = 0; i < scripts.length; i++) {
            const jsonContent = $(scripts[i]).html().trim();
            try {
                const data = JSON.parse(jsonContent);
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                    if (item.image) {
                        return Array.isArray(item.image) ? item.image[0] : item.image;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        const contentImages = $('img');
        for (let i = 0; i < contentImages.length; i++) {
            const src = $(contentImages[i]).attr('src');
            if (src && !src.includes('default')) {
                return src;
            }
        }

        console.warn("Image URL not found in the Pinterest page.");
        return null;
    } catch (error) {
        console.error(`Error fetching Pinterest image URL: ${error.message}`);
        return null;
    }
}