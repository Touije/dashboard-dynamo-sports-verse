
import { useEffect, useState } from "react";
import { Match, fetchMatches, deleteMatch } from "@/services/api";
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
import { MatchForm } from "./MatchForm";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export const MatchesList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadMatches = async () => {
    setLoading(true);
    const data = await fetchMatches();
    setMatches(data);
    setFilteredMatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter(
        match =>
          match.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.stade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.contenu.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMatches(filtered);
    }
  }, [searchTerm, matches]);

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      const success = await deleteMatch(id);
      if (success) {
        loadMatches();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy à HH:mm", { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "a_venir":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">À venir</Badge>;
      case "en_cours":
        return <Badge variant="secondary" className="bg-green-500 text-white">En cours</Badge>;
      case "termine":
        return <Badge variant="secondary" className="bg-gray-500 text-white">Terminé</Badge>;
      case "reporte":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Reporté</Badge>;
      case "annule":
        return <Badge variant="secondary" className="bg-red-500 text-white">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher des matchs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMatch(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Match
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <MatchForm
              match={editingMatch}
              onSuccess={() => {
                setIsFormOpen(false);
                loadMatches();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matches</CardTitle>
          <CardDescription>Liste des matchs disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500">Chargement des matchs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Stade</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {searchTerm ? "Aucun match ne correspond à votre recherche" : "Aucun match disponible"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMatches.map((match) => (
                      <TableRow key={match.documentId}>
                        <TableCell className="font-medium">{match.titre}</TableCell>
                        <TableCell>{formatDate(match.dateMatch)}</TableCell>
                        <TableCell>{match.stade}</TableCell>
                        <TableCell>{getStatusBadge(match.statut)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(match)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(match.documentId)}
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
