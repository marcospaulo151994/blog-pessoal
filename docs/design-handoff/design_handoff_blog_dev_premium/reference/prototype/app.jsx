// app.jsx — root, routing, theme

function App() {
  const [page, setPage] = React.useState('home');
  const [theme, setTheme] = React.useState('dark');

  const ctx = { page, go: setPage, theme, setTheme };

  // Parse page id (post:087 etc)
  let activePage = page;
  let postId = null;
  if (page.startsWith('post:')) {
    activePage = 'posts';
    postId = page.slice(5);
  } else if (page === 'posts') {
    // 'posts' nav item shows archive
    activePage = 'archive';
  }

  return (
    <window.DPNav.Provider value={ctx}>
      <window.DPShell>
        {(() => {
          if (page === 'home') return <window.PageHome />;
          if (page.startsWith('post:')) return <window.PagePost postId={postId} />;
          if (page === 'archive' || page === 'posts') return <window.PageArchive />;
          if (page === 'about') return <window.PageAbout />;
          if (page === 'now') return <window.PageNow />;
          if (page === 'tags') return <window.PageTags />;
          if (page === 'subscribe') return <window.PageSubscribe />;
          return <window.Page404 />;
        })()}
      </window.DPShell>
    </window.DPNav.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
