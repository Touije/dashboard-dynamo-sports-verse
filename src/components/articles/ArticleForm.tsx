
import { useState } from "react";
import { Article, createArticle, updateArticle } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
}

export const ArticleForm = ({ article, onSuccess }: ArticleFormProps) => {
  const [formData, setFormData] = useState<{
    titre: string;
    contenu: string;
  }>({
    titre: article?.titre || "",
    contenu: article?.contenu || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (article) {
        await updateArticle(article.documentId, formData);
      } else {
        await createArticle(formData);
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
          {article ? "Modifier l'article" : "Nouvel article"}
        </h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="titre">Titre</Label>
        <Input
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Titre de l'article"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contenu">Contenu</Label>
        <Textarea
          id="contenu"
          name="contenu"
          value={formData.contenu}
          onChange={handleChange}
          placeholder="Contenu de l'article"
          rows={6}
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
          {submitting ? "Envoi en cours..." : article ? "Mettre à jour" : "Créer l'article"}
        </Button>
      </div>
    </form>
  );
};
