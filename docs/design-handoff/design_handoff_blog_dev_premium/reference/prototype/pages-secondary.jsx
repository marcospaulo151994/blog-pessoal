// pages-secondary.jsx — About, Now, Tags, 404, Subscribe

function PageAbout() {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>Sobre</h1>
      <p style={{ color: c.textMuted, fontSize: 18, lineHeight: 1.5, marginTop: 14 }}>
        Olá. Sou Diego, engenheiro de software no Brasil.
      </p>

      <div style={{ marginTop: 28, fontSize: 16, lineHeight: 1.7 }}>
        <p>
          Trabalho com sistemas distribuídos há quase uma década — hoje, com observabilidade. Antes, com infra, redes e backend em geral.
          Escrevo aqui sobre o que aprendo e o que ainda não entendi direito.
        </p>
        <p>
          O blog existe desde 2019. Não tem ads, tracker, nem newsletter automatizada. É um caderno em público — devagar, técnico, e — espero — acolhedor.
        </p>
      </div>

      <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Stack atual', 'Rust · Go · Postgres · OpenTelemetry'],
          ['Editor', 'Neovim, há 8 anos'],
          ['Cidade', 'Belo Horizonte'],
          ['Por aí', 'github · mastodon · email'],
        ].map(([k, v]) => (
          <div key={k} style={{
            padding: '12px 14px', border: `1px solid ${c.border}`,
            borderRadius: 10, background: c.surface,
          }}>
            <div style={{ fontFamily: window.DPFonts.mono, fontSize: 10, color: c.textDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ marginTop: 4, fontSize: 14 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageNow() {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', border: `1px solid ${c.border}`, borderRadius: 999,
        background: c.surface, fontFamily: window.DPFonts.mono, fontSize: 11,
        color: c.textMuted, marginBottom: 18,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.success, animation: 'dpPulse 2s ease-in-out infinite' }} />
        Atualizado em 24.04.26
      </div>

      <h1 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>No que estou agora</h1>
      <p style={{ color: c.textMuted, fontSize: 16, marginTop: 10 }}>
        Inspirado pela <a href="#" style={{ color: c.accent }} className="dp-link">/now</a> de Derek Sivers.
      </p>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          ['Trabalhando em', 'Observabilidade distribuída — passar de "temos traces" para "traces que respondem perguntas".', c.accent],
          ['Lendo', 'Releitura: "The Unix Programming Environment" (Kernighan & Pike).', c.textMuted],
          ['Escrevendo', 'Um leitor RSS minimalista em Rust + ratatui. Open source quando não estiver constrangedor.', c.textMuted],
          ['Aprendendo', 'CRDTs do zero. Lendo o paper original do Yjs no metrô.', c.textMuted],
          ['Tomando café', 'Etiópia, Sidamo, processo natural. Pedido pequeno e local.', c.success],
        ].map(([k, v, accent], i) => (
          <div key={i} className="dp-card" style={{
            padding: '14px 16px', border: `1px solid ${c.border}`,
            borderRadius: 10, background: c.surface,
          }}>
            <div style={{ fontFamily: window.DPFonts.mono, fontSize: 10, color: accent, letterSpacing: 1.5, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ marginTop: 4, fontSize: 15, lineHeight: 1.5 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageTags() {
  const { theme, go } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>Tags</h1>
      <p style={{ color: c.textMuted, fontSize: 15, marginTop: 8 }}>Navegue por assunto.</p>

      <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {window.DPTags.map(([tag, count]) => (
          <button key={tag} className="dp-tag dp-btn" onClick={() => go('archive')} style={{
            padding: '10px 16px', border: `1px solid ${c.border}`,
            borderRadius: 10, background: c.surface, color: c.text,
            fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontWeight: 500 }}>{tag}</span>
            <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textMuted }}>{count}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 40, padding: 20, border: `1px dashed ${c.border}`, borderRadius: 10, color: c.textMuted, fontSize: 13.5, lineHeight: 1.5 }}>
        <strong style={{ color: c.text }}>Em destaque:</strong> Rust e Infra são as duas tags mais ativas em 2026. <window.DPLink to="archive" className="dp-link" style={{ color: c.accent }}>ver arquivo →</window.DPLink>
      </div>
    </div>
  );
}

function Page404() {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{
        fontFamily: window.DPFonts.mono, fontSize: 13, color: c.textMuted,
        letterSpacing: 2, marginBottom: 14,
      }}>
        HTTP/1.1 404 NOT FOUND
      </div>
      <h1 style={{
        margin: 0, fontSize: 96, lineHeight: 1, letterSpacing: -4, fontWeight: 600,
        backgroundImage: theme === 'dark'
          ? 'linear-gradient(180deg,#fff,rgba(255,255,255,0.4))'
          : 'linear-gradient(180deg,#0a0a0c,rgba(10,10,12,0.4))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        404
      </h1>
      <p style={{ color: c.textMuted, fontSize: 17, marginTop: 14 }}>
        Esta página foi otimizada — para fora da existência.
      </p>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <window.DPLink to="home" className="dp-btn" style={{
          padding: '10px 18px',
          background: theme === 'dark' ? '#fff' : '#0a0a0c',
          color: theme === 'dark' ? '#0a0a0c' : '#fff',
          borderRadius: 8, fontWeight: 600, fontSize: 13,
        }}>
          ← voltar para home
        </window.DPLink>
        <window.DPLink to="archive" className="dp-btn" style={{
          padding: '10px 18px', border: `1px solid ${c.border}`,
          borderRadius: 8, fontSize: 13, color: c.text,
        }}>
          ver arquivo
        </window.DPLink>
      </div>
    </div>
  );
}

function PageSubscribe() {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  return (
    <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', paddingTop: 24 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', border: `1px solid ${c.border}`, borderRadius: 999,
        background: c.surface, fontFamily: window.DPFonts.mono, fontSize: 11,
        color: c.accent, marginBottom: 18,
      }}>
        2.412 ASSINANTES
      </div>
      <h1 style={{ margin: 0, fontSize: 48, fontWeight: 600, letterSpacing: -1.8, lineHeight: 1.05 }}>
        Uma carta a cada<br/>quinze dias.
      </h1>
      <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.5, marginTop: 14 }}>
        Direto no e-mail. Sem rastreadores, sem ads. Cancele com um clique.
      </p>

      <div style={{
        display: 'flex', marginTop: 24,
        background: c.surface, border: `1px solid ${c.border}`,
        borderRadius: 10, padding: 4,
      }}>
        <input placeholder="seu@email.com" readOnly style={{
          flex: 1, background: 'transparent', border: 0, outline: 'none',
          color: c.text, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit',
        }} />
        <button className="dp-btn" style={{
          background: theme === 'dark' ? '#fff' : '#0a0a0c',
          color: theme === 'dark' ? '#0a0a0c' : '#fff',
          border: 0, borderRadius: 7, padding: '0 20px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Assinar
        </button>
      </div>

      <div style={{ marginTop: 36, padding: 20, border: `1px solid ${c.border}`, borderRadius: 10, background: c.surface, textAlign: 'left' }}>
        <div style={{ fontFamily: window.DPFonts.mono, fontSize: 10, color: c.textDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          O que esperar
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: c.textMuted }}>
          <li>1 ensaio técnico ou pessoal a cada 15 dias</li>
          <li>Links curados (3-5) que valeram meu tempo</li>
          <li>Atualização do <window.DPLink to="now" className="dp-link" style={{ color: c.accent }}>/now</window.DPLink></li>
          <li>Zero promoção, zero "se inscreva no canal"</li>
        </ul>
      </div>
    </div>
  );
}

window.PageAbout = PageAbout;
window.PageNow = PageNow;
window.PageTags = PageTags;
window.Page404 = Page404;
window.PageSubscribe = PageSubscribe;
