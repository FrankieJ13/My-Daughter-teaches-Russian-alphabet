import LetterCard from '../components/LetterCard.jsx';
import { alphabet } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';

export default function AlphabetPage() {
  const { starsFor } = useProgress();

  return (
    <section>
      <div className="page-heading">
        <h1>Буквы</h1>
        <p>Нажми на карточку, чтобы познакомиться с буквой.</p>
      </div>
      <div className="alphabet-grid">
        {alphabet.map((item) => (
          <LetterCard key={item.letter} item={item} progress={starsFor(item.letter)} />
        ))}
      </div>
    </section>
  );
}
