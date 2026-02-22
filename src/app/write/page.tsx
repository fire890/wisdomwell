'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/lib/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { categories } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { onAuthStateChange } from '@/lib/auth'; // Import onAuthStateChange

type SaveStatus = '저장됨' | '저장 중...' | '저장되지 않음';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('저장됨');
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setLoadingAuth(false);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (title || content) {
      setSaveStatus('저장되지 않음');
      timeoutRef.current = setTimeout(() => {
        setSaveStatus('저장 중...');
        setTimeout(() => {
          setSaveStatus('저장됨');
        }, 1000);
      }, 2000);
    } else {
      setSaveStatus('저장됨');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content]);

  const handleRefine = () => {
    toast({
      title: 'AI 글 다듬기',
      description: '이 기능은 곧 제공될 예정입니다!',
    });
  };

  const handlePublish = async () => {
    if (!currentUser) {
      toast({
        title: '인증 필요',
        description: '글을 작성하려면 로그인해야 합니다.',
        variant: 'destructive',
      });
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: '입력 오류',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    try {
      const articlesRef = ref(database, 'articles');
      const newArticleRef = push(articlesRef);
      
      const newArticle = {
        id: newArticleRef.key,
        title,
        content,
        category,
        authorId: currentUser.uid, // Use actual author ID
        imageId: `img${Math.floor(Math.random() * 6) + 1}`, // 임시 이미지 ID
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        trending: false,
      };

      await set(newArticleRef, newArticle);

      toast({
        title: '게시 완료',
        description: '글이 성공적으로 저장되었습니다.',
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error publishing article:', error);
      toast({
        title: '오류 발생',
        description: '글을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (loadingAuth) {
    return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
  }

  // If currentUser is null, useEffect will redirect to /login, so this part won't be reached for unauthenticated users
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          당신의 이야기를 공유하세요
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            {saveStatus === '저장 중...' && (
              <LoaderCircle className="animate-spin h-4 w-4" />
            )}
            <span>{saveStatus}</span>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? '게시 중...' : '게시하기'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="게시물 제목..."
            className="text-2xl md:text-3xl font-bold h-auto p-2 border-none focus-visible:ring-0 shadow-none flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Textarea
            placeholder="당신의 이야기를 들려주세요..."
            className="min-h-[50vh] text-lg border-none focus-visible:ring-0 shadow-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="outline"
            size="lg"
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-background/80 backdrop-blur-sm"
            onClick={handleRefine}
          >
            <Wand2 className="mr-2 h-5 w-5" />
            AI로 다듬기
          </Button>
        </div>
      </div>
    </div>
  );
}
