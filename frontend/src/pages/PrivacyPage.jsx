import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './legal-pages.css';

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>

        <section className="legal-page__section">
          <h2>1. Information We Collect</h2>
          <p>Depending on how you use Ledgera, we may collect:</p>
          <ul>
            <li>Account information such as your name and email address.</li>
            <li>Financial records and related data you enter into the platform.</li>
            <li>Usage data such as log information, device type, and interactions with the application.</li>
          </ul>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>2. How We Use Data</h2>
          <ul>
            <li>To operate Ledgera and deliver core features.</li>
            <li>To improve features, performance, and user experience.</li>
            <li>To provide analytics and insights derived from your data within the product.</li>
          </ul>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures designed to protect your information,
            including secure storage practices and encryption where appropriate. No method of transmission over
            the internet is completely secure; we strive to safeguard data but cannot guarantee absolute security.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>4. Third-Party Services</h2>
          <p>
            Ledgera may rely on infrastructure, APIs, or hosting providers to deliver the service. Those
            providers process data only as needed to operate the platform and are expected to meet appropriate
            security standards. We do not sell your personal data.
          </p>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>5. User Rights</h2>
          <ul>
            <li>You may request access to or correction of certain personal data associated with your account.</li>
            <li>You may request deletion of your account subject to legal or operational retention requirements.</li>
            <li>For requests, contact us using the details on our <Link to="/contact">Contact</Link> page.</li>
          </ul>
        </section>

        <div className="legal-page__divider" />

        <section className="legal-page__section">
          <h2>6. Updates</h2>
          <p>
            This Privacy Policy may be updated from time to time. We will post the revised policy on this page
            and update the effective date as appropriate. Please review it periodically.
          </p>
        </section>
      </article>
    </div>
  );
}
