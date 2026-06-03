import { useCallback, useState } from 'react';
import {
  getLetterStars,
  normalizeProgress,
  readProgress,
  recordLetterAttempt,
  resetProgress
} from '../utils.js';

export default function useProgress() {
  const [progress, setProgress] = useState(() => readProgress());

  const refresh = useCallback(() => {
    setProgress(readProgress());
  }, []);

  const recordAttempt = useCallback((letter, result) => {
    const next = recordLetterAttempt(letter, result);
    setProgress(normalizeProgress(next));
    return next;
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgress(readProgress());
  }, []);

  const starsFor = useCallback((letter) => getLetterStars(progress, letter), [progress]);

  return { progress, refresh, recordAttempt, reset, starsFor };
}
