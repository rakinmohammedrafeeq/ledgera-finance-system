import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

export default function SummaryCards({ data }) {
  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <div className="summary-card-icon" aria-hidden>
          <TrendingUp strokeWidth={1.75} size={22} />
        </div>
        <div className="summary-card-label">Total Income</div>
        <div className="summary-card-value">{formatCurrency(data?.totalIncome)}</div>
      </div>

      <div className="summary-card expense">
        <div className="summary-card-icon" aria-hidden>
          <TrendingDown strokeWidth={1.75} size={22} />
        </div>
        <div className="summary-card-label">Total Expenses</div>
        <div className="summary-card-value">{formatCurrency(data?.totalExpenses)}</div>
      </div>

      <div className="summary-card balance">
        <div className="summary-card-icon" aria-hidden>
          <Wallet strokeWidth={1.75} size={22} />
        </div>
        <div className="summary-card-label">Net Balance</div>
        <div className="summary-card-value">{formatCurrency(data?.netBalance)}</div>
      </div>
    </div>
  );
}
