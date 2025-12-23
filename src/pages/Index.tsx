import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisResults from "@/components/AnalysisResults";
import { mockPlaylistData } from "@/data/mockPlaylist";
import { PlaylistData } from "@/types/playlist";
import { useToast } from "@/hooks/use-toast";
import { useUserSync } from "@/hooks/useUserSync";
import UserButton from "@/components/auth/UserButton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<PlaylistData | null>(null);
  const { toast } = useToast();
  
  // Sync user data to Supabase
  useUserSync();

  const handleAnalyze = async (url: string) => {
    // Validate URL format
    if (!url.includes("spotify.com/playlist")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Spotify playlist URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAnalysisData(mockPlaylistData);
    setIsLoading(false);

    toast({
      title: "Analysis Complete!",
      description: "Your playlist insights are ready",
    });
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* User menu */}
      <div className="absolute top-4 right-4 z-50">
        <UserButton />
      </div>
      
      {analysisData ? (
        <AnalysisResults data={analysisData} onReset={handleReset} />
      ) : (
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}
    </main>
  );
};

export default Index;
