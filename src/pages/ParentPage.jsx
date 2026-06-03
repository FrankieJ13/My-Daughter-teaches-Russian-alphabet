export default function ParentPage() {
  return (
    <section>
      <div className="page-heading">
        <h1>Родителям</h1>
        <p>Короткая памятка для спокойных занятий по 5-10 минут.</p>
      </div>
      <div className="parent-notes">
        <article>
          <h2>Как играть</h2>
          <p>Начните с 3-5 букв в день. Пусть ребёнок нажимает звук, повторяет букву и слово.</p>
        </article>
        <article>
          <h2>Прогресс</h2>
          <p>Звёзды сохраняются в localStorage на устройстве. Аккаунт и интернет не нужны.</p>
        </article>
        <article>
          <h2>Аудио</h2>
          <p>Озвучивание работает через Web Speech API браузера. Голос зависит от устройства.</p>
        </article>
      </div>
    </section>
  );
}
