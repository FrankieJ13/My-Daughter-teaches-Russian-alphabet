import LetterCard from '../components/LetterCard.jsx';
import { alphabet } from '../data/alphabet.js';
import { readProgress } from '../utils.js';

export default function AlphabetPage() {
  const progress = readProgress();

  return (
    <section>
      <div className="page-heading">
        <h1>Буквы</h1>
        <p>Нажми на карточку, чтобы познакомиться с буквой.</p>
      </div>
      <div className="alphabet-grid">
        {alphabet.map((item) => (
          <LetterCard key={item.letter} item={item} progress={progress[item.letter] || 0} />
        ))}
      </div>
    </section>
  );
}
