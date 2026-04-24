import type { ReactNode } from 'react';

const styles = {
  info: { border: 'border-blue-400', icon: 'ℹ️' },
  warn: { border: 'border-amber-400', icon: '⚠️' },
  tip: { border: 'border-green-400', icon: '💡' },
} as const;

export function Callout({
  type = 'info', children,
}: { type?: keyof typeof styles; children: ReactNode }) {
  const s = styles[type];
  return (
    <div className={`border-l-4 ${s.border} bg-[var(--bg-elevated)] p-4 my-4 rounded-r-lg`}>
      <div className="flex gap-2">
        <span>{s.icon}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}
