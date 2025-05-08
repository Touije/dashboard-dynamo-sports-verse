
import { useState } from "react";
import { Club, createClub, updateClub } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ClubFormProps {
  club?: Club | null;
  onSuccess: () => void;
}

export const ClubForm = ({ club, onSuccess }: ClubFormProps) => {
  const [formData, setFormData] = useState<{
    nom: string;
    fondation: string;
    stade: string;
    capacite: number;
    siteWeb: string;
    description: string;
    entraineur: string;
    president: string;
  }>({
    nom: club?.nom || "",
    fondation: club?.fondation || "",
    stade: club?.stade || "",
    capacite: club?.capacite || 0,
    siteWeb: club?.siteWeb || "",
    description: club?.description || "",
    entraineur: club?.entraineur || "",
    president: club?.president || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacite" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (club) {
        await updateClub(club.documentId, formData);
      } else {
        await createClub(formData);
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
          {club ? "Modifier le club" : "Nouveau club"}
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
            placeholder="Nom du club"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fondation">Date de fondation</Label>
          <Input
            id="fondation"
            name="fondation"
            type="date"
            value={formData.fondation}
            onChange={handleChange}
            required
          />
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
          <Label htmlFor="capacite">Capacité</Label>
          <Input
            id="capacite"
            name="capacite"
            type="number"
            value={formData.capacite}
            onChange={handleChange}
            min={0}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entraineur">Entraîneur</Label>
          <Input
            id="entraineur"
            name="entraineur"
            value={formData.entraineur}
            onChange={handleChange}
            placeholder="Nom de l'entraîneur"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="president">Président</Label>
          <Input
            id="president"
            name="president"
            value={formData.president}
            onChange={handleChange}
            placeholder="Nom du président"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="siteWeb">Site web</Label>
        <Input
          id="siteWeb"
          name="siteWeb"
          value={formData.siteWeb}
          onChange={handleChange}
          placeholder="URL du site web"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description du club"
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
          {submitting ? "Envoi en cours..." : club ? "Mettre à jour" : "Créer le club"}
        </Button>
      </div>
    </form>
  );
};
