interface Props {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const SIZES = { sm: 14, md: 18, lg: 28 };

export function RatingStars({ rating, size = 'md', showValue = true }: Props) {
  const px = SIZES[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= rating;
        const half = !filled && i - 0.5 <= rating;
        const gradId = `hg-${size}-${i}`;

        return (
          <svg key={i} width={px} height={px} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#C67B2A" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? '#C67B2A' : half ? `url(#${gradId})` : '#E5E7EB'}
            />
          </svg>
        );
      })}
      {showValue && (
        <span className="text-sm text-gray-500 ml-1 tabular-nums">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
