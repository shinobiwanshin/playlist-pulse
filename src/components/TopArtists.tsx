import { Artist } from "@/types/playlist";

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists = ({ artists }: TopArtistsProps) => {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-200">
      <h3 className="text-xl font-semibold mb-6">Top Artists</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {artists.slice(0, 5).map((artist, index) => (
          <div 
            key={artist.id || artist.name}
            className="group text-center"
          >
            <div className="relative mb-3">
              {(artist.imageUrl || artist.image) ? (
                <img
                  src={artist.imageUrl || artist.image}
                  alt={artist.name}
                  className="w-full aspect-square rounded-full object-cover border-2 border-transparent group-hover:border-spotify-green transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full aspect-square rounded-full bg-secondary flex items-center justify-center border-2 border-transparent group-hover:border-spotify-green transition-all duration-300">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-spotify-green rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">#1</span>
                </div>
              )}
            </div>
            <h4 className="font-medium text-sm truncate group-hover:text-spotify-green transition-colors">
              {artist.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {artist.trackCount || artist.tracks || 0} {(artist.trackCount || artist.tracks || 0) === 1 ? "track" : "tracks"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
