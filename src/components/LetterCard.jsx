import { Link } from 'react-router-dom';
import AudioButton from './AudioButton.jsx';
import ProgressStars from './ProgressStars.jsx';

export default function LetterCard({ item, progress = 0 }) {
  return (
    <article className="letter-card" style={{ '--card-color': item.color }}>
      <Link to={`/letter/${item.letter}`} className="letter-card__main">
        <span className="letter-card__emoji" aria-hidden="true">{item.emoji}</span>
        <span className="letter-card__letter">{item.letter}{item.lower}</span>
        <span className="letter-card__word">{item.word}</span>
      </Link>
      <div className="letter-card__footer">
        <ProgressStars value={progress} />
        <AudioButton text={`${item.letter}. ${item.word}`} label="Звук" />
      </div>
    </article>
  );
}
