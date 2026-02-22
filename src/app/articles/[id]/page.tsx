'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import Image from 'next/image';
import { articles as staticArticles, authors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { ArticleContent } from '@/components/article-content';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { database } from '@/lib/firebase';
import { ref, get, child, remove } from 'firebase/database'; // Import remove
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { onAuthStateChange } from '@/lib/auth'; // Import onAuthStateChange
import type { Article } from '@/lib/data';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter(); // Initialize useRouter
  const { toast } = useToast(); // Initialize useToast
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null); // State for current user

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 1. 먼저 정적 데이터에서 찾기
    const staticArticle = staticArticles.find((a) => a.id === params.id);
    if (staticArticle) {
      setArticle(staticArticle);
      setLoading(false);
      return;
    }

    // 2. 없으면 Firebase에서 찾기
    const dbRef = ref(database);
    get(child(dbRef, `articles`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const found = Object.values(data).find((a: any) => a.id === params.id) as Article;
          if (found) {
            setArticle(found);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [params.id]);

  const handleDelete = async () => {
    if (!currentUser || !article || currentUser.uid !== article.authorId) {
      toast({
        title: "권한 없음",
        description: "게시글을 삭제할 권한이 없습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await remove(ref(database, `articles/${article.id}`));
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "오류 발생",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-20 text-center">로딩 중...</div>;
  }

  if (!article) {
    notFound();
  }

  const author = authors.find((a) => a.id === article.authorId) || authors[0];
  const image = PlaceHolderImages.find((img) => img.id === article.imageId) || PlaceHolderImages[0];

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Badge variant="secondary" className="mb-4">
          {article.category}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
          {article.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-base md:text-lg">
                {author.name}
              </p>
              <p className="text-xs md:text-sm">
                은퇴 전 직업: {author.preRetirementCareer}
              </p>
            </div>
          </div>
          <div className="hidden md:block"><span>&middot;</span></div>
          <time dateTime={article.createdAt} className="text-sm md:text-base">
            {format(new Date(article.createdAt), 'yyyy년 M월 d일', {
              locale: ko,
            })}
          </time>
          {currentUser && currentUser.uid === article.authorId && (
            <Button variant="destructive" onClick={handleDelete} className="ml-auto">
              삭제
            </Button>
          )}
        </div>
      </header>

      <ArticleContent content={article.content} />
    </article>
  );
}
