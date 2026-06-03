import BigButton from '../components/BigButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { getLearningSummary, getLetterProgress } from '../utils.js';

export default function ProgressPage() {
  const { progress, reset, starsFor } = useProgress();
  const { totalStars, practice } = getLearningSummary(progress);

  return (
    <section>
      <div className="page-heading">
        <h1>Мои успехи</h1>
        <p>Собрано звёзд: {totalStars} из {alphabet.length * 3}</p>
        <p>Буквы для повторения: {practice.map((item) => item.letter).join(', ') || 'пока нет'}</p>
      </div>
      <div className="progress-list">
        {alphabet.map((item) => {
          const stats = getLetterProgress(progress, item.letter);
          return (
            <div key={item.letter} className="progress-row">
              <span className="progress-row__letter">{item.letter}</span>
              <span className="progress-row__word">{item.emoji} {item.word}</span>
              <span className="progress-row__stats">{stats.correct}/{stats.attempts || 0}</span>
              <ProgressStars value={starsFor(item.letter)} />
            </div>
          );
        })}
      </div>
      <div className="actions">
        <BigButton onClick={reset} variant="soft">Сбросить прогресс</BigButton>
      </div>
    </section>
  );
}
