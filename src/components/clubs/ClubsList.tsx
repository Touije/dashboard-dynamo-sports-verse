
import { useEffect, useState } from "react";
import { Club, fetchClubs, deleteClub } from "@/services/api";
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
import { ClubForm } from "./ClubForm";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export const ClubsList = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadClubs = async () => {
    setLoading(true);
    const data = await fetchClubs();
    setClubs(data);
    setFilteredClubs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(
        club =>
          club.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.stade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [searchTerm, clubs]);

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce club ?")) {
      const success = await deleteClub(id);
      if (success) {
        loadClubs();
      }
    }
  };

  const getLogoUrl = (club: Club) => {
    if (club.logo?.formats?.thumbnail?.url) {
      return `http://localhost:1337${club.logo.formats.thumbnail.url}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher des clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingClub(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Club
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <ClubForm
              club={editingClub}
              onSuccess={() => {
                setIsFormOpen(false);
                loadClubs();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clubs</CardTitle>
          <CardDescription>Liste des clubs disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500">Chargement des clubs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Stade</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClubs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {searchTerm ? "Aucun club ne correspond à votre recherche" : "Aucun club disponible"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClubs.map((club) => (
                      <TableRow key={club.documentId}>
                        <TableCell>
                          {getLogoUrl(club) ? (
                            <Avatar>
                              <img src={getLogoUrl(club) || ""} alt={club.nom} className="object-cover" />
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                {club.nom.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{club.nom}</TableCell>
                        <TableCell>{club.stade}</TableCell>
                        <TableCell>{club.capacite.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(club)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(club.documentId)}
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
