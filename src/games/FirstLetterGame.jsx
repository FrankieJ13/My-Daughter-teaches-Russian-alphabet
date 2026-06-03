import { useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import AudioButton from '../components/AudioButton.jsx';
import { alphabet } from '../data/alphabet.js';
import { addProgress, shuffle } from '../utils.js';

const makeRound = () => {
  const answer = shuffle(alphabet.filter((item) => !['Ъ', 'Ь', 'Ы'].includes(item.letter)))[0];
  const options = shuffle([answer, ...shuffle(alphabet.filter((item) => item.letter !== answer.letter)).slice(0, 3)]);
  return { answer, options };
};

export default function FirstLetterGame() {
  const [round, setRound] = useState(makeRound);
  const [message, setMessage] = useState('Какая буква первая?');

  const choose = (item) => {
    if (item.letter === round.answer.letter) {
      addProgress(item.letter, 1);
      setMessage('Да! Слово начинается с этой буквы.');
    } else {
      setMessage('Попробуй ещё раз. Послушай слово внимательно.');
    }
  };

  return (
    <div className="game-card">
      <h2>Первая буква</h2>
      <div className="word-prompt">
        <span aria-hidden="true">{round.answer.emoji}</span>
        <strong>{round.answer.word}</strong>
      </div>
      <AudioButton text={round.answer.word} label="Послушать слово" />
      <div className="option-grid">
        {round.options.map((item) => (
          <button key={item.letter} type="button" className="letter-option" onClick={() => choose(item)}>
            {item.letter}
          </button>
        ))}
      </div>
      <p className="game-message">{message}</p>
      <BigButton onClick={() => { setRound(makeRound()); setMessage('Какая буква первая?'); }} variant="soft">
        Новое слово
      </BigButton>
    </div>
  );
}
