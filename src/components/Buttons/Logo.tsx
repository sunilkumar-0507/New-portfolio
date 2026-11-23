import { LOGO_PATHS, LOGO_VIEWBOX } from '../Loader/logoPaths'

type Props = { className?: string; title?: string; animated?: boolean }

/** K76 wordmark — real Anton glyph outlines, the "K" in brand red. */
export default function Logo({ className = '', title = 'K76', animated = false }: Props) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label={title}>
      <title>{title}</title>
      {LOGO_PATHS.map((p, i) => (
        <path
          key={p.ch}
          d={p.d}
          fill={i === 0 ? '#ff1538' : '#ffffff'}
          className={animated ? 'logo-glyph' : undefined}
          style={animated ? { animationDelay: `${i * 0.12}s` } : undefined}
        />
      ))}
    </svg>
  )
}
