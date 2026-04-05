export default function Fab({ children, onClick, hidden = false, title = 'Action' }) {
  if (hidden) return null;
  return (
    <button className="fab" onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  );
}

