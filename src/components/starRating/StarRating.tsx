import { useMemo, useState } from 'react';
import styles from './StarRating.module.css';

type StarRatingProps = {
  maxStars: number;
  initialSelection: number;
};

function clampSelection(value: number, maxStars: number) {
  return Math.min(Math.max(0, Math.floor(value)), maxStars);
}

function StarRating({ maxStars, initialSelection }: StarRatingProps) {
  const normalizedMaxStars = Math.max(1, Math.floor(maxStars));
  const normalizedInitialSelection = clampSelection(initialSelection, normalizedMaxStars);

  const [selectedCount, setSelectedCount] = useState(normalizedInitialSelection);
  const [hoveredCount, setHoveredCount] = useState<number | null>(null);

  const stars = useMemo(
    () => Array.from({ length: normalizedMaxStars }, (_, index) => index + 1),
    [normalizedMaxStars],
  );

  return (
    <div className={styles.container} onMouseLeave={() => setHoveredCount(null)}>
      {stars.map((starNumber) => {
        const isSelected = starNumber <= selectedCount;
        const isHovered = hoveredCount !== null && starNumber <= hoveredCount;

        const stateClassName = isHovered
          ? isSelected
            ? styles.starSelectedHover
            : styles.starNotSelectedHover
          : isSelected
            ? styles.starSelected
            : styles.starNotSelected;

        return (
          <button
            key={starNumber}
            type="button"
            className={`${styles.star} ${stateClassName}`}
            onClick={() => setSelectedCount(starNumber)}
            onMouseEnter={() => setHoveredCount(starNumber)}
            aria-label={`Rate ${starNumber} out of ${normalizedMaxStars}`}
            aria-pressed={isSelected}
          >
            ★
          </button>
        );
      })}
      <span className={styles.value}>{selectedCount} / {normalizedMaxStars}</span>
    </div>
  );
}

export default StarRating;