import { LOGO_PATHS, LOGO_VIEWBOX } from '../Loader/logoPaths'

// Glyph colours echo the logo panels: lime K, white 7, violet 6.
const GLYPH_FILL = ['#9bc23a', '#ffffff', '#8b3fd9']

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
          fill={GLYPH_FILL[i]}
          className={animated ? 'logo-glyph' : undefined}
          style={animated ? { animationDelay: `${i * 0.12}s` } : undefined}
        />
      ))}
    </svg>
  )
}
