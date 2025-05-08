
import { useEffect, useState } from "react";
import { Competition, fetchCompetitions, deleteCompetition } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompetitionForm } from "./CompetitionForm";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export const CompetitionsList = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadCompetitions = async () => {
    setLoading(true);
    const data = await fetchCompetitions();
    setCompetitions(data);
    setFilteredCompetitions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompetitions(competitions);
    } else {
      const filtered = competitions.filter(
        competition =>
          competition.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          competition.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
          competition.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompetitions(filtered);
    }
  }, [searchTerm, competitions]);

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette compétition ?")) {
      const success = await deleteCompetition(id);
      if (success) {
        loadCompetitions();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const getLogoUrl = (competition: Competition) => {
    if (competition.logo?.formats?.thumbnail?.url) {
      return `http://localhost:1337${competition.logo.formats.thumbnail.url}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher des compétitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCompetition(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Compétition
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <CompetitionForm
              competition={editingCompetition}
              onSuccess={() => {
                setIsFormOpen(false);
                loadCompetitions();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compétitions</CardTitle>
          <CardDescription>Liste des compétitions disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500">Chargement des compétitions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Saison</TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompetitions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? "Aucune compétition ne correspond à votre recherche" : "Aucune compétition disponible"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompetitions.map((competition) => (
                      <TableRow key={competition.documentId}>
                        <TableCell>
                          {getLogoUrl(competition) ? (
                            <Avatar>
                              <img src={getLogoUrl(competition) || ""} alt={competition.nom} className="object-cover" />
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                {competition.nom.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{competition.nom}</TableCell>
                        <TableCell>{competition.saison}</TableCell>
                        <TableCell>
                          <Badge variant={competition.niveau === "continental" ? "secondary" : "outline"}>
                            {competition.pays}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>Début: {formatDate(competition.dateDebut)}</span>
                            <span>Fin: {formatDate(competition.dateFin)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(competition)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(competition.documentId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
