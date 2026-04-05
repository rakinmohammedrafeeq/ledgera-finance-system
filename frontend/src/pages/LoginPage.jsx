import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackendLoadingOverlay from '../components/BackendLoadingOverlay';
import useBackendReady from '../hooks/useBackendReady';
import Logo from '../components/Logo';
import './LoginPage.css';

const PARTICLE_COUNT = 52;

function FinancialHeroGraph() {
  return (
    <svg
      className="login-premium__graph"
      viewBox="0 0 440 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lp-gold-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b5a2a" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#e8cf6a" stopOpacity="1" />
          <stop offset="100%" stopColor="#b8962e" stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <path
        d="M 24 148 L 72 124 L 118 132 L 164 96 L 210 104 L 256 72 L 302 88 L 348 52 L 394 64 L 420 40"
        stroke="url(#lp-gold-stroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="login-premium__graph-line"
      />
      <path
        d="M 24 168 L 88 152 L 140 158 L 198 130 L 252 138 L 310 118 L 368 126 L 420 108"
        stroke="url(#lp-gold-stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
        className="login-premium__graph-line login-premium__graph-line--2"
      />
      <path
        d="M 32 178 L 420 178"
        stroke="rgba(212,175,55,0.22)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
    </svg>
  );
}

function IconExpense() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 19V5" strokeLinecap="round" />
      <path d="M4 19h16" strokeLinecap="round" />
      <path d="M8 15V9" strokeLinecap="round" />
      <path d="M12 15v-5" strokeLinecap="round" />
      <path d="M16 15V7" strokeLinecap="round" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 18h4l4-6 4 3 6-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 7h2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInsight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M12 3a7 7 0 0 0-4 12.74V19a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.26A7 7 0 0 0 12 3Z"
        strokeLinejoin="round"
      />
      <path d="M9 22h6" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showLoading, showFallback, runWithBackendReady } = useBackendReady();

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const seed = i * 9973;
        const r1 = ((seed * 16807) % 2147483647) / 2147483647;
        const r2 = ((seed * 48271) % 2147483647) / 2147483647;
        const r3 = ((seed * 69621) % 2147483647) / 2147483647;
        return {
          id: i,
          left: `${r1 * 100}%`,
          top: `${r2 * 100}%`,
          size: 1.5 + r3 * 2.8,
          duration: 14 + r1 * 18,
          delay: -(r2 * 24),
        };
      }),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await runWithBackendReady(async () => {
        await login(email, password);
        navigate('/');
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-premium">
      <BackendLoadingOverlay show={showLoading} fallback={showFallback} />
      <div className="login-premium__bg" aria-hidden="true" />
      <div className="login-premium__grid" aria-hidden="true" />
      <div className="login-premium__glow-corner login-premium__glow-corner--tl" aria-hidden="true" />
      <div className="login-premium__glow-corner login-premium__glow-corner--br" aria-hidden="true" />
      <div className="login-premium__streaks" aria-hidden="true">
        <div className="login-premium__streak" />
        <div className="login-premium__streak" />
        <div className="login-premium__streak" />
      </div>
      <div className="login-premium__particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="login-premium__particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="login-premium__noise" aria-hidden="true" />
      <div className="login-premium__vignette" aria-hidden="true" />

      <div className="login-premium__main">
        <div className="login-premium__split">
        <section className="login-premium__brand">
          <div className="login-premium__brand-inner">
            <div className="login-premium__hero-stack">
              <div className="login-premium__logo">
                <Logo size="xlarge" />
              </div>
              <h1 className="login-premium__title">Ledgera</h1>
              <p className="login-premium__tagline">
                Control your money.
                <span className="login-premium__tagline-accent"> Build your future.</span>
              </p>
            </div>
            <div className="login-premium__graph-wrap">
              <FinancialHeroGraph />
            </div>
            <ul className="login-premium__features">
              <li className="login-premium__feature">
                <span className="login-premium__feature-icon">
                  <IconExpense />
                </span>
                Track expenses effortlessly
              </li>
              <li className="login-premium__feature">
                <span className="login-premium__feature-icon">
                  <IconTrend />
                </span>
                Monitor income and trends
              </li>
              <li className="login-premium__feature">
                <span className="login-premium__feature-icon">
                  <IconInsight />
                </span>
                Smart financial insights
              </li>
            </ul>
          </div>
        </section>

        <section className="login-premium__aside">
          <div className="login-premium__card-shell">
            <div className="login-premium__card-aura" aria-hidden="true" />
            <div className="login-premium__card">
              <div className="login-premium__card-shine" aria-hidden="true" />
              <div className="login-premium__card-inner">
                <h2 className="login-premium__welcome">Welcome back</h2>
                <p className="login-premium__subtitle">Sign in to your finance dashboard</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email Address</label>
                    <input
                      id="login-email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    id="login-submit"
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading || showLoading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="login-premium__links">
                  <Link to="/forgot-password">Forgot password?</Link>
                  <span className="login-premium__dot" aria-hidden="true">
                    •
                  </span>
                  <Link to="/register">Create account</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
