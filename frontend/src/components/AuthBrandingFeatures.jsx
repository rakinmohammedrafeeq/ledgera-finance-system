import { BarChart3, LineChart, Lightbulb } from 'lucide-react';

const items = [
  { Icon: BarChart3, text: 'Track expenses effortlessly' },
  { Icon: LineChart, text: 'Monitor income and trends' },
  { Icon: Lightbulb, text: 'Smart financial insights' },
];

export default function AuthBrandingFeatures() {
  return (
    <div className="auth-features">
      {items.map(({ Icon, text }) => (
        <div key={text} className="auth-feature">
          <span className="auth-feature-icon" aria-hidden>
            <Icon strokeWidth={1.75} size={18} />
          </span>
          {text}
        </div>
      ))}
    </div>
  );
}
