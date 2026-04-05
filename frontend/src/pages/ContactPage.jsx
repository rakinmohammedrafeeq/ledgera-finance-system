import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './legal-pages.css';

export default function ContactPage() {
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
        <h1>Contact</h1>

        <section className="legal-page__section">
          <p>
            For questions about Ledgera, your account, or these policies, reach out to our team. We aim to
            respond to legitimate inquiries as soon as we can.
          </p>
          <div className="legal-page__contact-box">
            <p style={{ marginBottom: 8 }}>Email</p>
            <a href="mailto:support@ledgera.com">support@ledgera.com</a>
          </div>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>Legal</h2>
          <p>
            <Link to="/privacy">Privacy Policy</Link>
            {' · '}
            <Link to="/terms">Terms &amp; Conditions</Link>
          </p>
        </section>
      </article>
    </div>
  );
}
