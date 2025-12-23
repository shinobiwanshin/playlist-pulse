import { PlaylistStats } from "@/types/playlist";
import { TrendingUp, Music, Zap, Smile } from "lucide-react";

interface StatsCardsProps {
  stats: PlaylistStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      label: "Popularity",
      value: `${stats.avgPopularity}%`,
      icon: TrendingUp,
      description: "Average track popularity",
      color: "text-spotify-green",
    },
    {
      label: "Energy",
      value: `${Math.round(stats.avgEnergy * 100)}%`,
      icon: Zap,
      description: "How energetic your music is",
      color: "text-orange-400",
    },
    {
      label: "Danceability",
      value: `${Math.round(stats.avgDanceability * 100)}%`,
      icon: Music,
      description: "How danceable your tracks are",
      color: "text-pink-400",
    },
    {
      label: "Happiness",
      value: `${Math.round(stats.avgValence * 100)}%`,
      icon: Smile,
      description: "Overall positive mood",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
          <div className="text-3xl font-bold mb-1">{card.value}</div>
          <div className="text-sm font-medium text-foreground">{card.label}</div>
          <div className="text-xs text-muted-foreground mt-1">{card.description}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
