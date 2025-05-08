
import { CompetitionsList } from "@/components/competitions/CompetitionsList";
import { CompetitionsChart } from "@/components/competitions/CompetitionsChart";

const Competitions = () => {
  return (
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
  );
};

export default Competitions;
