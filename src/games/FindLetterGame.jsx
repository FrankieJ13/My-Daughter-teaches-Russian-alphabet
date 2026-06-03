import { useMemo, useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import AudioButton from '../components/AudioButton.jsx';
import useProgress from '../hooks/useProgress.js';
import { makeLetterOptions, pickLearningLetter } from '../utils.js';

const makeRound = (progress) => {
  const answer = pickLearningLetter({ progress });
  return { answer, options: makeLetterOptions(answer), mistakes: 0, solved: false };
};

export default function FindLetterGame() {
  const { progress, recordAttempt } = useProgress();
  const [round, setRound] = useState(() => makeRound(progress));
  const [message, setMessage] = useState('Послушай и найди букву.');
  const [messageStatus, setMessageStatus] = useState('idle');
  const answerText = useMemo(() => (
    `Найди букву ${round.answer.letter}. Звук ${round.answer.phoneme}.`
  ), [round.answer]);

  const choose = (item) => {
    if (round.solved) {
      return;
    }

    if (item.letter === round.answer.letter) {
      recordAttempt(item.letter, { correct: true, firstTry: round.mistakes === 0 });
      setRound((current) => ({ ...current, solved: true }));
      setMessage(`Верно. ${item.letter} — ${item.word}. Ты услышал звук ${item.phoneme}.`);
      setMessageStatus('correct');
    } else {
      recordAttempt(round.answer.letter, { correct: false });
      setRound((current) => ({ ...current, mistakes: current.mistakes + 1 }));
      setMessage(`${item.letter} — другая буква. ${round.answer.hint}`);
      setMessageStatus('wrong');
    }
  };

  const nextRound = () => {
    const nextProgress = progress;
    setRound(makeRound(nextProgress));
    setMessage('Послушай и найди букву.');
    setMessageStatus('idle');
  };

  return (
    <div className="game-card">
      <h2>Найди букву</h2>
      <p className="game-task">Ищем букву: {round.answer.letter}</p>
      <AudioButton text={answerText} label="Послушать задание" />
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
        Новый раунд
      </BigButton>
    </div>
  );
}
