import { useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import AudioButton from '../components/AudioButton.jsx';
import { alphabet } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import { makeLetterOptions, pickLearningLetter } from '../utils.js';

const playable = alphabet.filter((item) => !['Ъ', 'Ь', 'Ы'].includes(item.letter));

const makeRound = (progress) => {
  const answer = pickLearningLetter({ progress, pool: playable });
  return {
    answer,
    options: makeLetterOptions(answer, { pool: playable }),
    mistakes: 0,
    solved: false
  };
};

export default function FirstLetterGame() {
  const { progress, recordAttempt } = useProgress();
  const [round, setRound] = useState(() => makeRound(progress));
  const [message, setMessage] = useState('Какая буква первая?');
  const [messageStatus, setMessageStatus] = useState('idle');

  const choose = (item) => {
    if (round.solved) {
      return;
    }

    if (item.letter === round.answer.letter) {
      recordAttempt(item.letter, { correct: true, firstTry: round.mistakes === 0 });
      setRound((current) => ({ ...current, solved: true }));
      setMessage(`Да. ${round.answer.word} начинается со звука ${round.answer.phoneme}.`);
      setMessageStatus('correct');
    } else {
      recordAttempt(round.answer.letter, { correct: false });
      setRound((current) => ({ ...current, mistakes: current.mistakes + 1 }));
      setMessage(`Слушаем начало слова: ${round.answer.word}. ${round.answer.hint}`);
      setMessageStatus('wrong');
    }
  };

  const nextRound = () => {
    setRound(makeRound(progress));
    setMessage('Какая буква первая?');
    setMessageStatus('idle');
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
          <button
            key={item.letter}
            type="button"
            className="letter-option"
            onClick={() => choose(item)}
            disabled={round.solved}
          >
            {item.letter}
          </button>
        ))}
      </div>
      <p className={`game-message game-message--${messageStatus}`}>{message}</p>
      <BigButton onClick={nextRound} variant="soft">
        Новое слово
      </BigButton>
    </div>
  );
}
