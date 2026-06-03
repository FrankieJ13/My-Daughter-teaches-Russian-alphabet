import { Link, useParams } from 'react-router-dom';
import AudioButton from '../components/AudioButton.jsx';
import BigButton from '../components/BigButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet, getLetterBySymbol } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { makeLetterOptions, shuffle, speak } from '../utils.js';
import { useMemo, useState } from 'react';

const initialCheckMessage = 'Сначала послушай букву, потом найди её ниже.';
const maxMistakesBeforeHelp = 2;

function LetterCheck({ item, next, recordAttempt }) {
  const [answered, setAnswered] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState(initialCheckMessage);
  const [status, setStatus] = useState('idle');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const checkOptions = useMemo(() => makeLetterOptions(item, { count: 3 }), [item]);
  const canContinue = answered || status === 'help';

  const choose = (choice) => {
    if (canContinue) {
      return;
    }

    setSelectedLetter(choice.letter);

    if (choice.letter === item.letter) {
      recordAttempt(item.letter, { correct: true, firstTry: mistakes === 0 });
      setAnswered(true);
      setStatus('correct');
      setMessage(`Верно. ${item.letter} — это ${item.word}. Звук ${item.phoneme}.`);
      speak(`Да! Это буква ${item.letter}. ${item.word}.`);
    } else {
      const nextMistakes = mistakes + 1;
      recordAttempt(item.letter, { correct: false });
      setMistakes(nextMistakes);

      if (nextMistakes >= maxMistakesBeforeHelp) {
        setStatus('help');
        setMessage(`Смотри: правильная буква ${item.letter}. ${item.hint}`);
        speak(`Смотри. Правильная буква ${item.letter}.`);
      } else {
        setStatus('wrong');
        setMessage(`${choice.letter} — другая буква. ${item.hint}`);
        speak(`Нет. Попробуй ещё. Ищи букву ${item.letter}.`);
      }
    }
  };

  const getOptionClassName = (option) => {
    if ((status === 'correct' || status === 'help') && option.letter === item.letter) {
      return 'letter-option letter-option--correct';
    }

    if (status === 'wrong' && selectedLetter === option.letter) {
      return 'letter-option letter-option--wrong';
    }

    return 'letter-option';
  };

  return (
    <div className={`mini-check mini-check--${status}`}>
      <div className="check-status" aria-live="polite">
        <span className="check-status__icon" aria-hidden="true">
          {status === 'correct' ? '✓' : status === 'wrong' ? '!' : status === 'help' ? item.letter : '👂'}
        </span>
        <p>{message}</p>
      </div>
      <div className="option-grid">
        {checkOptions.map((option) => (
          <button
            key={option.letter}
            type="button"
            className={getOptionClassName(option)}
            onClick={() => choose(option)}
            disabled={canContinue}
          >
            {option.letter}
          </button>
        ))}
      </div>
      <div className="actions actions--compact">
        <BigButton to={`/letter/${next.letter}`} variant={canContinue ? 'sunny' : 'soft'} disabled={!canContinue}>
          {canContinue ? 'Дальше' : 'Сначала выбери букву'}
        </BigButton>
      </div>
    </div>
  );
}

export default function LetterPage() {
  const { letter } = useParams();
  const item = getLetterBySymbol(letter || '') || alphabet[0];
  const { recordAttempt, starsFor } = useProgress();
  const progress = starsFor(item.letter);
  const index = alphabet.findIndex((entry) => entry.letter === item.letter);
  const next = alphabet[(index + 1) % alphabet.length];
  const syllables = useMemo(() => shuffle(item.syllables).join(' · '), [item]);

  return (
    <section className="letter-page">
      <Link to="/alphabet" className="back-link">← Все буквы</Link>
      <div className="letter-focus" style={{ '--focus-color': item.color }}>
        <span className="letter-focus__emoji" aria-hidden="true">{item.emoji}</span>
        <h1>{item.letter} {item.lower}</h1>
        <p>{item.letter} — как в слове «{item.word}». Звук: {item.phoneme}.</p>
        <p className="syllables">Слоги: {syllables}</p>
        <ProgressStars value={progress} />
        <AudioButton text={`Буква ${item.letter}. Звук ${item.phoneme}. ${item.word}. ${item.hint}`} label="Послушать букву" />
      </div>
      <LetterCheck key={item.letter} item={item} next={next} recordAttempt={recordAttempt} />
    </section>
  );
}
