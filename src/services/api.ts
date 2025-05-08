
import { toast } from "sonner";

const API_URL = "http://localhost:1337/api";

interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Article {
  id: number;
  documentId: string;
  titre: string;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Club {
  id: number;
  documentId: string;
  nom: string;
  fondation: string;
  stade: string;
  capacite: number;
  siteWeb: string;
  description: string;
  entraineur: string;
  president: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logo?: {
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  };
}

export interface Competition {
  id: number;
  documentId: string;
  nom: string;
  saison: string;
  pays: string;
  niveau: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logo?: {
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  };
}

export interface Match {
  id: number;
  documentId: string;
  titre: string;
  contenu: string;
  dateMatch: string;
  statut: string;
  stade: string;
  arbitre: string;
  resume: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Fonction générique pour gérer les erreurs API
const handleApiError = (error: any, action: string) => {
  console.error(`Erreur lors de ${action}:`, error);
  toast.error(`Erreur lors de ${action}. Veuillez réessayer.`);
};

// Articles API
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(`${API_URL}/articles`);
    const data: ApiResponse<Article> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error, "de la récupération des articles");
    return [];
  }
};

export const createArticle = async (article: Omit<Article, "id" | "documentId" | "createdAt" | "updatedAt" | "publishedAt">): Promise<Article | null> => {
  try {
    const response = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: article }),
    });
    const data = await response.json();
    toast.success("Article créé avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la création de l'article");
    return null;
  }
};

export const updateArticle = async (id: string, article: Partial<Article>): Promise<Article | null> => {
  try {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: article }),
    });
    const data = await response.json();
    toast.success("Article mis à jour avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la mise à jour de l'article");
    return null;
  }
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
    });
    toast.success("Article supprimé avec succès");
    return true;
  } catch (error) {
    handleApiError(error, "de la suppression de l'article");
    return false;
  }
};

// Clubs API
export const fetchClubs = async (): Promise<Club[]> => {
  try {
    const response = await fetch(`${API_URL}/clubs?populate=logo`);
    const data: ApiResponse<Club> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error, "de la récupération des clubs");
    return [];
  }
};

export const createClub = async (club: Omit<Club, "id" | "documentId" | "createdAt" | "updatedAt" | "publishedAt" | "logo">): Promise<Club | null> => {
  try {
    const response = await fetch(`${API_URL}/clubs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: club }),
    });
    const data = await response.json();
    toast.success("Club créé avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la création du club");
    return null;
  }
};

export const updateClub = async (id: string, club: Partial<Club>): Promise<Club | null> => {
  try {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: club }),
    });
    const data = await response.json();
    toast.success("Club mis à jour avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la mise à jour du club");
    return null;
  }
};

export const deleteClub = async (id: string): Promise<boolean> => {
  try {
    await fetch(`${API_URL}/clubs/${id}`, {
      method: "DELETE",
    });
    toast.success("Club supprimé avec succès");
    return true;
  } catch (error) {
    handleApiError(error, "de la suppression du club");
    return false;
  }
};

// Competitions API
export const fetchCompetitions = async (): Promise<Competition[]> => {
  try {
    const response = await fetch(`${API_URL}/competitions?populate=logo`);
    const data: ApiResponse<Competition> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error, "de la récupération des compétitions");
    return [];
  }
};

export const createCompetition = async (competition: Omit<Competition, "id" | "documentId" | "createdAt" | "updatedAt" | "publishedAt" | "logo">): Promise<Competition | null> => {
  try {
    const response = await fetch(`${API_URL}/competitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: competition }),
    });
    const data = await response.json();
    toast.success("Compétition créée avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la création de la compétition");
    return null;
  }
};

export const updateCompetition = async (id: string, competition: Partial<Competition>): Promise<Competition | null> => {
  try {
    const response = await fetch(`${API_URL}/competitions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: competition }),
    });
    const data = await response.json();
    toast.success("Compétition mise à jour avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la mise à jour de la compétition");
    return null;
  }
};

export const deleteCompetition = async (id: string): Promise<boolean> => {
  try {
    await fetch(`${API_URL}/competitions/${id}`, {
      method: "DELETE",
    });
    toast.success("Compétition supprimée avec succès");
    return true;
  } catch (error) {
    handleApiError(error, "de la suppression de la compétition");
    return false;
  }
};

// Matches API
export const fetchMatches = async (): Promise<Match[]> => {
  try {
    const response = await fetch(`${API_URL}/matches`);
    const data: ApiResponse<Match> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error, "de la récupération des matches");
    return [];
  }
};

export const createMatch = async (match: Omit<Match, "id" | "documentId" | "createdAt" | "updatedAt" | "publishedAt">): Promise<Match | null> => {
  try {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: match }),
    });
    const data = await response.json();
    toast.success("Match créé avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la création du match");
    return null;
  }
};

export const updateMatch = async (id: string, match: Partial<Match>): Promise<Match | null> => {
  try {
    const response = await fetch(`${API_URL}/matches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: match }),
    });
    const data = await response.json();
    toast.success("Match mis à jour avec succès");
    return data.data;
  } catch (error) {
    handleApiError(error, "de la mise à jour du match");
    return null;
  }
};

export const deleteMatch = async (id: string): Promise<boolean> => {
  try {
    await fetch(`${API_URL}/matches/${id}`, {
      method: "DELETE",
    });
    toast.success("Match supprimé avec succès");
    return true;
  } catch (error) {
    handleApiError(error, "de la suppression du match");
    return false;
  }
};
