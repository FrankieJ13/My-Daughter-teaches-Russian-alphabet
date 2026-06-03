import { useMemo, useState } from 'react';
import BigButton from '../components/BigButton.jsx';
import AudioButton from '../components/AudioButton.jsx';
import useProgress from '../hooks/useProgress.js';
import { correctPhrases, makeLetterOptions, pickLearningLetter, pickPhrase, speak, wrongPhrases } from '../utils.js';

const makeRound = (progress) => {
  const answer = pickLearningLetter({ progress });
  return { answer, options: makeLetterOptions(answer), mistakes: 0, solved: false };
};

export default function FindLetterGame() {
  const { progress, recordAttempt } = useProgress();
  const [round, setRound] = useState(() => makeRound(progress));
  const [message, setMessage] = useState('Послушай и найди букву.');
  const [messageStatus, setMessageStatus] = useState('idle');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const answerText = useMemo(() => (
    `Найди букву ${round.answer.letter}. Звук ${round.answer.phoneme}.`
  ), [round.answer]);

  const choose = (item) => {
    if (round.solved) {
      return;
    }

    setSelectedLetter(item.letter);

    if (item.letter === round.answer.letter) {
      const phrase = pickPhrase(correctPhrases);
      recordAttempt(item.letter, { correct: true, firstTry: round.mistakes === 0 });
      setRound((current) => ({ ...current, solved: true }));
      setMessage(`${phrase} ${item.letter} — ${item.word}.`);
      setMessageStatus('correct');
      speak(`${phrase} Это буква ${item.letter}. ${item.word}.`);
    } else {
      const phrase = pickPhrase(wrongPhrases);
      recordAttempt(round.answer.letter, { correct: false });
      setRound((current) => ({ ...current, mistakes: current.mistakes + 1 }));
      setMessage(`${phrase} ${item.letter} — другая буква.`);
      setMessageStatus('wrong');
      speak(`${phrase} Ищи букву ${round.answer.letter}.`);
    }
  };

  const nextRound = () => {
    const nextProgress = progress;
    setRound(makeRound(nextProgress));
    setMessage('Послушай и найди букву.');
    setMessageStatus('idle');
    setSelectedLetter(null);
  };

  const getOptionClassName = (item) => {
    if (round.solved && item.letter === round.answer.letter) {
      return 'letter-option letter-option--correct';
    }

    if (messageStatus === 'wrong' && selectedLetter === item.letter) {
      return 'letter-option letter-option--wrong';
    }

    return 'letter-option';
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
            className={getOptionClassName(item)}
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
