// v0.1 stub: renderiza pre estático. v0.4 substitui por Sandpack.
export function CodePlayground({ lang, code }: { lang: string; code: string }) {
  return (
    <pre className="my-4">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
}
