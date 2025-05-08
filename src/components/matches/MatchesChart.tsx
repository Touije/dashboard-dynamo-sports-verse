
import { useEffect, useState } from "react";
import { Match, fetchMatches } from "@/services/api";
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

export const MatchesChart = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const STATUS_COLORS = {
    a_venir: "#1A78E2",
    en_cours: "#4CAF50",
    termine: "#6C757D",
    reporte: "#FF9800",
    annule: "#E63946",
  };

  const STATUS_LABELS = {
    a_venir: "À venir",
    en_cours: "En cours",
    termine: "Terminé",
    reporte: "Reporté",
    annule: "Annulé",
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMatches();
      setMatches(data);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (matches.length) {
      // Compter les matches par statut
      const statusCounts: Record<string, number> = {
        a_venir: 0,
        en_cours: 0,
        termine: 0,
        reporte: 0,
        annule: 0,
      };
      
      matches.forEach(match => {
        if (statusCounts[match.statut] !== undefined) {
          statusCounts[match.statut]++;
        } else {
          statusCounts[match.statut] = 1;
        }
      });
      
      // Transformer en tableau pour le graphique
      const data = Object.entries(statusCounts)
        .filter(([_, value]) => value > 0) // Ne garder que les statuts qui ont des matches
        .map(([name, value]) => ({
          name: STATUS_LABELS[name as keyof typeof STATUS_LABELS] || name,
          value,
          color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "#999999"
        }));
      
      setChartData(data);
    }
  }, [matches]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statuts des Matches</CardTitle>
        <CardDescription>Répartition des matches par statut</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, "Matches"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Aucune donnée à afficher</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
