import { useEffect } from 'react';
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

  useEffect(() => {
    const preventZoom = (event) => {
      event.preventDefault();
    };
    const preventMultiTouch = (event) => {
      if (event.touches?.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener('gesturestart', preventZoom, { passive: false });
    document.addEventListener('gesturechange', preventZoom, { passive: false });
    document.addEventListener('gestureend', preventZoom, { passive: false });
    document.addEventListener('dblclick', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventMultiTouch, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', preventZoom);
      document.removeEventListener('gesturechange', preventZoom);
      document.removeEventListener('gestureend', preventZoom);
      document.removeEventListener('dblclick', preventZoom);
      document.removeEventListener('touchmove', preventMultiTouch);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('no-page-scroll', isLetterPage);
    document.body.classList.toggle('no-page-scroll', isLetterPage);

    return () => {
      document.documentElement.classList.remove('no-page-scroll');
      document.body.classList.remove('no-page-scroll');
    };
  }, [isLetterPage]);

  return (
    <div className={isLetterPage ? 'app-shell app-shell--letter' : 'app-shell'}>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Азбука-игра">
          <span className="brand__mark">А</span>
          <span>Азбука-игра</span>
        </NavLink>
        {isLetterPage && (
          <button
            className="topbar__status"
            type="button"
            onClick={() => window.dispatchEvent(new Event('azbuka-toggle-pause'))}
            aria-label="Пауза"
          >
            ⏸️ Пауза
          </button>
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
