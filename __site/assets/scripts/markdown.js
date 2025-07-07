// This script loads a markdown file and converts it to HTML using the marked library.

import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

export async function loadMarkdown(file) {
    try {
        const response = await fetch(file);
        const data = await response.text();

        // Parse markdown to HTML
        let htmlContent = marked.parse(data);

        // Ensure image links are converted to <img> tags
        htmlContent = htmlContent.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, (match, url, altText) => {
            if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return `<img src="${url}" alt="${altText}" />`;
            }
            return match; // Keep other links unchanged
        });

        return htmlContent;
    } catch (error) {
        console.error('Error loading markdown file:', error);
    }
}

export function parseMarkdown(markdown)
{
    return marked.parse(markdown);
}