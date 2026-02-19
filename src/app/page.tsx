import { ArticleCard } from '@/components/article-card';
import { CategoryBrowser } from '@/components/category-browser';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { articles, authors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import type { Article } from '@/lib/data';

export default function Home() {
  const recentArticles = [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const trendingArticles = articles.filter((a) => a.trending);

  const getArticleData = (article: Article) => {
    const author = authors.find((a) => a.id === article.authorId);
    const image = PlaceHolderImages.find((img) => img.id === article.imageId);
    return { ...article, author, image };
  };

  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4 font-headline">
          지혜를 나누고, 통찰력을 얻으세요.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground mb-8">
          삶의 경험과 교훈을 공유하는 커뮤니티. 세대의 지식을 읽고, 쓰고,
          연결하세요.
        </p>
        <Button
          size="lg"
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/write">당신의 지혜를 나눠주세요</Link>
        </Button>
      </section>

      <section>
        <CategoryBrowser />
      </section>

      <section>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="trending">트렌딩</TabsTrigger>
            <TabsTrigger value="recent">최신</TabsTrigger>
          </TabsList>
          <TabsContent value="trending">
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trendingArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={getArticleData(article)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={getArticleData(article)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
