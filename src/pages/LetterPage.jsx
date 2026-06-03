import { Link, useParams } from 'react-router-dom';
import AudioButton from '../components/AudioButton.jsx';
import BigButton from '../components/BigButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet, getLetterBySymbol } from '../data/alphabet.js';
import { addProgress, readProgress } from '../utils.js';

export default function LetterPage() {
  const { letter } = useParams();
  const item = getLetterBySymbol(letter || '') || alphabet[0];
  const progress = readProgress()[item.letter] || 0;
  const index = alphabet.findIndex((entry) => entry.letter === item.letter);
  const next = alphabet[(index + 1) % alphabet.length];

  const handleRemember = () => {
    addProgress(item.letter, 1);
    window.location.reload();
  };

  return (
    <section className="letter-page">
      <Link to="/alphabet" className="back-link">← Все буквы</Link>
      <div className="letter-focus" style={{ '--focus-color': item.color }}>
        <span className="letter-focus__emoji" aria-hidden="true">{item.emoji}</span>
        <h1>{item.letter} {item.lower}</h1>
        <p>{item.letter} — как в слове «{item.word}»</p>
        <ProgressStars value={progress} />
        <AudioButton text={`${item.letter}. ${item.word}`} label="Послушать букву" />
      </div>
      <div className="actions">
        <BigButton onClick={handleRemember}>Я запомнил</BigButton>
        <BigButton to={`/letter/${next.letter}`} variant="sunny">Следующая буква</BigButton>
      </div>
    </section>
  );
}
