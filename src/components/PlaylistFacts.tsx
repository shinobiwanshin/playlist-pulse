import { Lightbulb } from "lucide-react";

interface PlaylistFactsProps {
  facts: string[];
}

const PlaylistFacts = ({ facts }: PlaylistFactsProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-400">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-semibold">Fun Facts</h3>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        {facts.map((fact, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
          >
            <p className="text-sm leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistFacts;
