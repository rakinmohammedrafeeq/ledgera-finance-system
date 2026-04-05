import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useToast } from './ToastProvider';
import { IconGithub, IconLinkedin, IconTwitter } from './SocialOutlineIcons';
import './Footer.css';

const social = [
  { href: 'https://github.com', label: 'GitHub', Icon: IconGithub },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: IconLinkedin },
  { href: 'https://twitter.com', label: 'Twitter', Icon: IconTwitter },
];

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.push({ type: 'error', title: 'Invalid email', message: 'Please enter a valid email address.' });
      return;
    }
    toast.push({ type: 'success', title: 'Subscribed', message: 'Thank you. We will keep you updated on Ledgera.' });
    setEmail('');
  };

  return (
    <footer className="app-footer">
      <div className="app-footer__grid">
        <div className="app-footer__col app-footer__brand">
          <Link to="/" className="app-footer__logo-row">
            <Logo size="small" />
            <span className="app-footer__name">Ledgera</span>
          </Link>
          <p className="app-footer__desc">
            A powerful platform to track, manage, and optimize your financial life with precision.
          </p>
          <div className="app-footer__social">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="app-footer__social-link"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon strokeWidth={1.5} size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="app-footer__col">
          <h3 className="app-footer__heading">Platform</h3>
          <ul className="app-footer__links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/records">Records</Link></li>
            <li><Link to="/">Analytics</Link></li>
            <li><Link to="/records">Reports</Link></li>
          </ul>
        </div>

        <div className="app-footer__col">
          <h3 className="app-footer__heading">Legal</h3>
          <ul className="app-footer__links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="app-footer__col app-footer__newsletter">
          <h3 className="app-footer__heading">Stay updated</h3>
          <p className="app-footer__newsletter-text">
            Product updates and financial insights, delivered sparingly.
          </p>
          <form className="app-footer__form" onSubmit={handleSubscribe}>
            <label htmlFor="footer-subscribe-email" className="visually-hidden">
              Email
            </label>
            <input
              id="footer-subscribe-email"
              type="email"
              className="app-footer__input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <button type="submit" className="app-footer__submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="app-footer__bar">
        <span>© 2026 Ledgera</span>
        <span className="app-footer__bar-sep" aria-hidden>
          ·
        </span>
        <Link to="/privacy">Privacy</Link>
        <span className="app-footer__bar-sep" aria-hidden>
          ·
        </span>
        <Link to="/terms">Terms</Link>
        <span className="app-footer__bar-sep" aria-hidden>
          ·
        </span>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}
