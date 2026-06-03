import { speak } from '../utils.js';

export default function AudioButton({ text, label = 'Слушать' }) {
  return (
    <button className="audio-button" type="button" onClick={() => speak(text)} aria-label={label}>
      🔊
      <span>{label}</span>
    </button>
  );
}
