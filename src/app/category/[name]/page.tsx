import { notFound } from 'next/navigation';
import { articles, authors, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/data';

export default function CategoryPage({ params }: { params: { name: string } }) {
  const category = categories.find(
    (c) => c.name.toLowerCase().replace(' ', '-') === params.name
  );

  if (!category) {
    notFound();
  }

  const articlesInCategory = articles.filter(
    (article) => article.category === category.name
  );

  const getArticleData = (article: Article) => {
    const author = authors.find((a) => a.id === article.authorId);
    const image = PlaceHolderImages.find((img) => img.id === article.imageId);
    return { ...article, author, image };
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2 font-headline">
          {category.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {articlesInCategory.length} articles in this category
        </p>
      </header>

      {articlesInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesInCategory.map((article) => (
            <ArticleCard
              key={article.id}
              article={getArticleData(article)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-12">
          No articles found in this category yet.
        </p>
      )}
    </div>
  );
}
