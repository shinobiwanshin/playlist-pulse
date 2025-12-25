import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PlaylistStats, ChartData } from "@/types/playlist";

interface GenreChartProps {
  stats: PlaylistStats;
  genreData?: ChartData[];
}

const COLORS = [
  "hsl(141, 76%, 48%)", // spotify green
  "hsl(160, 70%, 40%)",
  "hsl(180, 60%, 45%)",
  "hsl(200, 65%, 50%)",
  "hsl(220, 55%, 55%)",
];

const GenreChart = ({ stats, genreData }: GenreChartProps) => {
  // Use genreData if provided, otherwise fall back to stats.topGenres
  const data = genreData?.slice(0, 5) || stats.topGenres?.slice(0, 5) || [];

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-xl font-semibold mb-6">Era Distribution</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart */}
        <div className="w-full lg:w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 98%)",
                }}
                labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                itemStyle={{ color: "hsl(0, 0%, 98%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.value} tracks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreChart;
