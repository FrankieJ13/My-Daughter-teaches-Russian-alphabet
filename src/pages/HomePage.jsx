import BigButton from '../components/BigButton.jsx';
import { alphabet } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { getLearningSummary } from '../utils.js';

export default function HomePage() {
  const { progress } = useProgress();
  const { learned, practice } = getLearningSummary(progress);
  const practiceText = practice.map((item) => item.letter).join(', ');

  return (
    <section className="home">
      <div className="hero">
        <p className="hero__emoji" aria-hidden="true">🍎</p>
        <h1>Азбука-игра</h1>
        <p>Учимся узнавать русские буквы, слушать их и играть со словами.</p>
      </div>
      <div className="actions">
        <BigButton to="/alphabet">Учить буквы</BigButton>
        <BigButton to="/games" variant="sunny">Играть</BigButton>
        <BigButton to="/progress" variant="soft">Мои успехи: {learned} из {alphabet.length}</BigButton>
      </div>
      <div className="learning-note">
        <strong>Сегодня повторяем:</strong> {practiceText || 'все буквы изучены'}
      </div>
    </section>
  );
}
