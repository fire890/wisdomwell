'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved'); // Saved, Saving, Unsaved
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (title || content) {
      setSaveStatus('Unsaved');
      timeoutRef.current = setTimeout(() => {
        setSaveStatus('Saving...');
        setTimeout(() => {
          setSaveStatus('Saved');
        }, 1000);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content]);

  const handleRefine = () => {
    toast({
      title: 'AI Refinement',
      description: 'This feature is coming soon!',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold font-headline">Share Your Story</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {saveStatus === 'Saving...' && (
              <LoaderCircle className="animate-spin h-4 w-4" />
            )}
            <span>{saveStatus}</span>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Input
          placeholder="Article Title..."
          className="text-3xl font-bold h-auto p-2 border-none focus-visible:ring-0 shadow-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="relative">
          <Textarea
            placeholder="Tell your story..."
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
            Refine with AI
          </Button>
        </div>
      </div>
    </div>
  );
}
