export function Skeleton({ width = '100%', height = 14, style = {} }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({ height = 120 }) {
  return <div className="skeleton-block" style={{ height }} aria-hidden="true" />;
}

