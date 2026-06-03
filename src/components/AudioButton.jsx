import { speak } from '../utils.js';

export default function AudioButton({ text, label = 'Слушать', onPlay, className = '' }) {
  return (
    <button className={`audio-button ${className}`.trim()} type="button" onClick={() => (onPlay ? onPlay() : speak(text))} aria-label={label}>
      🔊
      <span>{label}</span>
    </button>
  );
}
