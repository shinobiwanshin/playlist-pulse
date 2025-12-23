import { Track } from "@/types/playlist";
import { Play } from "lucide-react";

interface TopTracksProps {
  tracks: Track[];
}

const TopTracks = ({ tracks }: TopTracksProps) => {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '--:--';
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPlays = (plays?: number) => {
    if (!plays) return '0';
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    }
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(0)}K`;
    }
    return plays.toString();
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-300">
      <h3 className="text-xl font-semibold mb-6">Top Tracks</h3>
      
      <div className="space-y-2">
        {tracks.slice(0, 5).map((track, index) => (
          <div 
            key={track.id || track.name}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            {/* Track number / Play button */}
            <div className="w-8 text-center">
              <span className="text-muted-foreground group-hover:hidden">{track.rank || index + 1}</span>
              <Play className="w-4 h-4 text-spotify-green hidden group-hover:block mx-auto" />
            </div>

            {/* Album cover */}
            {(track.albumCover || track.albumArt) ? (
              <img
                src={track.albumCover || track.albumArt}
                alt={track.name}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground">🎵</span>
              </div>
            )}

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate group-hover:text-spotify-green transition-colors">
                {track.name}
              </h4>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Plays count */}
            <div className="hidden sm:block w-24 text-right">
              <p className="text-sm text-muted-foreground">{formatPlays(track.plays)} plays</p>
            </div>

            {/* Duration */}
            <span className="text-sm text-muted-foreground w-12 text-right">
              {formatDuration(track.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTracks;
