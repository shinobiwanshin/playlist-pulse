import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  track: {
    id: string;
    name: string;
    duration_ms: number;
    popularity: number;
    explicit: boolean;
    artists: Array<{ id: string; name: string }>;
    album: {
      id: string;
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
      release_date: string;
    };
  };
  added_at: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  owner: { display_name: string; id: string };
  followers: { total: number };
  tracks: {
    total: number;
    items: SpotifyTrack[];
  };
}

interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
}

// Get Spotify access token using client credentials flow
async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  console.log('Fetching Spotify access token...');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get Spotify token:', error);
    throw new Error(`Failed to get Spotify access token: ${error}`);
  }

  const data: SpotifyToken = await response.json();
  console.log('Successfully obtained Spotify access token');
  return data.access_token;
}

// Extract playlist ID from URL or return as-is if already an ID
function extractPlaylistId(input: string): string {
  // Handle various URL formats
  const urlPatterns = [
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    /spotify:playlist:([a-zA-Z0-9]+)/,
  ];

  for (const pattern of urlPatterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // Assume it's already an ID
  return input.split('?')[0]; // Remove query parameters if any
}

// Fetch playlist data from Spotify
async function fetchPlaylist(accessToken: string, playlistId: string): Promise<SpotifyPlaylist> {
  console.log(`Fetching playlist: ${playlistId}`);

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=id,name,description,images,owner,followers,tracks(total,items(added_at,track(id,name,duration_ms,popularity,explicit,artists(id,name),album(id,name,images,release_date))))`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to fetch playlist:', error);
    
    if (response.status === 404) {
      throw new Error('Playlist not found. Make sure the playlist is public and the URL is correct.');
    } else if (response.status === 403) {
      throw new Error('Access denied. This playlist may be private or region-restricted.');
    }
    
    throw new Error(`Failed to fetch playlist: ${response.status}`);
  }

  return response.json();
}

// Fetch audio features for tracks
async function fetchAudioFeatures(accessToken: string, trackIds: string[]): Promise<AudioFeatures[]> {
  if (trackIds.length === 0) return [];

  // Spotify API allows max 100 IDs per request
  const batches = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    batches.push(trackIds.slice(i, i + 100));
  }

  const allFeatures: AudioFeatures[] = [];

  for (const batch of batches) {
    console.log(`Fetching audio features for ${batch.length} tracks...`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${batch.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      allFeatures.push(...(data.audio_features?.filter(Boolean) || []));
    } else {
      console.warn('Failed to fetch some audio features');
    }
  }

  return allFeatures;
}

// Fetch artist details including images and genres
async function fetchArtists(accessToken: string, artistIds: string[]): Promise<{ images: Map<string, string>; genres: string[] }> {
  const artistImages = new Map<string, string>();
  const allGenres: string[] = [];
  
  if (artistIds.length === 0) return { images: artistImages, genres: allGenres };

  // Spotify API allows max 50 artist IDs per request
  const batches = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    batches.push(artistIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    console.log(`Fetching artist details for ${batch.length} artists...`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${batch.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      data.artists?.forEach((artist: any) => {
        if (artist?.id && artist?.images?.[0]?.url) {
          artistImages.set(artist.id, artist.images[0].url);
        }
        if (artist?.genres) {
          allGenres.push(...artist.genres);
        }
      });
    } else {
      console.warn('Failed to fetch some artist details');
    }
  }

  return { images: artistImages, genres: allGenres };
}

// Map genres to mood categories
function analyzeMoodsFromGenres(genres: string[], audioFeatures: any): { name: string; value: number }[] {
  const genreString = genres.join(' ').toLowerCase();
  
  // Genre-to-mood mapping with keywords
  const moodKeywords = {
    'Happy': ['happy', 'disco', 'dance', 'party', 'funk', 'pop', 'tropical', 'summer', 'upbeat', 'feel-good'],
    'Melancholy': ['sad', 'melancholy', 'emo', 'blues', 'ballad', 'heartbreak', 'slow', 'emotional'],
    'Energetic': ['edm', 'electronic', 'house', 'techno', 'drum and bass', 'dubstep', 'hardcore', 'metal', 'punk', 'rock'],
    'Chill': ['chill', 'ambient', 'lo-fi', 'lofi', 'relaxing', 'smooth', 'easy listening', 'new age', 'meditation'],
    'Soulful': ['soul', 'r&b', 'rnb', 'gospel', 'motown', 'neo-soul', 'jazz'],
    'Old School': ['classic', 'oldies', 'retro', 'vintage', '70s', '80s', '90s', 'old school'],
    'Romantic': ['romantic', 'love', 'sensual', 'slow jam', 'latin', 'bossa nova'],
    'Aggressive': ['metal', 'hardcore', 'punk', 'thrash', 'death', 'black metal', 'grindcore'],
    'Groovy': ['funk', 'groove', 'disco', 'boogie', 'bass'],
    'Dreamy': ['dream', 'shoegaze', 'ethereal', 'atmospheric', 'synth', 'wave'],
  };
  
  // Calculate genre-based mood scores
  const moodScores: Record<string, number> = {};
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const matches = (genreString.match(new RegExp(keyword, 'gi')) || []).length;
      score += matches;
    }
    moodScores[mood] = score;
  }
  
  // Normalize and combine with audio features
  const totalGenreScore = Object.values(moodScores).reduce((a, b) => a + b, 0) || 1;
  
  // Final mood calculation combining genres and audio features
  const moods = [
    { 
      name: 'Happy', 
      value: Math.round(
        (audioFeatures.valence * 50) + 
        ((moodScores['Happy'] / totalGenreScore) * 50)
      )
    },
    { 
      name: 'Energetic', 
      value: Math.round(
        (audioFeatures.energy * 50) + 
        ((moodScores['Energetic'] / totalGenreScore) * 50)
      )
    },
    { 
      name: 'Danceable', 
      value: Math.round(
        (audioFeatures.danceability * 50) + 
        (((moodScores['Groovy'] + moodScores['Happy']) / totalGenreScore) * 50)
      )
    },
    { 
      name: 'Chill', 
      value: Math.round(
        ((1 - audioFeatures.energy) * 40) + 
        (audioFeatures.acousticness * 20) +
        ((moodScores['Chill'] / totalGenreScore) * 40)
      )
    },
    { 
      name: 'Melancholy', 
      value: Math.round(
        ((1 - audioFeatures.valence) * 50) + 
        ((moodScores['Melancholy'] / totalGenreScore) * 50)
      )
    },
    { 
      name: 'Soulful', 
      value: Math.round(
        ((moodScores['Soulful'] / totalGenreScore) * 70) +
        (audioFeatures.acousticness * 30)
      )
    },
    { 
      name: 'Old School', 
      value: Math.round(
        ((moodScores['Old School'] / totalGenreScore) * 100)
      )
    },
  ];
  
  // Sort by value and return top moods
  return moods
    .filter(m => m.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map(m => ({ ...m, value: Math.min(100, m.value) }));
}

// Process and analyze playlist data
function analyzePlaylist(playlist: SpotifyPlaylist, audioFeatures: AudioFeatures[], artistData: { images: Map<string, string>; genres: string[] }) {
  const tracks = playlist.tracks.items
    .filter(item => item.track && item.track.id)
    .map(item => item.track);

  // Calculate total duration
  const totalDurationMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);

  // Get artist counts
  const artistCounts: Record<string, { name: string; count: number; id: string }> = {};
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      if (!artistCounts[artist.id]) {
        artistCounts[artist.id] = { name: artist.name, count: 0, id: artist.id };
      }
      artistCounts[artist.id].count++;
    });
  });

  const topArtists = Object.values(artistCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((artist, index) => ({
      rank: index + 1,
      name: artist.name,
      tracks: artist.count,
      image: artistData.images.get(artist.id) || '',
    }));

  // Calculate average audio features
  const avgFeatures = audioFeatures.reduce(
    (acc, f) => ({
      danceability: acc.danceability + f.danceability,
      energy: acc.energy + f.energy,
      valence: acc.valence + f.valence,
      acousticness: acc.acousticness + f.acousticness,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
      speechiness: acc.speechiness + f.speechiness,
      liveness: acc.liveness + f.liveness,
      tempo: acc.tempo + f.tempo,
    }),
    {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0,
      speechiness: 0,
      liveness: 0,
      tempo: 0,
    }
  );

  const featureCount = audioFeatures.length || 1;
  Object.keys(avgFeatures).forEach(key => {
    avgFeatures[key as keyof typeof avgFeatures] /= featureCount;
  });

  // Analyze moods from genres and audio features
  const moodData = analyzeMoodsFromGenres(artistData.genres, avgFeatures);
  
  // Log genres for debugging
  const uniqueGenres = [...new Set(artistData.genres)].slice(0, 20);
  console.log('Top genres found:', uniqueGenres.join(', '));

  // Get release years for decade analysis
  const decadeCounts: Record<string, number> = {};
  tracks.forEach(track => {
    if (track.album.release_date) {
      const year = parseInt(track.album.release_date.substring(0, 4));
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    }
  });

  const genreData = Object.entries(decadeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Top tracks by popularity
  const topTracks = [...tracks]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)
    .map((track, index) => ({
      rank: index + 1,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      albumArt: track.album.images[0]?.url || '',
      plays: track.popularity * 1000000, // Approximate based on popularity
    }));

  // Calculate stats
  const avgPopularity = tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length;
  const explicitCount = tracks.filter(t => t.explicit).length;

  return {
    playlist: {
      name: playlist.name,
      description: playlist.description || '',
      owner: playlist.owner.display_name,
      followers: playlist.followers.total,
      image: playlist.images[0]?.url || '',
    },
    stats: {
      totalTracks: playlist.tracks.total,
      totalDuration: formatDuration(totalDurationMs),
      totalArtists: Object.keys(artistCounts).length,
      avgPopularity: Math.round(avgPopularity),
      avgTempo: Math.round(avgFeatures.tempo),
      explicitPercentage: Math.round((explicitCount / tracks.length) * 100),
    },
    topArtists,
    topTracks,
    moodData,
    genreData,
    audioFeatures: avgFeatures,
    facts: generateFacts(playlist, tracks, avgFeatures, decadeCounts, artistData.genres),
  };
}

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function generateFacts(playlist: SpotifyPlaylist, tracks: any[], features: any, decades: Record<string, number>, genres: string[]): string[] {
  const facts = [];
  const genreString = genres.join(' ').toLowerCase();
  
  // Top genres detection
  const genreCounts: Record<string, number> = {};
  genres.forEach(g => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
  
  if (topGenres.length > 0) {
    facts.push(`🎵 Dominated by ${topGenres.slice(0, 2).join(' & ')} vibes`);
  }
  
  // Decade analysis
  const topDecade = Object.entries(decades).sort((a, b) => b[1] - a[1])[0];
  if (topDecade) {
    const percentage = Math.round((topDecade[1] / tracks.length) * 100);
    facts.push(`📅 ${percentage}% of tracks are from the ${topDecade[0]}`);
  }
  
  // Genre-based mood facts
  if (genreString.includes('soul') || genreString.includes('r&b') || genreString.includes('neo-soul')) {
    facts.push('🎷 Soulful and smooth - perfect for unwinding');
  }
  
  if (genreString.includes('disco') || genreString.includes('funk') || genreString.includes('boogie')) {
    facts.push('🪩 Disco & funk flavors - get your groove on!');
  }
  
  if (genreString.includes('melanchol') || genreString.includes('sad') || genreString.includes('emo')) {
    facts.push('💔 Melancholic undertones throughout');
  }
  
  if (genreString.includes('classic') || genreString.includes('oldies') || genreString.includes('retro')) {
    facts.push('🎙️ Classic old school vibes');
  }
  
  if (genreString.includes('hip hop') || genreString.includes('rap')) {
    facts.push('🎤 Hip-hop & rap influences strong');
  }
  
  if (genreString.includes('indie') || genreString.includes('alternative')) {
    facts.push('🎸 Indie & alternative edge');
  }
  
  if (genreString.includes('electronic') || genreString.includes('edm') || genreString.includes('house')) {
    facts.push('🎛️ Electronic beats drive this playlist');
  }
  
  // Audio feature-based facts (only add if not enough genre facts)
  if (facts.length < 4) {
    const tempo = Math.round(features.tempo);
    if (tempo > 140) {
      facts.push(`🚀 Fast-paced at ${tempo} BPM`);
    } else if (tempo > 120) {
      facts.push(`💃 Upbeat tempo at ${tempo} BPM - perfect for dancing`);
    } else if (tempo < 90) {
      facts.push(`🌊 Slow and smooth at ${tempo} BPM`);
    }
  }
  
  if (facts.length < 5 && features.valence > 0.7) {
    facts.push('🎉 Extremely upbeat and cheerful!');
  } else if (facts.length < 5 && features.valence < 0.3) {
    facts.push('💭 Deep and introspective mood');
  }
  
  if (facts.length < 5 && features.energy > 0.8) {
    facts.push('⚡ High-energy - perfect for workouts!');
  } else if (facts.length < 5 && features.energy < 0.3) {
    facts.push('🌙 Low-key and relaxing atmosphere');
  }
  
  if (facts.length < 5 && features.danceability > 0.8) {
    facts.push('🕺 Impossible to sit still!');
  }
  
  if (facts.length < 5 && features.acousticness > 0.6) {
    facts.push('🎸 Acoustic and organic sounds');
  }
  
  if (facts.length < 6 && tracks.length > 100) {
    facts.push(`📚 Massive collection with ${tracks.length} tracks!`);
  }
  
  return facts.slice(0, 6);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playlistUrl } = await req.json();

    if (!playlistUrl) {
      return new Response(
        JSON.stringify({ error: 'Playlist URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing playlist:', playlistUrl);

    const playlistId = extractPlaylistId(playlistUrl);
    const accessToken = await getAccessToken();
    
    const playlist = await fetchPlaylist(accessToken, playlistId);
    
    const trackIds = playlist.tracks.items
      .filter(item => item.track?.id)
      .map(item => item.track.id);
    
    // Get unique artist IDs for fetching images
    const artistIds = [...new Set(
      playlist.tracks.items
        .filter(item => item.track?.artists)
        .flatMap(item => item.track.artists.map(a => a.id))
    )].slice(0, 50); // Limit to top 50 artists
    
    const [audioFeatures, artistData] = await Promise.all([
      fetchAudioFeatures(accessToken, trackIds),
      fetchArtists(accessToken, artistIds),
    ]);
    
    const analysis = analyzePlaylist(playlist, audioFeatures, artistData);

    console.log('Analysis complete for playlist:', playlist.name);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze playlist';
    console.error('Error processing playlist:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
