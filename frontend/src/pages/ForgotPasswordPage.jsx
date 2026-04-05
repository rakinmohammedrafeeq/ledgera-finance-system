import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import AuthBrandingFeatures from '../components/AuthBrandingFeatures';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter token + new password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      // Extract token from response message
      const msg = res.data.message || '';
      const tokenMatch = msg.match(/token:\s*(.+)/i);
      if (tokenMatch) {
        setResetToken(tokenMatch[1].trim());
      }
      setMessage('Reset token generated successfully. Use it below to set a new password.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <section className="auth-branding">
          <div className="auth-branding-content">
            <Logo size="large" />
            <div>
              <div className="auth-branding-title">Ledgera</div>
              <div className="auth-tagline">Control your money. Build your future.</div>
            </div>
            <AuthBrandingFeatures />
          </div>
        </section>
        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-logo">
              <Logo size="large" />
            </div>
            <div className="auth-logo-text">Reset Password</div>
            <div className="auth-subtitle">
              {step === 1 && 'Enter your email to receive a reset token'}
              {step === 2 && 'Enter the reset token and your new password'}
              {step === 3 && 'Your password has been updated'}
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {resetToken && step === 2 && (
              <div className="alert alert-info">
                <strong>Reset Token:</strong>
                <div style={{ marginTop: 4, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                  {resetToken}
                </div>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Generating Token...' : 'Generate Reset Token'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="reset-token">Reset Token</label>
                  <input
                    id="reset-token"
                    type="text"
                    className="form-input"
                    placeholder="Paste your reset token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {step === 3 && (
              <Link to="/login" className="btn btn-primary btn-full" style={{ textDecoration: 'none', marginTop: 16 }}>
                Go to Login
              </Link>
            )}

            <div className="auth-links">
              <Link to="/login" className="auth-back-link btn-inline-icon">
                <ArrowLeft strokeWidth={2} size={14} aria-hidden />
                Back to Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
