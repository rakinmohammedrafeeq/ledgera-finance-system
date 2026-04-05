const PUBLIC_LOGO_PATH = '/gold-logo.png';

// Note: logo lives in /public so it can be reused by favicon + app UI.

const sizeMap = {
  small: { height: '32px', className: 'logo-small' },
  medium: { height: 'clamp(28px, 3.4vw, 36px)', className: 'logo-medium' },
  large: { height: 'clamp(60px, 8vw, 80px)', className: 'logo-large' },
};

export default function Logo({ size = 'medium', className = '', alt = 'Ledgera Logo' }) {
  const config = sizeMap[size] || sizeMap.medium;

  return (
    <img
      src={PUBLIC_LOGO_PATH}
      alt={alt}
      className={`logo ${config.className} ${className}`.trim()}
      style={{
        height: config.height,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}
