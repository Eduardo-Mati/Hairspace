import './PrimaryButton.css';

export function PrimaryButton({ children, onClick, fullWidth = false, disabled = false, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary${fullWidth ? ' btn-primary--full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
