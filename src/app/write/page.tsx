'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SaveStatus = '저장됨' | '저장 중...' | '저장되지 않음';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('저장됨');
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold font-headline">
          당신의 이야기를 공유하세요
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {saveStatus === '저장 중...' && (
              <LoaderCircle className="animate-spin h-4 w-4" />
            )}
            <span>{saveStatus}</span>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            게시하기
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Input
          placeholder="게시물 제목..."
          className="text-3xl font-bold h-auto p-2 border-none focus-visible:ring-0 shadow-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="relative">
          <Textarea
            placeholder="당신의 이야기를 들려주세요..."
            className="min-h-[60vh] text-lg border-none focus-visible:ring-0 shadow-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="outline"
            size="lg"
            className="absolute bottom-8 right-8 bg-background/80 backdrop-blur-sm"
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
