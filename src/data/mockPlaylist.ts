import { PlaylistData } from "@/types/playlist";

export const mockPlaylistData: PlaylistData = {
  name: "Chill Vibes 2024",
  description: "The perfect playlist for relaxing and unwinding",
  imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  owner: "MusicLover",
  followers: 12543,
  tracks: [
    { id: "1", name: "Blinding Lights", artist: "The Weeknd", albumCover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop", duration: 200, popularity: 95, energy: 0.8, danceability: 0.5, valence: 0.6 },
    { id: "2", name: "Watermelon Sugar", artist: "Harry Styles", albumCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop", duration: 174, popularity: 89, energy: 0.82, danceability: 0.55, valence: 0.56 },
    { id: "3", name: "Levitating", artist: "Dua Lipa", albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop", duration: 203, popularity: 92, energy: 0.83, danceability: 0.7, valence: 0.91 },
    { id: "4", name: "Stay", artist: "The Kid LAROI", albumCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop", duration: 141, popularity: 88, energy: 0.76, danceability: 0.59, valence: 0.48 },
    { id: "5", name: "Good 4 U", artist: "Olivia Rodrigo", albumCover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop", duration: 178, popularity: 91, energy: 0.66, danceability: 0.56, valence: 0.69 },
    { id: "6", name: "Peaches", artist: "Justin Bieber", albumCover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&h=100&fit=crop", duration: 198, popularity: 85, energy: 0.68, danceability: 0.68, valence: 0.72 },
    { id: "7", name: "drivers license", artist: "Olivia Rodrigo", albumCover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=100&h=100&fit=crop", duration: 242, popularity: 87, energy: 0.43, danceability: 0.58, valence: 0.13 },
    { id: "8", name: "Montero", artist: "Lil Nas X", albumCover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100&h=100&fit=crop", duration: 137, popularity: 86, energy: 0.51, danceability: 0.61, valence: 0.76 },
  ],
  artists: [
    { id: "1", name: "The Weeknd", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop", genres: ["Pop", "R&B"], trackCount: 3 },
    { id: "2", name: "Dua Lipa", imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop", genres: ["Pop", "Dance"], trackCount: 2 },
    { id: "3", name: "Olivia Rodrigo", imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&h=150&fit=crop", genres: ["Pop", "Alt"], trackCount: 2 },
    { id: "4", name: "Harry Styles", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop", genres: ["Pop", "Rock"], trackCount: 1 },
    { id: "5", name: "Justin Bieber", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop", genres: ["Pop", "R&B"], trackCount: 1 },
  ],
  stats: {
    totalTracks: 8,
    totalDuration: 1473,
    avgPopularity: 89,
    avgEnergy: 0.69,
    avgDanceability: 0.6,
    avgValence: 0.6,
    topGenres: [
      { name: "Pop", count: 8 },
      { name: "R&B", count: 3 },
      { name: "Dance", count: 2 },
      { name: "Alt", count: 2 },
      { name: "Rock", count: 1 },
    ],
    decadeDistribution: [
      { decade: "2020s", count: 8 },
    ],
    moodDistribution: [
      { mood: "Energy", value: 69 },
      { mood: "Danceability", value: 60 },
      { mood: "Happiness", value: 60 },
      { mood: "Acousticness", value: 25 },
    ],
  },
  facts: [
    "🎵 Your playlist is 24 minutes and 33 seconds long - perfect for a quick workout!",
    "🔥 The Weeknd dominates with 3 tracks - you're clearly a fan!",
    "💃 Your average danceability is 60% - this playlist will get you moving!",
    "⚡ High energy alert! Your playlist averages 69% energy.",
    "🎤 Pop is your top genre with all 8 tracks falling into this category.",
    "📈 Average track popularity is 89% - you have mainstream taste!",
    "🌟 'Blinding Lights' is your most popular track at 95% popularity.",
  ],
};
