import { PlaylistData } from "@/types/playlist";
import { Clock, Users, Music2 } from "lucide-react";

interface PlaylistHeaderProps {
  playlist: PlaylistData;
}

const PlaylistHeader = ({ playlist }: PlaylistHeaderProps) => {
  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'string') {
      return duration;
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const playlistImage = playlist.playlist?.image || playlist.imageUrl || '';
  const playlistName = playlist.playlist?.name || playlist.name || '';
  const playlistDescription = playlist.playlist?.description || playlist.description || '';
  const playlistFollowers = playlist.playlist?.followers || playlist.followers || 0;
  const playlistOwner = playlist.playlist?.owner || playlist.owner || '';

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Playlist Image */}
        <div className="relative group">
          <img
            src={playlistImage}
            alt={playlistName}
            className="w-48 h-48 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Playlist Info */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-xs uppercase tracking-wider text-spotify-green font-semibold">
            Playlist
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3">
            {playlistName}
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            {playlistDescription}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-spotify-green" />
              <span>{playlistFollowers.toLocaleString()} followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-spotify-green" />
              <span>{playlist.stats.totalTracks} tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-spotify-green" />
              <span>{formatDuration(playlist.stats.totalDuration)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Created by <span className="text-foreground font-medium">{playlistOwner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
