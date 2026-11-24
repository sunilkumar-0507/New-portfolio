type Props = { className?: string; alt?: string }

/** The official K76 app-icon logo (cropped from k76-logo.jpeg into public/brand). */
export default function BrandMark({ className = 'h-11 w-11', alt = 'K76 logo' }: Props) {
  return (
    <img
      src="/brand/k76-logo.png"
      alt={alt}
      width={256}
      height={256}
      decoding="async"
      className={`select-none drop-shadow-[0_4px_18px_rgba(139,63,217,0.35)] ${className}`}
      draggable={false}
    />
  )
}
