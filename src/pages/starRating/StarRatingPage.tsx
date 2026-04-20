import StarRating from './StarRating';

function StarRatingDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a star rating widget. Render N stars as buttons, track both the selected count and
        the hovered count separately, and apply four distinct visual states: selected, not selected,
        selected-hovered, and not-selected-hovered.
      </p>
      <StarRating maxStars={5} initialSelection={2} />
    </div>
  );
}

export default StarRatingDemo;
