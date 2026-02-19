import { notFound } from 'next/navigation';
import Image from 'next/image';
import { articles, authors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArticleContent } from '@/components/article-content';
import { format } from 'date-fns';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  const author = authors.find((a) => a.id === article.authorId);
  const image = PlaceHolderImages.find((img) => img.id === article.imageId);

  if (!author || !image) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={image.imageHint}
          />
        </div>

        <Badge variant="secondary" className="mb-4">
          {article.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-lg">
                {author.name}
              </p>
              <p className="text-sm">
                Pre-retirement: {author.preRetirementCareer}
              </p>
            </div>
          </div>
          <span>&middot;</span>
          <time dateTime={article.createdAt}>
            {format(new Date(article.createdAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      <ArticleContent content={article.content} />
    </article>
  );
}
