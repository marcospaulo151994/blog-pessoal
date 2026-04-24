import Image from 'next/image';

export function Figure({
  src, caption, width = 800, height = 450,
}: {
  src: string; caption?: string; width?: number; height?: number;
}) {
  return (
    <figure className="my-6">
      <Image src={src} alt={caption ?? ''} width={width} height={height} className="rounded-lg w-full h-auto" />
      {caption && (
        <figcaption className="text-sm text-[var(--text-muted)] mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
