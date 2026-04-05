import { ClipboardList } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="recent-transactions">
        <div className="section-title">Recent Transactions</div>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            <ClipboardList strokeWidth={1.5} />
          </div>
          <div className="empty-state-text">No financial records available</div>
          <div className="empty-state-sub">Your latest activity will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="section-title">Recent Transactions</div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>
              <td>{tx.description || '—'}</td>
              <td>{tx.category}</td>
              <td>
                <span className={`badge badge-${tx.type?.toLowerCase()}`}>
                  {tx.type}
                </span>
              </td>
              <td className="text-right">
                <span className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
