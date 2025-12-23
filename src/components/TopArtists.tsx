import { Artist } from "@/types/playlist";

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists = ({ artists }: TopArtistsProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-200">
      <h3 className="text-xl font-semibold mb-6">Top Artists</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {artists.slice(0, 5).map((artist, index) => (
          <div 
            key={artist.id}
            className="group text-center"
          >
            <div className="relative mb-3">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full aspect-square rounded-full object-cover border-2 border-transparent group-hover:border-spotify-green transition-all duration-300 group-hover:scale-105"
              />
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
              {artist.trackCount} {artist.trackCount === 1 ? "track" : "tracks"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
