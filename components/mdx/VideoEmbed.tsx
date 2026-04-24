export function VideoEmbed({ src, poster }: { src: string; poster?: string }) {
  return (
    <video controls preload="metadata" poster={poster} className="w-full rounded-lg my-6">
      <source src={src} />
    </video>
  );
}
