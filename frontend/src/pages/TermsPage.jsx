import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './legal-pages.css';

export default function TermsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="legal-page">
      <header className="legal-page__top">
        <Link to={isAuthenticated ? '/' : '/login'} className="legal-page__brand">
          <Logo size="small" />
          <span>Ledgera</span>
        </Link>
      </header>

      <article className="legal-page__article">
        <h1>Terms &amp; Conditions</h1>

        <section className="legal-page__section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Ledgera. By accessing or using our platform, you agree to be bound by these Terms
            &amp; Conditions. If you do not agree, please do not use Ledgera.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>2. Use of Service</h2>
          <p>You agree to use Ledgera only for lawful purposes and in accordance with these terms.</p>
          <ul>
            <li>You must provide accurate, complete information when using the service.</li>
            <li>You must not misuse the platform, attempt unauthorized access, or engage in illegal activity.</li>
          </ul>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>3. Accounts</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>Notify us promptly if you suspect unauthorized use of your account.</li>
          </ul>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>4. Data &amp; Financial Information</h2>
          <p>
            Ledgera stores and processes financial and related data that you submit to provide dashboards,
            records, analytics, and insights. How we handle personal data is described in our{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>5. Limitation of Liability</h2>
          <p>
            Ledgera is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not
            guarantee uninterrupted or error-free operation. To the fullest extent permitted by law, Ledgera
            and its operators are not liable for any indirect, incidental, or consequential damages, including
            financial losses, arising from your use of the platform. You remain solely responsible for your
            financial decisions.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>6. Termination</h2>
          <p>
            We may suspend or terminate access to Ledgera for violations of these terms, fraud, abuse, or
            other conduct we deem harmful to the service or other users.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>7. Changes to Terms</h2>
          <p>
            We may update these Terms &amp; Conditions at any time. Continued use of Ledgera after changes
            constitutes acceptance of the revised terms. We encourage you to review this page periodically.
          </p>
        </section>
      </article>
    </div>
  );
}
