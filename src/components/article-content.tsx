'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const [fontSize, setFontSize] = useState(20);

  const increaseSize = () => setFontSize((size) => Math.min(size + 2, 32));
  const decreaseSize = () => setFontSize((size) => Math.max(size - 2, 14));

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground">글자 크기:</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decreaseSize}
          aria-label="글자 크기 줄이기"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increaseSize}
          aria-label="글자 크기 키우기"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="space-y-6"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
      >
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
