import { useMemo, useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import AudioButton from '../components/AudioButton.jsx';
import { alphabet } from '../data/alphabet.js';
import { addProgress, shuffle } from '../utils.js';

const makeRound = () => {
  const answer = shuffle(alphabet)[0];
  const options = shuffle([answer, ...shuffle(alphabet.filter((item) => item.letter !== answer.letter)).slice(0, 3)]);
  return { answer, options };
};

export default function FindLetterGame() {
  const [round, setRound] = useState(makeRound);
  const [message, setMessage] = useState('Послушай и найди букву.');
  const answerText = useMemo(() => `Найди букву ${round.answer.letter}`, [round.answer.letter]);

  const choose = (item) => {
    if (item.letter === round.answer.letter) {
      addProgress(item.letter, 1);
      setMessage('Верно! Отлично получилось.');
    } else {
      setMessage(`Почти. Это буква ${item.letter}. Попробуй ещё.`);
    }
  };

  return (
    <div className="game-card">
      <h2>Найди букву</h2>
      <AudioButton text={answerText} label="Послушать задание" />
      <div className="option-grid">
        {round.options.map((item) => (
          <button key={item.letter} type="button" className="letter-option" onClick={() => choose(item)}>
            {item.letter}
          </button>
        ))}
      </div>
      <p className="game-message">{message}</p>
      <BigButton onClick={() => { setRound(makeRound()); setMessage('Послушай и найди букву.'); }} variant="soft">
        Новый раунд
      </BigButton>
    </div>
  );
}
