import { alphabet } from './data/alphabet.js';

const PROGRESS_KEY = 'azbuka-progress';

export const speak = (text) => new Promise((resolve) => {
  if (!('speechSynthesis' in window)) {
    resolve();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  utterance.onend = resolve;
  utterance.onerror = resolve;
  window.speechSynthesis.speak(utterance);
});

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const correctPhrases = ['Верно!', 'Правильно!', 'Молодец!', 'Так держать!', 'Умница!', 'Отличный результат!'];
export const wrongPhrases = ['Неверно.', 'Ошибка.', 'Подумай ещё.', 'Так не пойдёт.', 'Плохо.', 'Будь внимательнее.'];
export const pickPhrase = (phrases) => phrases[Math.floor(Math.random() * phrases.length)];

const emptyLetterProgress = () => ({
  stars: 0,
  attempts: 0,
  correct: 0,
  mistakes: 0,
  streak: 0,
  seen: 0,
  lastSeenAt: null,
  lastCorrectAt: null
});

const normalizeLetterProgress = (value) => {
  if (typeof value === 'number') {
    return { ...emptyLetterProgress(), stars: Math.min(3, value), correct: value };
  }

  if (!value || typeof value !== 'object') {
    return emptyLetterProgress();
  }

  return {
    ...emptyLetterProgress(),
    ...value,
    stars: Math.min(3, Number(value.stars) || 0),
    attempts: Number(value.attempts) || 0,
    correct: Number(value.correct) || 0,
    mistakes: Number(value.mistakes) || 0,
    streak: Number(value.streak) || 0,
    seen: Number(value.seen) || 0
  };
};

export const normalizeProgress = (raw) => {
  const legacyOrLetters = raw?.letters || raw || {};
  const letters = Object.fromEntries(
    alphabet.map((item) => [item.letter, normalizeLetterProgress(legacyOrLetters[item.letter])])
  );

  return {
    version: 2,
    letters,
    updatedAt: raw?.updatedAt || null
  };
};

export const readProgress = () => {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {});
  } catch {
    return normalizeProgress({});
  }
};

export const writeProgress = (progress) => {
  const next = normalizeProgress(progress);
  next.updatedAt = new Date().toISOString();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
};

export const getLetterProgress = (progress, letter) => (
  normalizeProgress(progress).letters[letter] || emptyLetterProgress()
);

export const getLetterStars = (progress, letter) => getLetterProgress(progress, letter).stars;

export const recordLetterAttempt = (letter, { correct, firstTry = false, award = true } = {}) => {
  const progress = readProgress();
  const current = getLetterProgress(progress, letter);
  const now = new Date().toISOString();
  const nextLetter = {
    ...current,
    attempts: current.attempts + 1,
    seen: current.seen + 1,
    lastSeenAt: now
  };

  if (correct) {
    nextLetter.correct += 1;
    nextLetter.streak += 1;
    nextLetter.lastCorrectAt = now;
    if (firstTry && award) {
      nextLetter.stars = Math.min(3, nextLetter.stars + 1);
    }
  } else {
    nextLetter.mistakes += 1;
    nextLetter.streak = 0;
  }

  const next = {
    ...progress,
    letters: {
      ...progress.letters,
      [letter]: nextLetter
    }
  };
  writeProgress(next);
  return next;
};

export const resetProgress = () => {
  localStorage.removeItem(PROGRESS_KEY);
};

export const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

const weightedPick = (items) => {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;

  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.value;
    }
  }

  return items[0].value;
};

export const pickLearningLetter = ({ progress = readProgress(), pool = alphabet, exclude = [] } = {}) => {
  const excluded = new Set(exclude);
  const weighted = pool
    .filter((item) => !excluded.has(item.letter))
    .map((item) => {
      const stats = getLetterProgress(progress, item.letter);
      const needsPractice = 3 - stats.stars;
      const mistakeBoost = Math.min(4, stats.mistakes);
      const newBoost = stats.seen === 0 ? 3 : 0;
      const streakPenalty = Math.min(2, stats.streak);
      return {
        value: item,
        weight: Math.max(1, 1 + needsPractice * 3 + mistakeBoost + newBoost - streakPenalty)
      };
    });

  return weightedPick(weighted);
};

export const makeLetterOptions = (answer, { pool = alphabet, count = 4 } = {}) => {
  const preferred = [
    answer.letter === 'Е' && 'Ё',
    answer.letter === 'Ё' && 'Е',
    answer.letter === 'И' && 'Й',
    answer.letter === 'Й' && 'И',
    answer.letter === 'Ш' && 'Щ',
    answer.letter === 'Щ' && 'Ш',
    answer.letter === 'Ь' && 'Ъ',
    answer.letter === 'Ъ' && 'Ь'
  ].filter(Boolean);
  const preferredItems = preferred
    .map((letter) => pool.find((item) => item.letter === letter))
    .filter(Boolean);
  const rest = shuffle(pool.filter((item) => item.letter !== answer.letter && !preferred.includes(item.letter)));
  const options = [answer, ...preferredItems, ...rest].slice(0, count);
  return shuffle(options);
};

export const getLearningSummary = (progress = readProgress()) => {
  const normalized = normalizeProgress(progress);
  const totalStars = alphabet.reduce((sum, item) => sum + getLetterStars(normalized, item.letter), 0);
  const learned = alphabet.filter((item) => getLetterStars(normalized, item.letter) >= 3).length;
  const practice = alphabet
    .filter((item) => getLetterStars(normalized, item.letter) < 3)
    .sort((a, b) => {
      const aStats = getLetterProgress(normalized, a.letter);
      const bStats = getLetterProgress(normalized, b.letter);
      return (bStats.mistakes + (3 - bStats.stars)) - (aStats.mistakes + (3 - aStats.stars));
    })
    .slice(0, 4);

  return { totalStars, learned, practice };
};
