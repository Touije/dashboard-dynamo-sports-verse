
import { useEffect, useState } from "react";
import { Club, fetchClubs } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ClubsChart = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const colors = ["#1A78E2", "#E63946", "#4CAF50", "#FF9800", "#9C27B0"];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchClubs();
      setClubs(data);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (clubs.length) {
      // Préparer les données pour le graphique de capacité des stades
      const data = clubs.map(club => ({
        name: club.nom,
        capacité: club.capacite,
      }));
      
      // Trier par capacité décroissante
      data.sort((a, b) => b.capacité - a.capacité);
      
      setChartData(data);
    }
  }, [clubs]);

  const formatCapacity = (value: number) => {
    return `${value.toLocaleString()} places`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacité des Stades</CardTitle>
        <CardDescription>Comparaison des capacités des stades par club</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 100,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                tickFormatter={formatCapacity}
              />
              <YAxis 
                type="category" 
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCapacity(value as number), 'Capacité']}
              />
              <Bar dataKey="capacité" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
