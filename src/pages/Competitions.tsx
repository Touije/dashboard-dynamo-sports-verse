
import { CompetitionsList } from "@/components/competitions/CompetitionsList";
import { CompetitionsChart } from "@/components/competitions/CompetitionsChart";
import Layout from "@/components/Layout";

const Competitions = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compétitions</h1>
          <p className="text-gray-500 mt-1">
            Gérez les compétitions et consultez les statistiques
          </p>
        </div>
        
        <CompetitionsList />
        <CompetitionsChart />
      </div>
    </Layout>
  );
};

export default Competitions;
