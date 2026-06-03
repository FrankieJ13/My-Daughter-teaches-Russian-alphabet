import BigButton from '../components/BigButton.jsx';
import { alphabet } from '../data/alphabet.js';
import { readProgress } from '../utils.js';

export default function HomePage() {
  const progress = readProgress();
  const learned = alphabet.filter((item) => (progress[item.letter] || 0) >= 3).length;

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
    </section>
  );
}
