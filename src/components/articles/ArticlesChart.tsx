
import { useEffect, useState } from "react";
import { Article, fetchArticles } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

export const ArticlesChart = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchArticles();
      setArticles(data);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (articles.length) {
      const processChartData = () => {
        // Prendre les 6 derniers mois
        const now = new Date();
        const sixMonthsAgo = subMonths(now, 5);
        
        const months = eachMonthOfInterval({
          start: startOfMonth(sixMonthsAgo),
          end: endOfMonth(now),
        });
        
        const data = months.map(month => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          
          const count = articles.filter(article => {
            const pubDate = new Date(article.publishedAt);
            return pubDate >= monthStart && pubDate <= monthEnd;
          }).length;
          
          return {
            month: format(month, "MMM yyyy", { locale: fr }),
            articles: count,
          };
        });
        
        setChartData(data);
      };
      
      processChartData();
    }
  }, [articles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des Articles</CardTitle>
        <CardDescription>Nombre d'articles publiés par mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value, name) => [value, 'Articles']}
                labelFormatter={(label) => `Mois: ${label}`}
              />
              <Legend />
              <Bar dataKey="articles" name="Articles" fill="#1A78E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
