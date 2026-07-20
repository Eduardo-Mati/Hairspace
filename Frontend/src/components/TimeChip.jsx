import './TimeChip.css';

export function TimeChip({ time, selected, onSelect }) {
  return (
    <button
      className={`time-chip${selected ? ' time-chip--selected' : ''}`}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}
