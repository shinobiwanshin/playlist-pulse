export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  trackCount: number;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
  duration: number;
  popularity: number;
  energy: number;
  danceability: number;
  valence: number;
}

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: number;
  avgPopularity: number;
  avgEnergy: number;
  avgDanceability: number;
  avgValence: number;
  topGenres: { name: string; count: number }[];
  decadeDistribution: { decade: string; count: number }[];
  moodDistribution: { mood: string; value: number }[];
}

export interface PlaylistData {
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  followers: number;
  tracks: Track[];
  artists: Artist[];
  stats: PlaylistStats;
  facts: string[];
}
