# Азбука-игра

PWA-приложение на React + Vite для изучения русского алфавита ребёнком 5 лет.

## Возможности

- страницы: главная, алфавит, буква, игры, прогресс, родителям;
- игры: найти букву, выбрать первую букву слова, пары буква-картинка;
- озвучивание через Web Speech API;
- прогресс сохраняется в `localStorage`;
- mobile-first интерфейс на русском языке;
- PWA с манифестом и service worker;
- готово для GitHub Pages по адресу `/My-Daughter-teaches-Russian-alphabet/`.

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой на GitHub Pages

1. Репозиторий: `FrankieJ13/My-Daughter-teaches-Russian-alphabet`.
2. Убедитесь, что в `vite.config.js` указан base:

```js
base: '/My-Daughter-teaches-Russian-alphabet/'
```

3. Выполните:

```bash
npm run deploy
```

Команда публикует папку `dist` в ветку `gh-pages`.
