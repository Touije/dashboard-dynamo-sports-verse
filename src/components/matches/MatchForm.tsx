
import { useState } from "react";
import { Match, createMatch, updateMatch } from "@/services/api";
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

interface MatchFormProps {
  match?: Match | null;
  onSuccess: () => void;
}

export const MatchForm = ({ match, onSuccess }: MatchFormProps) => {
  const [formData, setFormData] = useState<{
    titre: string;
    contenu: string;
    dateMatch: string;
    statut: string;
    stade: string;
    arbitre: string;
    resume: string;
  }>({
    titre: match?.titre || "",
    contenu: match?.contenu || "",
    dateMatch: match ? new Date(match.dateMatch).toISOString().substring(0, 16) : "",
    statut: match?.statut || "a_venir",
    stade: match?.stade || "",
    arbitre: match?.arbitre || "",
    resume: match?.resume || "",
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
      if (match) {
        await updateMatch(match.documentId, formData);
      } else {
        await createMatch(formData);
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
          {match ? "Modifier le match" : "Nouveau match"}
        </h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="titre">Titre</Label>
        <Input
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Titre du match"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateMatch">Date et heure</Label>
          <Input
            id="dateMatch"
            name="dateMatch"
            type="datetime-local"
            value={formData.dateMatch}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <Select 
            value={formData.statut} 
            onValueChange={(value) => handleSelectChange("statut", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a_venir">À venir</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
              <SelectItem value="reporte">Reporté</SelectItem>
              <SelectItem value="annule">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stade">Stade</Label>
          <Input
            id="stade"
            name="stade"
            value={formData.stade}
            onChange={handleChange}
            placeholder="Nom du stade"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arbitre">Arbitre</Label>
          <Input
            id="arbitre"
            name="arbitre"
            value={formData.arbitre}
            onChange={handleChange}
            placeholder="Nom de l'arbitre"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contenu">Contenu</Label>
        <Textarea
          id="contenu"
          name="contenu"
          value={formData.contenu}
          onChange={handleChange}
          placeholder="Contenu détaillé du match"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="resume">Résumé</Label>
        <Textarea
          id="resume"
          name="resume"
          value={formData.resume}
          onChange={handleChange}
          placeholder="Résumé court du match"
          rows={3}
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
          {submitting ? "Envoi en cours..." : match ? "Mettre à jour" : "Créer le match"}
        </Button>
      </div>
    </form>
  );
};
