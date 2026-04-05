import './BackendLoadingOverlay.css';

export default function BackendLoadingOverlay({ show, fallback }) {
  if (!show) return null;

  return (
    <div className="backend-loading" role="status" aria-live="polite">
      <div className="backend-loading__card">
        <div className="spinner" />
        <h2>Signing you in...</h2>
        <p>Our server is currently starting up after inactivity.</p>
        <p>This is expected and may take up to a few minutes (~3 minutes).</p>
        <p>Thank you for your patience.</p>
        {fallback && (
          <p className="backend-loading__fallback">
            This is taking longer than expected. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

