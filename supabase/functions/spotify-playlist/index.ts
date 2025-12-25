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

// Process and analyze playlist data
function analyzePlaylist(playlist: SpotifyPlaylist, audioFeatures: AudioFeatures[]) {
  const tracks = playlist.tracks.items
    .filter(item => item.track && item.track.id)
    .map(item => item.track);

  // Calculate total duration
  const totalDurationMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);

  // Get artist counts
  const artistCounts: Record<string, { name: string; count: number; image?: string }> = {};
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      if (!artistCounts[artist.id]) {
        artistCounts[artist.id] = { name: artist.name, count: 0 };
      }
      artistCounts[artist.id].count++;
    });
  });

  const topArtists = Object.values(artistCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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

  // Determine genres/moods based on audio features
  const moodData = [
    { name: 'Happy', value: Math.round(avgFeatures.valence * 100) },
    { name: 'Energetic', value: Math.round(avgFeatures.energy * 100) },
    { name: 'Danceable', value: Math.round(avgFeatures.danceability * 100) },
    { name: 'Acoustic', value: Math.round(avgFeatures.acousticness * 100) },
    { name: 'Chill', value: Math.round((1 - avgFeatures.energy) * 100) },
  ];

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
    topArtists: topArtists.map((artist, index) => ({
      rank: index + 1,
      name: artist.name,
      tracks: artist.count,
      image: '', // Would need separate artist API call
    })),
    topTracks,
    moodData,
    genreData,
    audioFeatures: avgFeatures,
    facts: generateFacts(playlist, tracks, avgFeatures, decadeCounts),
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

function generateFacts(playlist: SpotifyPlaylist, tracks: any[], features: any, decades: Record<string, number>): string[] {
  const facts = [];
  
  const topDecade = Object.entries(decades).sort((a, b) => b[1] - a[1])[0];
  if (topDecade) {
    facts.push(`Most tracks are from the ${topDecade[0]}`);
  }
  
  if (features.valence > 0.6) {
    facts.push('This playlist has a very happy and positive vibe');
  } else if (features.valence < 0.4) {
    facts.push('This playlist has a melancholic and introspective mood');
  }
  
  if (features.energy > 0.7) {
    facts.push('High energy playlist - perfect for workouts!');
  } else if (features.energy < 0.3) {
    facts.push('Relaxing playlist - great for unwinding');
  }
  
  if (features.danceability > 0.7) {
    facts.push('Highly danceable tracks dominate this playlist');
  }
  
  if (features.acousticness > 0.5) {
    facts.push('Acoustic and organic sounds are prominent');
  }

  facts.push(`Average tempo: ${Math.round(features.tempo)} BPM`);
  
  return facts.slice(0, 5);
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
    
    const audioFeatures = await fetchAudioFeatures(accessToken, trackIds);
    
    const analysis = analyzePlaylist(playlist, audioFeatures);

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
