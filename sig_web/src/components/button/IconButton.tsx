import './IconButton.css';

interface IconButtonProps {
  iconClass: string;
  title: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
}

const IconButton = ({ iconClass, title, onClick, variant = 'default' }: IconButtonProps) => {
  const variantClass =
    variant === 'danger'
      ? 'icon-button--danger'
      : variant === 'success'
      ? 'icon-button--success'
      : '';

  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`icon-button ${variantClass}`}
    >
      <i className={iconClass}></i>
    </button>
  );
};

export default IconButton;
