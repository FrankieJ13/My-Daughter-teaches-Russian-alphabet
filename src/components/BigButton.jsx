import { Link } from 'react-router-dom';

export default function BigButton({ children, to, onClick, type = 'button', variant = 'primary' }) {
  const className = `big-button big-button--${variant}`;

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
