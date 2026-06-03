import { Link, useNavigate, useParams } from 'react-router-dom';
import AudioButton from '../components/AudioButton.jsx';
import ProgressStars from '../components/ProgressStars.jsx';
import { alphabet, getLetterBySymbol } from '../data/alphabet.js';
import useProgress from '../hooks/useProgress.js';
import {
  correctPhrases,
  makeLetterOptions,
  pickPhrase,
  shuffle,
  speak,
  stopSpeech,
  wrongPhrases
} from '../utils.js';
import { useEffect, useMemo, useRef, useState } from 'react';

const initialCheckMessage = 'Сначала послушай букву, потом найди её ниже.';
const maxMistakesBeforeHelp = 2;
const levelSeconds = 30;
const introDelayMs = 3000;
const victoryDelayMs = 1800;

function LetterCheck({ item, next, recordAttempt }) {
  const navigate = useNavigate();
  const [answered, setAnswered] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState(initialCheckMessage);
  const [status, setStatus] = useState('idle');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(levelSeconds);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRepeatReady, setIsRepeatReady] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showLoss, setShowLoss] = useState(false);
  const checkOptions = useMemo(() => makeLetterOptions(item, { count: 3 }), [item]);
  const correctIndex = Math.max(0, checkOptions.findIndex((option) => option.letter === item.letter));
  const canContinue = answered || status === 'help';
  const navigationTimerRef = useRef(null);
  const taskText = useMemo(() => `Найди букву ${item.letter}. Звук ${item.phoneme}.`, [item]);

  const playTaskAudio = async () => {
    if (isPaused || showLoss || showVictory || isListening) {
      return;
    }

    setIsRepeatReady(false);
    setIsListening(true);
    await speak(taskText);
    setIsListening(false);
    setIsRepeatReady(true);
    setTimerStarted(true);
  };

  useEffect(() => {
    const autoAudioTimer = window.setTimeout(() => {
      playTaskAudio();
    }, introDelayMs);

    return () => window.clearTimeout(autoAudioTimer);
  }, [item.letter]);

  useEffect(() => {
    if (!timerStarted || isPaused || answered || status === 'help' || showVictory || showLoss) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setShowLoss(true);
          setStatus('wrong');
          setMessage('Время вышло. Попробуем эту букву ещё раз.');
          stopSpeech();
          speak('Время вышло. Попробуем ещё раз.');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [answered, isPaused, showLoss, showVictory, status, timerStarted]);

  useEffect(() => {
    const togglePause = () => {
      setIsPaused((current) => {
        const nextPaused = !current;
        if (nextPaused) {
          stopSpeech();
          setIsListening(false);
        }
        return nextPaused;
      });
    };

    window.addEventListener('azbuka-toggle-pause', togglePause);
    return () => window.removeEventListener('azbuka-toggle-pause', togglePause);
  }, []);

  useEffect(() => {
    const playFromHeader = () => playTaskAudio();
    window.addEventListener('azbuka-play-task', playFromHeader);
    return () => window.removeEventListener('azbuka-play-task', playFromHeader);
  });

  useEffect(() => () => {
    stopSpeech();
    if (navigationTimerRef.current) {
      window.clearTimeout(navigationTimerRef.current);
    }
  }, []);

  const choose = (choice) => {
    if (canContinue || isPaused || showLoss || showVictory) {
      return;
    }

    if (!timerStarted) {
      setTimerStarted(true);
    }

    setSelectedLetter(choice.letter);

    if (choice.letter === item.letter) {
      const phrase = pickPhrase(correctPhrases);
      recordAttempt(item.letter, { correct: true, firstTry: mistakes === 0 });
      setAnswered(true);
      setStatus('correct');
      setShowVictory(true);
      setMessage(`${phrase} ${item.letter} — это ${item.word}.`);
      speak(`${phrase} Это буква ${item.letter}. ${item.word}.`);
      navigationTimerRef.current = window.setTimeout(() => navigate(`/letter/${next.letter}`), victoryDelayMs);
      return;
    }

    const phrase = pickPhrase(wrongPhrases);
    const nextMistakes = mistakes + 1;
    recordAttempt(item.letter, { correct: false });
    setMistakes(nextMistakes);

    if (nextMistakes >= maxMistakesBeforeHelp) {
      setStatus('help');
      setMessage(`Смотри: правильная буква ${item.letter}. ${item.hint}`);
      speak(`Смотри. Правильная буква ${item.letter}.`);
      return;
    }

    setStatus('wrong');
    setMessage(`${phrase} ${choice.letter} — другая буква.`);
    speak(`${phrase} Ищи букву ${item.letter}.`);
  };

  const getOptionClassName = (option) => {
    if ((status === 'correct' || status === 'help') && option.letter === item.letter) {
      return 'letter-option letter-option--correct';
    }

    if (status === 'wrong' && selectedLetter === option.letter) {
      return 'letter-option letter-option--wrong';
    }

    return 'letter-option';
  };

  const resetLevel = () => {
    stopSpeech();
    setAnswered(false);
    setMistakes(0);
    setMessage(initialCheckMessage);
    setStatus('idle');
    setSelectedLetter(null);
    setSecondsLeft(levelSeconds);
    setTimerStarted(false);
    setIsListening(false);
    setIsPaused(false);
    setIsRepeatReady(false);
    setShowVictory(false);
    setShowLoss(false);
  };

  return (
    <div className={`mini-check mini-check--${status}`}>
      {(isPaused || showVictory || showLoss) && (
        <div className={`game-overlay ${showVictory ? 'game-overlay--victory' : showLoss ? 'game-overlay--loss' : ''}`}>
          <div className="game-overlay__panel">
            <strong>{showVictory ? 'Победа!' : showLoss ? 'Время вышло' : 'Пауза'}</strong>
            <p>{showVictory ? 'Переходим дальше' : showLoss ? 'Попробуем ещё раз' : 'Можно продолжить или выйти'}</p>
            {!showVictory && (
              <div className="pause-actions">
                <button className="pause-button pause-button--continue" type="button" onClick={showLoss ? resetLevel : () => setIsPaused(false)}>
                  ▶️ {showLoss ? 'Ещё раз' : 'Продолжить'}
                </button>
                <button className="pause-button pause-button--exit" type="button" onClick={() => navigate('/alphabet')}>
                  🚪 Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="check-status" aria-live="polite">
        <span className="check-status__icon" aria-hidden="true">
          {status === 'correct' ? '✓' : status === 'wrong' ? '!' : status === 'help' ? item.letter : '👂'}
        </span>
        <p>{message}</p>
      </div>
      <div className="target-arrow" aria-hidden="true">
        <span style={{ gridColumn: correctIndex + 1 }}>↓</span>
      </div>
      <div className="option-grid">
        {checkOptions.map((option) => (
          <button
            key={option.letter}
            type="button"
            className={getOptionClassName(option)}
            onClick={() => choose(option)}
            disabled={canContinue || isPaused || showLoss || showVictory}
          >
            {option.letter}
          </button>
        ))}
      </div>
      <div className="actions actions--compact">
        <button className="level-timer" type="button" onClick={playTaskAudio} disabled={isPaused || showLoss || showVictory}>
          <span>⏱️ {secondsLeft}</span>
          <span className={isRepeatReady ? 'repeat-listen repeat-listen--pulse' : 'repeat-listen'}>🔊</span>
        </button>
      </div>
    </div>
  );
}

export default function LetterPage() {
  const { letter } = useParams();
  const item = getLetterBySymbol(letter || '') || alphabet[0];
  const { recordAttempt, starsFor } = useProgress();
  const progress = starsFor(item.letter);
  const index = alphabet.findIndex((entry) => entry.letter === item.letter);
  const next = alphabet[(index + 1) % alphabet.length];
  const syllables = useMemo(() => shuffle(item.syllables).join(' · '), [item]);

  return (
    <section className="letter-page">
      <Link to="/alphabet" className="back-link">← Все буквы</Link>
      <div className="letter-focus" style={{ '--focus-color': item.color }}>
        <div className="letter-focus__tile">
          <span className="letter-focus__letters">{item.letter} {item.lower}</span>
          <span className="letter-focus__emoji" aria-hidden="true">{item.emoji}</span>
        </div>
        <div className="letter-focus__info">
          <h1>Буква {item.letter}</h1>
          <p className="letter-focus__phrase">{item.letter} — как в слове «{item.word}». Звук: {item.phoneme}.</p>
          <p className="syllables"><span>Слоги:</span> {syllables}</p>
          <AudioButton
            text={`Буква ${item.letter}. Звук ${item.phoneme}. ${item.word}. ${item.hint}`}
            label="Послушать букву"
            onPlay={() => window.dispatchEvent(new Event('azbuka-play-task'))}
          />
          <ProgressStars value={progress} />
        </div>
      </div>
      <LetterCheck key={item.letter} item={item} next={next} recordAttempt={recordAttempt} />
    </section>
  );
}
