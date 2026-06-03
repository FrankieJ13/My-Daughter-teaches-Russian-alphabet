import BigButton from '../components/BigButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet } from '../data/alphabet.js';
import { readProgress, resetProgress } from '../utils.js';

export default function ProgressPage() {
  const progress = readProgress();
  const totalStars = alphabet.reduce((sum, item) => sum + (progress[item.letter] || 0), 0);

  const handleReset = () => {
    resetProgress();
    window.location.reload();
  };

  return (
    <section>
      <div className="page-heading">
        <h1>Мои успехи</h1>
        <p>Собрано звёзд: {totalStars} из {alphabet.length * 3}</p>
      </div>
      <div className="progress-list">
        {alphabet.map((item) => (
          <div key={item.letter} className="progress-row">
            <span className="progress-row__letter">{item.letter}</span>
            <span className="progress-row__word">{item.emoji} {item.word}</span>
            <ProgressStars value={progress[item.letter] || 0} />
          </div>
        ))}
      </div>
      <div className="actions">
        <BigButton onClick={handleReset} variant="soft">Сбросить прогресс</BigButton>
      </div>
    </section>
  );
}
