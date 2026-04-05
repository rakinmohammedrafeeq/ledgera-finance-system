import { Bell } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title, actions }) {
  const { user } = useAuth();
  return (
    <div className="topbar">
      <div className="topbar-left">
        <Logo size="small" className="topbar-logo" />
        <div className="topbar-title">{title}</div>
      </div>
      <input className="topbar-search" placeholder="Search records, users, insights" />
      <div className="topbar-actions">
        {actions}
        <button type="button" className="topbar-icon" aria-label="Notifications">
          <Bell strokeWidth={1.75} />
        </button>
        <div className="topbar-profile">
          <span>{user?.name || 'Guest'}</span>
        </div>
      </div>
    </div>
  );
}
