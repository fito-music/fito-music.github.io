/**
 * Fetch Spotify Artist Stats via Web Scraping
 * 
 * This script scrapes the public Spotify artist page
 * No API keys required!
 */

const fs = require('fs');
const path = require('path');

// Fito's Spotify Artist ID
const ARTIST_ID = '49VK62ooP7k2DFtFg5Q4id';
const ARTIST_URL = `https://open.spotify.com/artist/${ARTIST_ID}`;

async function scrapeSpotifyArtist() {
    console.log('🎵 Scraping Spotify page for Fito...');

    try {
        // Fetch the artist page HTML
        const response = await fetch(ARTIST_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`);
        }

        const html = await response.text();

        // Extract monthly listeners from the page
        // Spotify embeds this in the HTML as "X monthly listeners"
        const listenersMatch = html.match(/(\d[\d,\.]*)\s*monthly listener/i);
        const monthlyListeners = listenersMatch
            ? parseInt(listenersMatch[1].replace(/[,\.]/g, ''))
            : null;

        // Try to extract from meta tags or JSON-LD if available
        const descMatch = html.match(/content="([^"]*monthly listener[^"]*)"/i);

        console.log('✅ Page fetched successfully');
        if (monthlyListeners) {
            console.log(`📊 Monthly Listeners: ${monthlyListeners}`);
        }

        // Read existing stats to preserve any values we can't scrape
        let existingStats = {
            monthlyListeners: 121,
            followers: 44,
            releases: 3
        };

        const statsPath = path.join(__dirname, '..', 'data', 'stats.json');
        if (fs.existsSync(statsPath)) {
            existingStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        }

        // Update with scraped data
        const stats = {
            ...existingStats,
            monthlyListeners: monthlyListeners || existingStats.monthlyListeners,
            lastUpdated: new Date().toISOString()
        };

        // Ensure data directory exists
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Write stats to JSON file
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
        console.log('✅ Saved stats to data/stats.json');
        console.log('📊 Final stats:', stats);

    } catch (error) {
        console.error('❌ Error:', error.message);
        // Don't fail the workflow - keep existing stats
        console.log('⚠️ Keeping existing stats');
    }
}

scrapeSpotifyArtist();
