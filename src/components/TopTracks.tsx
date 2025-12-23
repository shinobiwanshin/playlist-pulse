import { Track } from "@/types/playlist";
import { Play } from "lucide-react";

interface TopTracksProps {
  tracks: Track[];
}

const TopTracks = ({ tracks }: TopTracksProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-300">
      <h3 className="text-xl font-semibold mb-6">Top Tracks</h3>
      
      <div className="space-y-2">
        {tracks.slice(0, 5).map((track, index) => (
          <div 
            key={track.id}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            {/* Track number / Play button */}
            <div className="w-8 text-center">
              <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
              <Play className="w-4 h-4 text-spotify-green hidden group-hover:block mx-auto" />
            </div>

            {/* Album cover */}
            <img
              src={track.albumCover}
              alt={track.name}
              className="w-12 h-12 rounded-md object-cover"
            />

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate group-hover:text-spotify-green transition-colors">
                {track.name}
              </h4>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Popularity bar */}
            <div className="hidden sm:block w-24">
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-spotify-green rounded-full transition-all duration-500"
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">{track.popularity}%</p>
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
