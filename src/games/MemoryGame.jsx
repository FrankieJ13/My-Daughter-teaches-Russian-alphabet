import { useMemo, useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import { alphabet } from '../data/alphabet.js';
import { addProgress, shuffle } from '../utils.js';

const makeCards = () => {
  const picked = shuffle(alphabet.filter((item) => !['Ъ', 'Ь'].includes(item.letter))).slice(0, 4);
  return shuffle(picked.flatMap((item) => [
    { id: `${item.letter}-letter`, pair: item.letter, label: item.letter, type: 'letter' },
    { id: `${item.letter}-emoji`, pair: item.letter, label: item.emoji, type: 'emoji' }
  ]));
};

export default function MemoryGame() {
  const [cards, setCards] = useState(makeCards);
  const [openIds, setOpenIds] = useState([]);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState('Открой две карточки: букву и картинку.');

  const openCards = useMemo(() => cards.filter((card) => openIds.includes(card.id)), [cards, openIds]);

  const reset = () => {
    setCards(makeCards());
    setOpenIds([]);
    setMatched([]);
    setMessage('Открой две карточки: букву и картинку.');
  };

  const choose = (card) => {
    if (matched.includes(card.pair) || openIds.includes(card.id) || openIds.length === 2) {
      return;
    }

    const nextOpenIds = [...openIds, card.id];
    setOpenIds(nextOpenIds);

    if (nextOpenIds.length === 2) {
      const pair = cards.filter((item) => nextOpenIds.includes(item.id));
      if (pair[0].pair === pair[1].pair && pair[0].type !== pair[1].type) {
        addProgress(pair[0].pair, 1);
        setMatched((current) => [...current, pair[0].pair]);
        setMessage('Пара найдена!');
        setTimeout(() => setOpenIds([]), 650);
      } else {
        setMessage('Не пара. Попробуй другие карточки.');
        setTimeout(() => setOpenIds([]), 900);
      }
    }
  };

  return (
    <div className="game-card">
      <h2>Пары буква-картинка</h2>
      <div className="memory-grid">
        {cards.map((card) => {
          const isVisible = openIds.includes(card.id) || matched.includes(card.pair);
          return (
            <button
              key={card.id}
              type="button"
              className={isVisible ? 'memory-card memory-card--open' : 'memory-card'}
              onClick={() => choose(card)}
            >
              {isVisible ? card.label : '?'}
            </button>
          );
        })}
      </div>
      <p className="game-message">
        {matched.length === 4 ? 'Все пары найдены!' : message}
      </p>
      {openCards.length === 2 && <span className="sr-only">Открыто две карточки</span>}
      <BigButton onClick={reset} variant="soft">Новая игра</BigButton>
    </div>
  );
}
