import Link from 'next/link';
import { categories } from '@/lib/data';
import { Card } from '@/components/ui/card';

export function CategoryBrowser() {
  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold">
        Explore by Category
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              href={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
              key={category.name}
            >
              <Card className="flex aspect-square flex-col items-center justify-center gap-3 p-6 transition-all hover:-translate-y-1 hover:bg-primary/5 hover:shadow-md">
                <Icon className="h-10 w-10 text-primary" />
                <span className="text-center font-semibold">
                  {category.name}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
