export interface Artist {
  id?: string;
  rank?: number;
  name: string;
  imageUrl?: string;
  image?: string;
  genres?: string[];
  trackCount?: number;
  tracks?: number;
}

export interface Track {
  id?: string;
  rank?: number;
  name: string;
  artist: string;
  albumCover?: string;
  albumArt?: string;
  duration?: number;
  popularity?: number;
  plays?: number;
  energy?: number;
  danceability?: number;
  valence?: number;
}

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: string | number;
  totalArtists?: number;
  avgPopularity: number;
  avgTempo?: number;
  explicitPercentage?: number;
  avgEnergy?: number;
  avgDanceability?: number;
  avgValence?: number;
  topGenres?: { name: string; count: number }[];
  decadeDistribution?: { decade: string; count: number }[];
  moodDistribution?: { mood: string; value: number }[];
}

export interface PlaylistInfo {
  name: string;
  description: string;
  owner: string;
  followers: number;
  image: string;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  tempo: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PlaylistData {
  name?: string;
  description?: string;
  imageUrl?: string;
  owner?: string;
  followers?: number;
  playlist?: PlaylistInfo;
  tracks?: Track[];
  artists?: Artist[];
  topTracks?: Track[];
  topArtists?: Artist[];
  stats: PlaylistStats;
  moodData?: ChartData[];
  genreData?: ChartData[];
  audioFeatures?: AudioFeatures;
  facts: string[];
}

export interface SpotifyAnalysisResponse {
  playlist: PlaylistInfo;
  stats: PlaylistStats;
  topArtists: Artist[];
  topTracks: Track[];
  moodData: ChartData[];
  genreData: ChartData[];
  audioFeatures: AudioFeatures;
  facts: string[];
}
