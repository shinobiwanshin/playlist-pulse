import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Sparkles, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onAnalyze, isLoading }: HeroSectionProps) => {
  const [playlistUrl, setPlaylistUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistUrl.trim()) {
      onAnalyze(playlistUrl);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spotify-green/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-200" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-spotify-green" />
          <span className="text-sm text-muted-foreground">Discover your music taste</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up animation-delay-100">
          Unlock Your
          <span className="text-gradient block mt-2">Playlist Insights</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up animation-delay-200">
          Paste your Spotify playlist URL and discover detailed analytics, artist breakdowns, 
          and fascinating facts about your music taste.
        </p>

        {/* URL Input Form */}
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-slide-up animation-delay-300"
        >
          <div className="flex-1 relative">
            <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://open.spotify.com/playlist/..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="pl-12 h-14"
            />
          </div>
          <Button 
            type="submit" 
            variant="spotify" 
            size="xl"
            disabled={isLoading || !playlistUrl.trim()}
            className="min-w-[160px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                Analyze
              </>
            )}
          </Button>
        </form>

        {/* Features preview */}
        <div className="flex flex-wrap justify-center gap-6 mt-16 animate-slide-up animation-delay-400">
          {[
            { icon: BarChart3, label: "Detailed Charts" },
            { icon: Music, label: "Artist Analysis" },
            { icon: Sparkles, label: "Fun Facts" },
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <feature.icon className="w-5 h-5 text-spotify-green" />
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
