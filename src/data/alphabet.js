export const alphabet = [
  { letter: 'А', lower: 'а', word: 'арбуз', emoji: '🍉', color: '#ff6b6b', soundKey: 'a' },
  { letter: 'Б', lower: 'б', word: 'барабан', emoji: '🥁', color: '#ffa94d', soundKey: 'be' },
  { letter: 'В', lower: 'в', word: 'виноград', emoji: '🍇', color: '#845ef7', soundKey: 've' },
  { letter: 'Г', lower: 'г', word: 'груша', emoji: '🍐', color: '#94d82d', soundKey: 'ge' },
  { letter: 'Д', lower: 'д', word: 'дом', emoji: '🏠', color: '#4dabf7', soundKey: 'de' },
  { letter: 'Е', lower: 'е', word: 'ель', emoji: '🌲', color: '#38d9a9', soundKey: 'ye' },
  { letter: 'Ё', lower: 'ё', word: 'ёжик', emoji: '🦔', color: '#a98467', soundKey: 'yo' },
  { letter: 'Ж', lower: 'ж', word: 'жук', emoji: '🐞', color: '#ff8787', soundKey: 'zhe' },
  { letter: 'З', lower: 'з', word: 'зонт', emoji: '☂️', color: '#748ffc', soundKey: 'ze' },
  { letter: 'И', lower: 'и', word: 'игла', emoji: '🪡', color: '#f783ac', soundKey: 'i' },
  { letter: 'Й', lower: 'й', word: 'йогурт', emoji: '🥣', color: '#ffd43b', soundKey: 'short-i' },
  { letter: 'К', lower: 'к', word: 'кот', emoji: '🐱', color: '#ff922b', soundKey: 'ka' },
  { letter: 'Л', lower: 'л', word: 'лев', emoji: '🦁', color: '#fcc419', soundKey: 'el' },
  { letter: 'М', lower: 'м', word: 'мяч', emoji: '⚽', color: '#69db7c', soundKey: 'em' },
  { letter: 'Н', lower: 'н', word: 'нос', emoji: '👃', color: '#74c0fc', soundKey: 'en' },
  { letter: 'О', lower: 'о', word: 'облако', emoji: '☁️', color: '#91a7ff', soundKey: 'o' },
  { letter: 'П', lower: 'п', word: 'пирог', emoji: '🥧', color: '#d0bfff', soundKey: 'pe' },
  { letter: 'Р', lower: 'р', word: 'рыба', emoji: '🐟', color: '#66d9e8', soundKey: 'er' },
  { letter: 'С', lower: 'с', word: 'солнце', emoji: '☀️', color: '#ffd43b', soundKey: 'es' },
  { letter: 'Т', lower: 'т', word: 'трактор', emoji: '🚜', color: '#ffb86b', soundKey: 'te' },
  { letter: 'У', lower: 'у', word: 'утка', emoji: '🦆', color: '#63e6be', soundKey: 'u' },
  { letter: 'Ф', lower: 'ф', word: 'фонарь', emoji: '🔦', color: '#adb5bd', soundKey: 'ef' },
  { letter: 'Х', lower: 'х', word: 'хлеб', emoji: '🍞', color: '#e599f7', soundKey: 'ha' },
  { letter: 'Ц', lower: 'ц', word: 'цветок', emoji: '🌸', color: '#faa2c1', soundKey: 'tse' },
  { letter: 'Ч', lower: 'ч', word: 'чайник', emoji: '🫖', color: '#b197fc', soundKey: 'che' },
  { letter: 'Ш', lower: 'ш', word: 'шар', emoji: '🎈', color: '#ff8787', soundKey: 'sha' },
  { letter: 'Щ', lower: 'щ', word: 'щётка', emoji: '🪥', color: '#96f2d7', soundKey: 'shcha' },
  { letter: 'Ъ', lower: 'ъ', word: 'подъезд', emoji: '🚪', color: '#ced4da', soundKey: 'hard-sign' },
  { letter: 'Ы', lower: 'ы', word: 'сыр', emoji: '🧀', color: '#ffe066', soundKey: 'y' },
  { letter: 'Ь', lower: 'ь', word: 'конь', emoji: '♞', color: '#dee2e6', soundKey: 'soft-sign' },
  { letter: 'Э', lower: 'э', word: 'экран', emoji: '📺', color: '#99e9f2', soundKey: 'e' },
  { letter: 'Ю', lower: 'ю', word: 'юла', emoji: '🌀', color: '#da77f2', soundKey: 'yu' },
  { letter: 'Я', lower: 'я', word: 'яблоко', emoji: '🍎', color: '#ff6b6b', soundKey: 'ya' }
];

export const getLetterBySymbol = (symbol) => (
  alphabet.find((item) => item.letter === symbol.toUpperCase())
);
