import { PlaylistData } from "@/types/playlist";
import PlaylistHeader from "./PlaylistHeader";
import StatsCards from "./StatsCards";
import GenreChart from "./GenreChart";
import MoodChart from "./MoodChart";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";
import PlaylistFacts from "./PlaylistFacts";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface AnalysisResultsProps {
  data: PlaylistData;
  onReset: () => void;
}

const AnalysisResults = ({ data, onReset }: AnalysisResultsProps) => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back button */}
        <Button 
          variant="glass" 
          onClick={onReset}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Analyze Another Playlist
        </Button>

        {/* Playlist Header */}
        <PlaylistHeader playlist={data} />

        {/* Stats Cards */}
        <StatsCards stats={data.stats} />

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <GenreChart stats={data.stats} />
          <MoodChart stats={data.stats} />
        </div>

        {/* Top Artists */}
        <TopArtists artists={data.artists} />

        {/* Top Tracks */}
        <TopTracks tracks={data.tracks} />

        {/* Fun Facts */}
        <PlaylistFacts facts={data.facts} />
      </div>
    </div>
  );
};

export default AnalysisResults;
