import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Pencil, Plus, Trash2, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Rent', 'Utilities', 'Food', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Other'];

export default function RecordsPage() {
  const { hasRole } = useAuth();
  const canCreateRecords = hasRole('ANALYST');
  const canManageRecords = hasRole('ADMIN', 'ANALYST');
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: '',
  });

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'INCOME',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    description: '',
    userId: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmitRecord = !canCreateRecords || (formData.userId && users.length > 0);

  const fetchRecords = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const params = { page, size: 15, sortBy: 'date', direction: 'desc' };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;

      const res = await api.get('/records', { params });
      setRecords(res.data.content || []);
      setPagination({
        page: res.data.number || 0,
        totalPages: res.data.totalPages || 0,
        totalElements: res.data.totalElements || 0,
      });
    } catch (err) {
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchUsers = useCallback(async () => {
    if (!canCreateRecords) return;
    setError('');
    try {
      const res = await api.get('/users/assignable');
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to load users');
    }
  }, [canCreateRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '', type: '' });
  };

  const openCreateModal = () => {
    if (!canCreateRecords) return;
    setEditingRecord(null);
    setFormData({
      amount: '',
      type: 'INCOME',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      description: '',
      userId: users[0]?.id?.toString() || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description || '',
      userId: record.userId?.toString() || users[0]?.id?.toString() || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    if (canCreateRecords && (!formData.userId || users.length === 0)) {
      setFormError('Please select a user for this record');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: formData.userId ? Number(formData.userId) : null,
      };

      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}`, payload);
      } else {
        await api.post('/records', payload);
      }

      setShowModal(false);
      fetchRecords(pagination.page);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFormError(Object.values(data.errors).join(', '));
      } else {
        setFormError(data?.message || 'Failed to save record');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords(pagination.page);
    } catch (err) {
      setError('Failed to delete record');
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Topbar
        title="Financial Records"
        actions={
          canCreateRecords && (
            <button
              id="create-record-btn"
              type="button"
              className="btn btn-primary btn-sm btn-inline-icon"
              onClick={openCreateModal}
            >
              <Plus strokeWidth={2} size={14} aria-hidden />
              New Record
            </button>
          )
        }
      />
      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="date"
            name="startDate"
            className="filter-input"
            value={filters.startDate}
            onChange={handleFilterChange}
            title="Start Date"
          />
          <input
            type="date"
            name="endDate"
            className="filter-input"
            value={filters.endDate}
            onChange={handleFilterChange}
            title="End Date"
          />
          <select name="category" className="filter-select" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select name="type" className="filter-select" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear</button>
        </div>

        {/* Records Table */}
        <div className="records-card">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden>
                <ClipboardList strokeWidth={1.5} />
              </div>
              <div className="empty-state-text">No financial records available</div>
              <div className="empty-state-sub">
                {canManageRecords
                  ? 'Create your first financial record to get started'
                  : 'No financial records match your filters'}
              </div>
            </div>
          ) : (
            <>
              <div className="records-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      {canManageRecords && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.description || '—'}</td>
                        <td>{record.category}</td>
                        <td>
                          <span className={`badge badge-${record.type.toLowerCase()}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={record.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}>
                            {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                          </span>
                        </td>
                        {canManageRecords && (
                          <td>
                            <div className="actions-cell">
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm btn-icon-action"
                                onClick={() => openEditModal(record)}
                                aria-label="Edit record"
                              >
                                <Pencil strokeWidth={1.75} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm btn-icon-action"
                                onClick={() => handleDelete(record.id)}
                                aria-label="Delete record"
                              >
                                <Trash2 strokeWidth={1.75} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-btn pagination-btn--icon"
                  onClick={() => fetchRecords(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  aria-label="Previous page"
                >
                  <ChevronLeft strokeWidth={2} size={18} aria-hidden />
                </button>
                <span className="pagination-info">
                  Page {pagination.page + 1} of {pagination.totalPages} ({pagination.totalElements} records)
                </span>
                <button
                  type="button"
                  className="pagination-btn pagination-btn--icon"
                  onClick={() => fetchRecords(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  aria-label="Next page"
                >
                  <ChevronRight strokeWidth={2} size={18} aria-hidden />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRecord ? 'Edit Record' : 'New Financial Record'}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">
                <X strokeWidth={1.75} />
              </button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="record-amount">Amount (₹)</label>
                <input
                  id="record-amount"
                  type="number"
                  name="amount"
                  className="form-input"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="record-type">Type</label>
                <select id="record-type" name="type" className="form-select" value={formData.type} onChange={handleFormChange}>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="record-category">Category</label>
                <select id="record-category" name="category" className="form-select" value={formData.category} onChange={handleFormChange}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {canCreateRecords && (
                <div className="form-group">
                  <label htmlFor="record-user">Select User</label>
                  <select
                    id="record-user"
                    name="userId"
                    className="form-select"
                    value={formData.userId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {users.length === 0 && (
                    <div className="auth-subtitle" style={{ marginTop: 8 }}>
                      No users available to assign records.
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="record-date">Date</label>
                <input
                  id="record-date"
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="record-description">Description (Optional)</label>
                <input
                  id="record-description"
                  type="text"
                  name="description"
                  className="form-input"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleFormChange}
                  maxLength={500}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving || !canSubmitRecord}>
                  {saving ? 'Saving...' : editingRecord ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
