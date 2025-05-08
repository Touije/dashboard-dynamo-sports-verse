
import { ClubsList } from "@/components/clubs/ClubsList";
import { ClubsChart } from "@/components/clubs/ClubsChart";

const Clubs = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
        <p className="text-gray-500 mt-1">
          Gérez les clubs et consultez les statistiques
        </p>
      </div>
      
      <ClubsList />
      <ClubsChart />
    </div>
  );
};

export default Clubs;
