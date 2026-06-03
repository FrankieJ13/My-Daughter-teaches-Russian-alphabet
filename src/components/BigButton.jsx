import { Link } from 'react-router-dom';

export default function BigButton({ children, to, onClick, type = 'button', variant = 'primary', disabled = false }) {
  const className = `big-button big-button--${variant}`;

  if (to && !disabled) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
