import { NavLink, Outlet, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Домой', icon: '⌂' },
  { to: '/alphabet', label: 'Буквы', icon: 'А' },
  { to: '/games', label: 'Игры', icon: '🎮' },
  { to: '/progress', label: 'Успехи', icon: '★' },
  { to: '/parent', label: 'Родителям', icon: '👪' }
];

export default function AppShell() {
  const location = useLocation();
  const isLetterPage = location.pathname.startsWith('/letter/');

  return (
    <div className={isLetterPage ? 'app-shell app-shell--letter' : 'app-shell'}>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Азбука-игра">
          <span className="brand__mark">А</span>
          <span>Азбука-игра</span>
        </NavLink>
        {isLetterPage && (
          <span className="topbar__status" aria-label="Озвучивание включено">
            🔊 Озвучено
          </span>
        )}
      </header>
      <main className="page">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Главная навигация">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (
              isActive || (isLetterPage && link.to === '/alphabet')
                ? 'bottom-nav__link active'
                : 'bottom-nav__link'
            )}
          >
            <span className="bottom-nav__icon" aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
