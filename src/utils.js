export const speak = (text) => {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
};

export const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem('azbuka-progress')) || {};
  } catch {
    return {};
  }
};

export const writeProgress = (progress) => {
  localStorage.setItem('azbuka-progress', JSON.stringify(progress));
};

export const addProgress = (letter, amount = 1) => {
  const progress = readProgress();
  const current = progress[letter] || 0;
  const next = { ...progress, [letter]: Math.min(3, current + amount) };
  writeProgress(next);
  return next;
};

export const resetProgress = () => {
  localStorage.removeItem('azbuka-progress');
};

export const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
