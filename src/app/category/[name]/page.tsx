'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { articles as staticArticles, authors, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/data';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function CategoryPage({ params }: { params: { name: string } }) {
  const [firebaseArticles, setFirebaseArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedName = decodeURIComponent(params.name);
  const category = categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, '-') === decodedName || c.name === decodedName
  );

  useEffect(() => {
    if (!category) return;

    const articlesRef = ref(database, 'articles');
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = (Object.values(data) as Article[]).filter(
          (a) => a.category === category.name
        );
        setFirebaseArticles(list);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  useEffect(() => {
    if (!category) return;
    
    const staticFiltered = staticArticles.filter(
      (article) => article.category === category.name
    );
    const merged = [...staticFiltered, ...firebaseArticles].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAllArticles(merged);
  }, [firebaseArticles, category]);

  if (!category) {
    notFound();
  }

  const getArticleData = (article: Article) => {
    const author = authors.find((a) => a.id === article.authorId) || authors[0];
    const image = PlaceHolderImages.find((img) => img.id === article.imageId) || PlaceHolderImages[0];
    return { ...article, author, image };
  };

  return (
    <div className="space-y-8 px-4">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 font-headline">
          {category.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {loading ? '불러오는 중...' : `이 카테고리에 ${allArticles.length}개의 게시물이 있습니다`}
        </p>
      </header>

      {allArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={getArticleData(article)}
            />
          ))}
        </div>
      ) : !loading && (
        <p className="text-center text-muted-foreground mt-12">
          이 카테고리에는 아직 게시물이 없습니다.
        </p>
      )}
    </div>
  );
}
