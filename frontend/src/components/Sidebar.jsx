import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { LayoutDashboard, ClipboardList, Users, LogOut } from 'lucide-react';
import Logo from './Logo';
import ConfirmDialog from './ConfirmDialog';

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const iconProps = { strokeWidth: 1.75, size: 20 };

  return (
    <>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <Logo size="medium" className="sidebar-logo" />
          <span className="sidebar-brand">Ledgera</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="sidebar-nav-icon">
              <LayoutDashboard {...iconProps} />
            </span>
            Dashboard
          </NavLink>

          {hasRole('ADMIN', 'ANALYST') && (
            <NavLink to="/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-nav-icon">
                <ClipboardList {...iconProps} />
              </span>
              Records / Expenses
            </NavLink>
          )}

          {hasRole('ADMIN') && (
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-nav-icon">
                <Users {...iconProps} />
              </span>
              Users
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button type="button" className="sidebar-link sidebar-link--logout" onClick={handleLogout}>
            <span className="sidebar-nav-icon">
              <LogOut {...iconProps} />
            </span>
            Logout
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
