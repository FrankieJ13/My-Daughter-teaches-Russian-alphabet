import { useMemo, useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import { alphabet } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { pickLearningLetter, shuffle } from '../utils.js';

const playable = alphabet.filter((item) => !['Ъ', 'Ь'].includes(item.letter));

const pickMemoryLetters = (progress) => {
  const picked = [];
  while (picked.length < 4) {
    const next = pickLearningLetter({ progress, pool: playable, exclude: picked.map((item) => item.letter) });
    picked.push(next);
  }
  return picked;
};

const makeCards = (progress) => {
  const picked = pickMemoryLetters(progress);
  return shuffle(picked.flatMap((item) => [
    { id: `${item.letter}-letter`, pair: item.letter, label: item.letter, type: 'letter' },
    { id: `${item.letter}-emoji`, pair: item.letter, label: item.emoji, word: item.word, type: 'emoji' }
  ]));
};

export default function MemoryGame() {
  const { progress, recordAttempt } = useProgress();
  const [cards, setCards] = useState(() => makeCards(progress));
  const [openIds, setOpenIds] = useState([]);
  const [matched, setMatched] = useState([]);
  const [pairMistakes, setPairMistakes] = useState({});
  const [message, setMessage] = useState('Открой две карточки: букву и картинку.');
  const [messageStatus, setMessageStatus] = useState('idle');

  const openCards = useMemo(() => cards.filter((card) => openIds.includes(card.id)), [cards, openIds]);

  const reset = () => {
    setCards(makeCards(progress));
    setOpenIds([]);
    setMatched([]);
    setPairMistakes({});
    setMessage('Открой две карточки: букву и картинку.');
    setMessageStatus('idle');
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
        const wordCard = pair.find((item) => item.word);
        recordAttempt(pair[0].pair, { correct: true, firstTry: !pairMistakes[pair[0].pair] });
        setMatched((current) => [...current, pair[0].pair]);
        setMessage(`Пара найдена: ${pair[0].pair} — ${wordCard?.word || 'слово'}.`);
        setMessageStatus('correct');
        setTimeout(() => setOpenIds([]), 650);
      } else {
        recordAttempt(pair[0].pair, { correct: false });
        recordAttempt(pair[1].pair, { correct: false });
        setPairMistakes((current) => ({
          ...current,
          [pair[0].pair]: true,
          [pair[1].pair]: true
        }));
        setMessage(`Не пара: ${pair[0].label} и ${pair[1].label}. Ищем букву с её картинкой.`);
        setMessageStatus('wrong');
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
      <p className={`game-message game-message--${matched.length === 4 ? 'correct' : messageStatus}`}>
        {matched.length === 4 ? 'Все пары найдены!' : message}
      </p>
      {openCards.length === 2 && <span className="sr-only">Открыто две карточки</span>}
      <BigButton onClick={reset} variant="soft">Новая игра</BigButton>
    </div>
  );
}
