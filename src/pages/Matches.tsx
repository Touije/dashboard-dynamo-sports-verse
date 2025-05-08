
import { MatchesList } from "@/components/matches/MatchesList";
import { MatchesChart } from "@/components/matches/MatchesChart";
import Layout from "@/components/Layout";

const Matches = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-gray-500 mt-1">
            Gérez les matches et consultez les statistiques
          </p>
        </div>
        
        <MatchesList />
        <MatchesChart />
      </div>
    </Layout>
  );
};

export default Matches;
