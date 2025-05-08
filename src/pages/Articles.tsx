
import { ArticlesList } from "@/components/articles/ArticlesList";
import { ArticlesChart } from "@/components/articles/ArticlesChart";

const Articles = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
        <p className="text-gray-500 mt-1">
          Gérez les articles et consultez les statistiques
        </p>
      </div>
      
      <ArticlesList />
      <ArticlesChart />
    </div>
  );
};

export default Articles;
