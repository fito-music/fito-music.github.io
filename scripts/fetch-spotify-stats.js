/**
 * Fetch Spotify Artist Stats
 * 
 * This script fetches artist statistics from Spotify API
 * and saves them to data/stats.json
 * 
 * Required environment variables:
 * - SPOTIFY_CLIENT_ID
 * - SPOTIFY_CLIENT_SECRET
 */

const fs = require('fs');
const path = require('path');

// Fito's Spotify Artist ID
const ARTIST_ID = '49VK62ooP7k2DFtFg5Q4id';

async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function getArtistStats(accessToken) {
    // Fetch artist info
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!artistResponse.ok) {
        throw new Error(`Failed to fetch artist: ${artistResponse.status}`);
    }

    const artist = await artistResponse.json();

    // Fetch artist albums to count releases
    const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&limit=50`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!albumsResponse.ok) {
        throw new Error(`Failed to fetch albums: ${albumsResponse.status}`);
    }

    const albums = await albumsResponse.json();

    return {
        monthlyListeners: artist.followers.total, // Note: This is followers, not monthly listeners (API limitation)
        followers: artist.followers.total,
        releases: albums.total,
        popularity: artist.popularity,
        lastUpdated: new Date().toISOString()
    };
}

async function main() {
    console.log('🎵 Fetching Spotify stats for Fito...');

    try {
        const accessToken = await getAccessToken();
        console.log('✅ Got access token');

        const stats = await getArtistStats(accessToken);
        console.log('✅ Fetched artist stats:', stats);

        // Ensure data directory exists
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Write stats to JSON file
        const statsPath = path.join(dataDir, 'stats.json');
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
        console.log('✅ Saved stats to data/stats.json');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
