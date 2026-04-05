import { useState, useEffect } from 'react';
import { RefreshCw, Users as UsersIcon } from 'lucide-react';
import api from '../api/axios';
import Topbar from '../components/Topbar';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/users/${id}/toggle-status`);
      setUsers(users.map((u) => (u.id === id ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user status');
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRoleBadge = (role) => {
    const classes = {
      ADMIN: 'badge badge-admin',
      ANALYST: 'badge badge-analyst',
      VIEWER: 'badge badge-viewer',
    };
    return <span className={classes[role] || 'badge'}>{role}</span>;
  };

  return (
    <>
      <Topbar
        title="User Management"
        actions={
          <button type="button" className="btn btn-secondary btn-sm btn-inline-icon" onClick={fetchUsers}>
            <RefreshCw strokeWidth={2} size={14} aria-hidden />
            Refresh
          </button>
        }
      />

      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="users-card">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden>
                <UsersIcon strokeWidth={1.5} />
              </div>
              <div className="empty-state-text">No users found</div>
            </div>
          ) : (
            <div className="records-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 500 }}>{user.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <span className={`badge ${user.active ? 'badge-active' : 'badge-inactive'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td>
                        {user.email === 'admin@ledgera.com' ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Protected</span>
                        ) : (
                          <button
                            className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => toggleStatus(user.id)}
                            disabled={togglingId === user.id}
                          >
                            {togglingId === user.id
                              ? '...'
                              : user.active
                                ? 'Deactivate'
                                : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
