import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { PlaylistStats } from "@/types/playlist";

interface MoodChartProps {
  stats: PlaylistStats;
}

const COLORS = [
  "hsl(141, 76%, 48%)",
  "hsl(280, 65%, 55%)",
  "hsl(45, 90%, 55%)",
  "hsl(200, 70%, 50%)",
];

const MoodChart = ({ stats }: MoodChartProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up animation-delay-100">
      <h3 className="text-xl font-semibold mb-6">Mood Analysis</h3>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.moodDistribution} layout="vertical">
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 60%)", fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="mood" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0, 0%, 98%)", fontSize: 13, fontWeight: 500 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                color: "hsl(0, 0%, 98%)",
              }}
              formatter={(value: number) => [`${value}%`, "Score"]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
              {stats.moodDistribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
