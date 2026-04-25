// shell.jsx — chrome compartilhado, tema, navegação, hover system
// Estilo Linear/Vercel/Resend: gradientes sutis, mono+sans, gridlines

window.DPColors = {
  dark: {
    bg: '#0a0a0c',
    surface: '#101013',
    surfaceHover: '#15151a',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#ededed',
    textMuted: 'rgba(237,237,237,0.55)',
    textDim: 'rgba(237,237,237,0.35)',
    accent: '#a78bfa',
    accentDim: 'rgba(167,139,250,0.5)',
    code: 'rgba(167,139,250,0.12)',
    codeText: '#c4b5fd',
    success: '#4ade80',
    glowA: 'rgba(120,80,180,0.18)',
    glowB: 'rgba(60,140,200,0.12)',
  },
  light: {
    bg: '#fafaf7',
    surface: '#ffffff',
    surfaceHover: '#f5f5f0',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.14)',
    text: '#0a0a0c',
    textMuted: 'rgba(10,10,12,0.6)',
    textDim: 'rgba(10,10,12,0.4)',
    accent: '#7c3aed',
    accentDim: 'rgba(124,58,237,0.5)',
    code: 'rgba(124,58,237,0.08)',
    codeText: '#5b21b6',
    success: '#16a34a',
    glowA: 'rgba(167,139,250,0.16)',
    glowB: 'rgba(96,165,250,0.10)',
  },
};

window.DPFonts = {
  sans: '"Inter", "Söhne", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"JetBrains Mono", "Söhne Mono", ui-monospace, monospace',
};

// Routing
window.DPNav = React.createContext({ page: 'home', go: () => {}, theme: 'dark', setTheme: () => {} });

function DPLink({ to, children, style, className }) {
  const { go } = React.useContext(window.DPNav);
  return (
    <a
      onClick={(e) => { e.preventDefault(); go(to); }}
      href={`#${to}`}
      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', ...style }}
      className={className}
    >
      {children}
    </a>
  );
}
window.DPLink = DPLink;

// Pulse keyframe (registered once)
if (typeof document !== 'undefined' && !document.getElementById('dp-keyframes')) {
  const s = document.createElement('style');
  s.id = 'dp-keyframes';
  s.textContent = `
    @keyframes dpPulse{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes dpFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .dp-row{transition:background .15s}
    .dp-row:hover{background:var(--dp-surface-hover)}
    .dp-card{transition:border-color .15s,background .15s,transform .15s}
    .dp-card:hover{border-color:var(--dp-border-strong);background:var(--dp-surface-hover)}
    .dp-btn{transition:opacity .15s,background .15s,border-color .15s,transform .1s}
    .dp-btn:hover{opacity:.85}
    .dp-btn:active{transform:translateY(1px)}
    .dp-tag{transition:background .15s,border-color .15s}
    .dp-tag:hover{border-color:var(--dp-border-strong);background:var(--dp-surface-hover)}
    .dp-link{position:relative}
    .dp-link::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;opacity:0;transition:opacity .15s}
    .dp-link:hover::after{opacity:.5}
    .dp-bg-grid{background-image:linear-gradient(var(--dp-grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--dp-grid-line) 1px,transparent 1px);background-size:40px 40px}
  `;
  document.head.appendChild(s);
}

function DPShell({ children }) {
  const { theme, setTheme, page, go } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];

  // Inject CSS variables for hover styles
  const cssVars = {
    '--dp-surface-hover': c.surfaceHover,
    '--dp-border-strong': c.borderStrong,
    '--dp-grid-line': theme === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)',
  };

  const navItems = [
    ['posts', 'Posts'],
    ['archive', 'Arquivo'],
    ['about', 'Sobre'],
    ['now', 'Now'],
    ['tags', 'Tags'],
  ];

  return (
    <div style={{
      ...cssVars,
      width: '100%', minHeight: '100%',
      background: c.bg, color: c.text,
      fontFamily: window.DPFonts.sans,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at top right, ${c.glowA}, transparent 50%), radial-gradient(ellipse at bottom left, ${c.glowB}, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      {/* Subtle grid */}
      <div className="dp-bg-grid" style={{
        position: 'absolute', inset: 0,
        maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
        pointerEvents: 'none',
      }} />

      {/* Top nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: theme === 'dark' ? 'rgba(10,10,12,0.7)' : 'rgba(250,250,247,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${c.border}`,
      }}>
        <div style={{
          maxWidth: 980, margin: '0 auto',
          padding: '14px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <DPLink to="home" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              background: theme === 'dark'
                ? 'linear-gradient(135deg,#fff 0%,#888 100%)'
                : 'linear-gradient(135deg,#0a0a0c 0%,#444 100%)',
            }} />
            <span style={{ fontWeight: 600, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>diego costa</span>
            <span style={{
              fontFamily: window.DPFonts.mono, fontSize: 10,
              color: c.textMuted, padding: '2px 6px',
              border: `1px solid ${c.border}`, borderRadius: 4,
            }}>v2.0</span>
          </DPLink>

          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {navItems.map(([id, label]) => (
              <DPLink key={id} to={id} style={{
                padding: '6px 12px', fontSize: 13,
                color: page === id ? c.text : c.textMuted,
                borderRadius: 6,
                background: page === id ? c.surfaceHover : 'transparent',
                fontWeight: page === id ? 500 : 400,
              }}>
                {label}
              </DPLink>
            ))}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="dp-btn"
              style={{
                marginLeft: 8, padding: '6px 8px',
                background: 'transparent', border: `1px solid ${c.border}`,
                borderRadius: 6, cursor: 'pointer',
                color: c.text, fontSize: 13,
                fontFamily: window.DPFonts.mono,
              }}
              title="Alternar tema"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button
              onClick={() => go('subscribe')}
              className="dp-btn"
              style={{
                marginLeft: 4, padding: '6px 14px',
                background: theme === 'dark' ? '#fff' : '#0a0a0c',
                color: theme === 'dark' ? '#0a0a0c' : '#fff',
                border: 0, borderRadius: 6, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600,
              }}
            >
              Inscrever
            </button>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main key={page} style={{
        maxWidth: 980, margin: '0 auto', padding: '32px',
        position: 'relative', zIndex: 1,
        animation: 'dpFadeUp .35s cubic-bezier(.2,.7,.3,1)',
      }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${c.border}`,
        marginTop: 60,
      }}>
        <div style={{
          maxWidth: 980, margin: '0 auto',
          padding: '24px 32px',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: c.textMuted, fontFamily: window.DPFonts.mono,
        }}>
          <span>© 2026 diego costa · feito com cuidado</span>
          <span style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'inherit' }} className="dp-link">github</a>
            <a href="#" style={{ color: 'inherit' }} className="dp-link">rss</a>
            <a href="#" style={{ color: 'inherit' }} className="dp-link">email</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
window.DPShell = DPShell;
