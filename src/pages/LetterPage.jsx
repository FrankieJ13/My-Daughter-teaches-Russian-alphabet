import { Link, useParams } from 'react-router-dom';
import AudioButton from '../components/AudioButton.jsx';
import BigButton from '../components/BigButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet, getLetterBySymbol } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { makeLetterOptions, shuffle } from '../utils.js';
import { useMemo, useState } from 'react';

export default function LetterPage() {
  const { letter } = useParams();
  const item = getLetterBySymbol(letter || '') || alphabet[0];
  const { recordAttempt, starsFor } = useProgress();
  const progress = starsFor(item.letter);
  const index = alphabet.findIndex((entry) => entry.letter === item.letter);
  const next = alphabet[(index + 1) % alphabet.length];
  const [answered, setAnswered] = useState(false);
  const [message, setMessage] = useState('Сначала послушай букву, потом найди её ниже.');
  const checkOptions = useMemo(() => makeLetterOptions(item, { count: 3 }), [item]);

  const choose = (choice) => {
    if (answered) {
      return;
    }

    if (choice.letter === item.letter) {
      recordAttempt(item.letter, { correct: true, firstTry: true });
      setAnswered(true);
      setMessage(`Верно. ${item.letter} — это ${item.word}. Звук ${item.phoneme}.`);
    } else {
      recordAttempt(item.letter, { correct: false });
      setMessage(`${choice.letter} — другая буква. ${item.hint}`);
    }
  };

  return (
    <section className="letter-page">
      <Link to="/alphabet" className="back-link">← Все буквы</Link>
      <div className="letter-focus" style={{ '--focus-color': item.color }}>
        <span className="letter-focus__emoji" aria-hidden="true">{item.emoji}</span>
        <h1>{item.letter} {item.lower}</h1>
        <p>{item.letter} — как в слове «{item.word}». Звук: {item.phoneme}.</p>
        <p className="syllables">Слоги: {shuffle(item.syllables).join(' · ')}</p>
        <ProgressStars value={progress} />
        <AudioButton text={`Буква ${item.letter}. Звук ${item.phoneme}. ${item.word}. ${item.hint}`} label="Послушать букву" />
      </div>
      <div className="mini-check">
        <h2>Проверка</h2>
        <p>{message}</p>
        <div className="option-grid">
          {checkOptions.map((option) => (
            <button key={option.letter} type="button" className="letter-option" onClick={() => choose(option)}>
              {option.letter}
            </button>
          ))}
        </div>
      </div>
      <div className="actions">
        <BigButton to={`/letter/${next.letter}`} variant="sunny">Следующая буква</BigButton>
      </div>
    </section>
  );
}
