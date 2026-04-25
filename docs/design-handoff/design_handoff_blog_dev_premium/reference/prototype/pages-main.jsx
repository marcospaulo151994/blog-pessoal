// pages-main.jsx — Home, Post, Archive

function PageHome() {
  const { theme, go } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  const featured = window.DPPosts[0];
  const rest = window.DPPosts.slice(1, 5);

  return (
    <div>
      {/* Status pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', border: `1px solid ${c.border}`, borderRadius: 999,
        background: c.surface,
        fontFamily: window.DPFonts.mono, fontSize: 11, marginBottom: 22,
        color: c.textMuted, whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.success, animation: 'dpPulse 2s ease-in-out infinite' }} />
        Novo · {featured.title}
      </div>

      <h1 style={{
        margin: 0, fontSize: 64, lineHeight: 1.0, letterSpacing: -2.5,
        fontWeight: 600,
        backgroundImage: theme === 'dark'
          ? 'linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.55) 100%)'
          : 'linear-gradient(180deg,#0a0a0c 0%,rgba(10,10,12,0.55) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        maxWidth: 720,
      }}>
        Notas técnicas,<br/>sem hype.
      </h1>
      <p style={{ color: c.textMuted, fontSize: 17, lineHeight: 1.5, marginTop: 18, maxWidth: 540 }}>
        Engenheiro de software escrevendo sobre sistemas, redes e o que aprendo no caminho.
        Quinzenal, no seu e-mail, em português.
      </p>

      {/* Inline subscribe */}
      <div style={{
        display: 'flex', maxWidth: 460, marginTop: 22,
        background: c.surface, border: `1px solid ${c.border}`,
        borderRadius: 10, padding: 4,
      }}>
        <input placeholder="seu@email.com" readOnly style={{
          flex: 1, background: 'transparent', border: 0, outline: 'none',
          color: c.text, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit',
        }} />
        <button onClick={() => go('subscribe')} className="dp-btn" style={{
          background: theme === 'dark' ? '#fff' : '#0a0a0c',
          color: theme === 'dark' ? '#0a0a0c' : '#fff',
          border: 0, borderRadius: 7, padding: '0 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Inscrever
        </button>
      </div>

      {/* Featured post */}
      <window.DPLink to={`post:${featured.n}`}>
        <div className="dp-card" style={{
          marginTop: 48, padding: 24,
          border: `1px solid ${c.border}`, borderRadius: 12,
          background: c.surface,
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.accent, letterSpacing: 1.5, marginBottom: 8 }}>
              EM DESTAQUE · {featured.tag.toUpperCase()}
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.2 }}>
              {featured.title}
            </div>
            <div style={{ color: c.textMuted, fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
              {featured.blurb}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 14, fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textMuted, flexWrap: 'wrap' }}>
              <span style={{ whiteSpace: 'nowrap' }}>{featured.date}</span>
              <span>·</span>
              <span style={{ whiteSpace: 'nowrap' }}>{featured.mins} min</span>
            </div>
          </div>
          <div style={{ fontSize: 24, color: c.textMuted }}>→</div>
        </div>
      </window.DPLink>

      {/* Recent list */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontFamily: window.DPFonts.mono, color: c.textMuted, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Recentes
          </h2>
          <window.DPLink to="archive" className="dp-link" style={{ fontSize: 12.5, color: c.textMuted, fontFamily: window.DPFonts.mono }}>
            ver tudo →
          </window.DPLink>
        </div>
        <div style={{ borderTop: `1px solid ${c.border}` }}>
          {rest.map(p => (
            <window.DPLink key={p.n} to={`post:${p.n}`}>
              <div className="dp-row" style={{
                display: 'grid', gridTemplateColumns: '50px 70px 1fr 80px 50px',
                gap: 14, alignItems: 'center', padding: '14px 12px',
                borderBottom: `1px solid ${c.border}`,
                fontSize: 14, margin: '0 -12px',
              }}>
                <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textDim }}>{p.n}</span>
                <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textMuted }}>{p.dateShort}</span>
                <span>{p.title}</span>
                <span className="dp-tag" style={{
                  fontFamily: window.DPFonts.mono, fontSize: 10, padding: '3px 8px',
                  border: `1px solid ${c.border}`, borderRadius: 999, justifySelf: 'start',
                  color: c.textMuted,
                }}>{p.tag}</span>
                <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textDim, textAlign: 'right' }}>{p.mins} min</span>
              </div>
            </window.DPLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function PagePost({ postId }) {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];
  const post = window.DPPosts.find(p => p.n === postId) || window.DPPosts[0];

  return (
    <article style={{ maxWidth: 680, margin: '0 auto' }}>
      <window.DPLink to="archive" className="dp-link" style={{ fontFamily: window.DPFonts.mono, fontSize: 12, color: c.textMuted }}>
        ← arquivo
      </window.DPLink>

      <div style={{ marginTop: 32, fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textMuted, display: 'flex', gap: 14, letterSpacing: 0.5, flexWrap: 'wrap' }}>
        <span style={{ whiteSpace: 'nowrap' }}>№ {post.n}</span>
        <span style={{ whiteSpace: 'nowrap' }}>{post.date}</span>
        <span>·</span>
        <span style={{ color: c.accent, whiteSpace: 'nowrap' }}>{post.tag}</span>
        <span>·</span>
        <span style={{ whiteSpace: 'nowrap' }}>{post.mins} min de leitura</span>
      </div>

      <h1 style={{ margin: '14px 0 0', fontSize: 44, lineHeight: 1.05, letterSpacing: -1.5, fontWeight: 600 }}>
        {post.title}
      </h1>
      <p style={{ color: c.textMuted, fontSize: 19, lineHeight: 1.4, marginTop: 14, fontWeight: 400 }}>
        {post.blurb}
      </p>

      <hr style={{ border: 0, borderTop: `1px solid ${c.border}`, margin: '32px 0' }} />

      <div style={{ fontSize: 17, lineHeight: 1.65, color: c.text }}>
        <p style={{ margin: '0 0 1em' }}>
          Comecei o ano com uma pergunta simples: o parser que mantenho há três anos é lento o suficiente para justificar uma reescrita? A resposta foi sim — mas o caminho até lá ensinou bem mais do que performance.
        </p>
        <p style={{ margin: '0 0 1em' }}>
          O parser original, escrito em Python, fazia <code style={{ background: c.code, color: c.codeText, padding: '2px 6px', borderRadius: 4, fontFamily: window.DPFonts.mono, fontSize: 14 }}>~12k LOC</code> e processava arquivos grandes a uma taxa que, em produção, custava segundos visíveis ao usuário.
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5, margin: '32px 0 12px' }}>
          O que ownership realmente ensina
        </h2>
        <p style={{ margin: '0 0 1em' }}>
          Por anos eu tinha lido sobre <em>borrow checker</em> e empurrado a ideia para depois. Quando finalmente sentei para reescrever, percebi que o exercício de pensar em vidas de objetos forçou uma clareza estrutural que o código original não tinha.
        </p>

        {/* Code block */}
        <div style={{
          background: c.surface, border: `1px solid ${c.border}`,
          borderRadius: 10, padding: 16, margin: '20px 0',
          fontFamily: window.DPFonts.mono, fontSize: 13.5, lineHeight: 1.6,
          overflow: 'auto',
        }}>
          <div style={{ color: c.textDim }}>// ownership transferido, sem alocações extras</div>
          <div><span style={{ color: c.codeText }}>fn</span> <span style={{ color: c.success }}>parse</span>(input: <span style={{ color: c.codeText }}>&str</span>) -&gt; Result&lt;Ast, Error&gt; {'{'}</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: c.codeText }}>let</span> tokens = lex(input)?;</div>
          <div style={{ paddingLeft: 16 }}>Parser::new(tokens).parse_program()</div>
          <div>{'}'}</div>
        </div>

        <p style={{ margin: '0 0 1em' }}>
          O resultado: 4× mais rápido, 30% menos linhas, e — surpreendentemente — mais legível para quem nunca tinha lido Rust antes.
        </p>
      </div>

      {/* Bottom meta */}
      <div style={{
        marginTop: 48, padding: '20px 0',
        borderTop: `1px solid ${c.border}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: window.DPFonts.mono, fontSize: 12, color: c.textMuted,
      }}>
        <span>↑ topo</span>
        <span>compartilhar · responder por email</span>
      </div>
    </article>
  );
}

function PageArchive() {
  const { theme } = React.useContext(window.DPNav);
  const c = window.DPColors[theme];

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>Arquivo</h1>
      <p style={{ color: c.textMuted, fontSize: 15, marginTop: 8 }}>
        {window.DPPosts.length} textos · do mais recente ao mais antigo
      </p>

      <div style={{
        display: 'flex', gap: 8, marginTop: 22,
        padding: '10px 14px', background: c.surface,
        border: `1px solid ${c.border}`, borderRadius: 10,
      }}>
        <span style={{ color: c.textDim }}>⌕</span>
        <input placeholder="Buscar por título, tag ou ano..." readOnly style={{
          flex: 1, background: 'transparent', border: 0, outline: 'none',
          color: c.text, fontSize: 14, fontFamily: 'inherit',
        }} />
        <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textDim,
          padding: '2px 6px', border: `1px solid ${c.border}`, borderRadius: 4 }}>⌘K</span>
      </div>

      <div style={{ marginTop: 28, borderTop: `1px solid ${c.border}` }}>
        {window.DPPosts.map(p => (
          <window.DPLink key={p.n} to={`post:${p.n}`}>
            <div className="dp-row" style={{
              display: 'grid', gridTemplateColumns: '50px 90px 1fr 90px 60px',
              gap: 16, alignItems: 'center', padding: '14px 12px',
              borderBottom: `1px solid ${c.border}`,
              fontSize: 14, margin: '0 -12px',
            }}>
              <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textDim }}>№ {p.n}</span>
              <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textMuted }}>{p.date}</span>
              <span style={{ fontWeight: 500 }}>{p.title}</span>
              <span style={{
                fontFamily: window.DPFonts.mono, fontSize: 10, padding: '3px 8px',
                border: `1px solid ${c.border}`, borderRadius: 999, justifySelf: 'start',
                color: c.textMuted,
              }}>{p.tag}</span>
              <span style={{ fontFamily: window.DPFonts.mono, fontSize: 11, color: c.textDim, textAlign: 'right' }}>{p.mins} min</span>
            </div>
          </window.DPLink>
        ))}
      </div>
    </div>
  );
}

window.PageHome = PageHome;
window.PagePost = PagePost;
window.PageArchive = PageArchive;
