import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Домой' },
  { to: '/alphabet', label: 'Буквы' },
  { to: '/games', label: 'Игры' },
  { to: '/progress', label: 'Успехи' },
  { to: '/parent', label: 'Родителям' }
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Азбука-игра">
          <span className="brand__mark">А</span>
          <span>Азбука-игра</span>
        </NavLink>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Главная навигация">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="bottom-nav__link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
