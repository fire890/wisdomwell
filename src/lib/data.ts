import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  HeartPulse,
  Users,
  Paintbrush,
} from 'lucide-react';

export type Author = {
  id: string;
  name: string;
  avatarUrl: string;
  preRetirementCareer: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  imageId: string;
  createdAt: string;
  trending: boolean;
};

export type Category = {
  name:string;
  icon: LucideIcon;
};

export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'Eleanor Vance',
    avatarUrl: 'https://picsum.photos/seed/a1/100/100',
    preRetirementCareer: 'Librarian',
  },
  {
    id: 'author-2',
    name: 'Marcus Thorne',
    avatarUrl: 'https://picsum.photos/seed/a2/100/100',
    preRetirementCareer: 'History Professor',
  },
  {
    id: 'author-3',
    name: 'Isabella Rossi',
    avatarUrl: 'https://picsum.photos/seed/a3/100/100',
    preRetirementCareer: 'Chef & Restaurateur',
  },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Quiet Joy of a Well-Organized Bookshelf',
    content: `There is a profound satisfaction that comes from arranging books not just for storage, but for discovery. A well-organized bookshelf tells a story... It’s a physical manifestation of your intellectual journey. Each spine is a doorway to another world, another idea. In my years as a librarian, I learned that the best systems are personal. Some prefer alphabetical, others by color, and some, like myself, by the feeling each book evokes. It's a quiet rebellion against the digital chaos, a small corner of the world that is entirely, beautifully, your own.

Paragraphs should be separated by newlines. This allows for better formatting when rendered. This is just a sample of longer content to simulate a real article. The joy of reading is something to be cherished, and how we organize our books can enhance that joy.`,
    authorId: 'author-1',
    category: '삶의 교훈',
    imageId: 'img1',
    createdAt: '2024-05-15T10:00:00Z',
    trending: true,
  },
  {
    id: '2',
    title:
      'Lessons from the Past: What Ancient Rome Can Teach Us About Modern Society',
    content: `History is not a static collection of dates and events; it's a dynamic conversation between the past and the present. As a professor, I often told my students that to understand where we are going, we must first understand where we have been. The rise and fall of Rome, for instance, offers sobering parallels to our own time—issues of wealth inequality, political polarization, and the challenges of maintaining a vast, complex society. By studying these patterns, we arm ourselves with the wisdom to navigate our own turbulent times, hopefully with more success. The past is a mirror, and it is wise to look into it often.

This article can be extended with more historical examples and analysis to provide deeper insights. The goal is to make history relevant and engaging for a modern audience.`,
    authorId: 'author-2',
    category: '경력',
    imageId: 'img2',
    createdAt: '2024-05-14T14:30:00Z',
    trending: true,
  },
  {
    id: '3',
    title: 'The Perfect Recipe is More Than Just Ingredients',
    content: `In my decades of running a kitchen, I discovered that the best meals are born not from rigid recipes, but from intuition, love, and a bit of happy experimentation. A recipe is a guide, a map to a delicious destination, but the journey is where the magic happens. It’s about tasting as you go, understanding how flavors marry, and not being afraid to add a pinch of something unexpected. This philosophy extends beyond the kitchen. Life, too, is not about following a script. It's about savoring the moments, embracing the messes, and creating something uniquely yours. The secret ingredient, in cooking and in life, is always passion.

Food is a universal language. It connects people, evokes memories, and brings comfort. Sharing a meal is one of the most fundamental human experiences.`,
    authorId: 'author-3',
    category: '취미',
    imageId: 'img3',
    createdAt: '2024-05-13T09:00:00Z',
    trending: false,
  },
  {
    id: '4',
    title: 'Building Bridges: The Art of Cross-Generational Friendships',
    content: `In a world that often feels segregated by age, forming friendships with people from different generations is an act of rebellion and a source of immense wisdom. Younger friends keep your perspective fresh and your spirit adventurous, while older friends offer the invaluable gift of hindsight. These relationships are bridges that connect different eras, different experiences, and different ways of seeing the world. They challenge our assumptions and enrich our understanding of the human condition. My advice? Start a conversation. You'll be surprised at how much you have to learn, and how much you have to teach.

These connections can be formed anywhere: in the community, at work, or even within our own families. The key is to be open and curious.`,
    authorId: 'author-1',
    category: '관계',
    imageId: 'img4',
    createdAt: '2024-05-12T11:00:00Z',
    trending: false,
  },
  {
    id: '5',
    title: 'Navigating Your Second Act: A New Career After 50',
    content: `Retirement isn't an end; it's a pivot. For many, it's the first time they have the freedom to pursue work that aligns with their passion rather than their paycheck. My transition from academia to historical consulting was daunting but exhilarating. The key is to leverage your lifetime of experience in new ways. See your skills not as tied to a specific job, but as a versatile toolkit. Don't be afraid to be a beginner again. The humility of learning something new, combined with the confidence of decades of experience, is a powerful combination for success in any "second act" career.

Think of it as a portfolio career, where you can combine different interests and income streams. It's a chance to redefine work on your own terms.`,
    authorId: 'author-2',
    category: '경력',
    imageId: 'img5',
    createdAt: '2024-05-16T08:00:00Z',
    trending: true,
  },
  {
    id: '6',
    title: 'The Simple Power of a Daily Walk',
    content: `We often seek complex solutions for our well-being, overlooking the simple, profound power of a daily walk. It is meditation in motion. With each step, the mind clears, creativity stirs, and the body finds its rhythm. A walk is a conversation with yourself and with the world around you. You notice the changing seasons, the details of your neighborhood, the sky above. In my bustling restaurant life, my morning walk was a non-negotiable sanctuary. It cost nothing, required no special equipment, and yet, it was the most valuable investment I made in my physical and mental health each day.

Try leaving your phone behind. Disconnect to reconnect. The benefits to your mental and physical health are immeasurable.`,
    authorId: 'author-3',
    category: '건강',
    imageId: 'img6',
    createdAt: '2024-05-11T18:00:00Z',
    trending: false,
  },
];

export const categories: Category[] = [
  { name: '삶의 교훈', icon: BookOpen },
  { name: '경력', icon: Briefcase },
  { name: '건강', icon: HeartPulse },
  { name: '관계', icon: Users },
  { name: '취미', icon: Paintbrush },
];
