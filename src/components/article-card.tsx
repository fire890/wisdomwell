import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Article, Author } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ArticleCardProps {
  article: Partial<Article> & { author?: Author; image?: ImagePlaceholder };
}

export function ArticleCard({ article }: ArticleCardProps) {
  if (!article.id || !article.author || !article.image || !article.content) {
    return null;
  }

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.image.imageUrl}
              alt={article.image.description}
              fill
              className="object-cover"
              data-ai-hint={article.image.imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 p-6">
          <Badge variant="secondary">{article.category}</Badge>
          <CardTitle className="line-clamp-2 text-xl font-bold leading-snug">
            {article.title}
          </CardTitle>
          <p className="line-clamp-3 text-base text-muted-foreground">
            {article.content.split('\n\n')[0]}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={article.author.avatarUrl}
                alt={article.author.name}
              />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {article.author.preRetirementCareer}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
