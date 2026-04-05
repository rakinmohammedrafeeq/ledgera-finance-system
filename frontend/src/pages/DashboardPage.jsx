import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { MonthlyTrendsChart, CategoryBreakdownChart } from '../components/Charts';
import RecentTransactions from '../components/RecentTransactions';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import Fab from '../components/Fab';
import { useToast } from '../components/ToastProvider';
import { SkeletonBlock } from '../components/Skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const net = (parseFloat(data?.netBalance) || 0);

  return (
    <>
      <Topbar
        title="Dashboard"
        actions={
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-inline-icon"
            onClick={() => {
              setLoading(true);
              fetchDashboard();
              toast.push({ type: 'info', title: 'Refreshing', message: 'Updating your financial intelligence.' });
            }}
          >
            <RefreshCw strokeWidth={2} />
            Refresh
          </button>
        }
      />

      <div className="page-content page-fadein">
        {/* Futuristic hero */}
        <div className="dash-hero">
          <div className="dash-hero-left">
            <div className="dash-hero-kicker">Financial Intelligence</div>
            <div className="dash-hero-title">Welcome back, {user?.name || 'Investor'}</div>
            <div className="dash-hero-sub">Your portfolio pulse, distilled into signal.</div>
          </div>
          <div className="dash-hero-right">
            <div className="hero-balance-label">Net Balance</div>
            <div className="hero-balance-value">{formatCurrency(net)}</div>
            <div className="hero-trend">
              <TrendingUp strokeWidth={2} aria-hidden />
              +12% this month
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats grid */}
        {loading ? (
          <div className="dash-stats">
            <div className="glass-card glass-card-lg"><SkeletonBlock height={140} /></div>
            <div className="glass-card"><SkeletonBlock height={140} /></div>
            <div className="glass-card"><SkeletonBlock height={140} /></div>
          </div>
        ) : (
          <div className="dash-stats">
            <div className="glass-card glass-card-lg">
              <div className="card-top">
                <div>
                  <div className="card-label">Net Balance</div>
                  <div className="card-value card-value-gold">{formatCurrency(data?.netBalance)}</div>
                </div>
                <div className="card-icon">
                  <Sparkles strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <div className="card-meta">Consolidated across all records</div>
            </div>

            <div className="glass-card">
              <div className="card-top">
                <div>
                  <div className="card-label">Income</div>
                  <div className="card-value">{formatCurrency(data?.totalIncome)}</div>
                </div>
                <div className="card-icon">
                  <TrendingUp strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <div className="card-meta">Gold signal • stable inflow</div>
            </div>

            <div className="glass-card">
              <div className="card-top">
                <div>
                  <div className="card-label">Expenses</div>
                  <div className="card-value" style={{ color: 'var(--color-expense)' }}>{formatCurrency(data?.totalExpenses)}</div>
                </div>
                <div className="card-icon">
                  <TrendingDown strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <div className="card-meta">Risk pressure • watch categories</div>
            </div>
          </div>
        )}

        {/* AI-like insight */}
        <div className="insight-card">
          <div className="insight-badge">AI Insight</div>
          <div className="insight-text">You spent <span className="text-gold">18%</span> more on <span style={{ color: 'var(--text-primary)' }}>Food</span> this week.</div>
          <div className="insight-sub">Try setting a weekly cap to keep the trend under control.</div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <MonthlyTrendsChart data={data?.monthlyTrends} />
          <CategoryBreakdownChart data={data?.categoryTotals} />
        </div>

        {/* Recent transactions */}
        <RecentTransactions transactions={data?.recentTransactions} />
      </div>

      {/* Floating Action Button */}
      <Fab
        title="Add Expense"
        onClick={() => toast.push({ type: 'info', title: 'Quick add', message: 'Open Records, then use New Record to add an expense.' })}
      >
        <Plus strokeWidth={2.25} aria-hidden />
        Add Expense
      </Fab>
    </>
  );
}
