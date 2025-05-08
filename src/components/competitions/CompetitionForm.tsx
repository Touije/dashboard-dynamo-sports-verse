
import { useState } from "react";
import { Competition, createCompetition, updateCompetition } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompetitionFormProps {
  competition?: Competition | null;
  onSuccess: () => void;
}

export const CompetitionForm = ({ competition, onSuccess }: CompetitionFormProps) => {
  const [formData, setFormData] = useState<{
    nom: string;
    saison: string;
    pays: string;
    niveau: string;
    description: string;
    dateDebut: string;
    dateFin: string;
  }>({
    nom: competition?.nom || "",
    saison: competition?.saison || "",
    pays: competition?.pays || "",
    niveau: competition?.niveau || "national",
    description: competition?.description || "",
    dateDebut: competition?.dateDebut || "",
    dateFin: competition?.dateFin || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (competition) {
        await updateCompetition(competition.documentId, formData);
      } else {
        await createCompetition(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {competition ? "Modifier la compétition" : "Nouvelle compétition"}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom de la compétition"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="saison">Saison</Label>
          <Input
            id="saison"
            name="saison"
            value={formData.saison}
            onChange={handleChange}
            placeholder="Ex: 2024-2025"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pays">Pays</Label>
          <Input
            id="pays"
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            placeholder="Pays ou région"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="niveau">Niveau</Label>
          <Select 
            value={formData.niveau} 
            onValueChange={(value) => handleSelectChange("niveau", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="continental">Continental</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateDebut">Date de début</Label>
          <Input
            id="dateDebut"
            name="dateDebut"
            type="date"
            value={formData.dateDebut}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateFin">Date de fin</Label>
          <Input
            id="dateFin"
            name="dateFin"
            type="date"
            value={formData.dateFin}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description de la compétition"
          rows={4}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
          disabled={submitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Envoi en cours..." : competition ? "Mettre à jour" : "Créer la compétition"}
        </Button>
      </div>
    </form>
  );
};
