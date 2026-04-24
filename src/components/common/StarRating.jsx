import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <span key={i} className="relative">
            <Star
              size={size}
              className="text-slate-200 dark:text-slate-700 fill-current"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={size} className="text-amber-400 fill-current" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
