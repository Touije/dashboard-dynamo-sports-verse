
import { useEffect, useState } from "react";
import { Competition, fetchCompetitions } from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CompetitionsChart = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const COLORS = ["#1A78E2", "#E63946", "#4CAF50", "#FF9800", "#673AB7"];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCompetitions();
      setCompetitions(data);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (competitions.length) {
      // Regrouper par niveau de compétition
      const niveauCounts: Record<string, number> = {};
      
      competitions.forEach(competition => {
        if (!niveauCounts[competition.niveau]) {
          niveauCounts[competition.niveau] = 0;
        }
        niveauCounts[competition.niveau]++;
      });
      
      // Transformer en tableau pour le graphique
      const data = Object.entries(niveauCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
        value
      }));
      
      setChartData(data);
    }
  }, [competitions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Compétitions</CardTitle>
        <CardDescription>Par niveau de compétition</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, "Compétitions"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
