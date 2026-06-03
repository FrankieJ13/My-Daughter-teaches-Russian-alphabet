export default function ProgressStars({ value = 0 }) {
  return (
    <div className="stars" aria-label={`Звёзд: ${value} из 3`}>
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= value ? 'star star--active' : 'star'}>
          ★
        </span>
      ))}
    </div>
  );
}
