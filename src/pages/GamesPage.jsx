import { useState } from 'react';
import FindLetterGame from '../games/FindLetterGame.jsx';
import FirstLetterGame from '../games/FirstLetterGame.jsx';
import MemoryGame from '../games/MemoryGame.jsx';

const games = {
  find: { title: 'Найди букву', component: <FindLetterGame /> },
  first: { title: 'Первая буква', component: <FirstLetterGame /> },
  memory: { title: 'Пары', component: <MemoryGame /> }
};

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState('find');

  return (
    <section>
      <div className="page-heading">
        <h1>Игры</h1>
        <p>Игра чаще даёт буквы, которые пока требуют повторения.</p>
      </div>
      <div className="game-tabs" role="tablist" aria-label="Игры">
        {Object.entries(games).map(([key, game]) => (
          <button
            key={key}
            type="button"
            className={activeGame === key ? 'game-tab game-tab--active' : 'game-tab'}
            onClick={() => setActiveGame(key)}
          >
            {game.title}
          </button>
        ))}
      </div>
      {games[activeGame].component}
    </section>
  );
}
