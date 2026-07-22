import './TimeChip.css';

export function TimeChip({ time, selected, disabled, onSelect }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`time-chip${selected ? ' time-chip--selected' : ''}${disabled ? ' time-chip--disabled' : ''}`}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}
