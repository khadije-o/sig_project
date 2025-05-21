// components/Button.tsx
import { ReactNode, MouseEventHandler } from 'react';
import './button.css';

type ButtonProps = {
  children: ReactNode; // ce que le bouton affiche (texte, icône, etc.)
  onClick?: MouseEventHandler<HTMLButtonElement>; // fonction appelée au clic
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: ReactNode;
  title?: string;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  title = '',
  className = '',
}: ButtonProps) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}   
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
