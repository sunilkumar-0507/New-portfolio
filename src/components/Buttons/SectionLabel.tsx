type Props = { index: string; label: string; className?: string; align?: 'left' | 'center' }

/** "(01) ——— About K76" eyebrow used at the top of every section. */
export default function SectionLabel({ index, label, className = '', align = 'left' }: Props) {
  return (
    <div
      data-section-label
      className={`t-label flex items-center gap-4 text-muted ${align === 'center' ? 'justify-center' : ''} ${className}`}
    >
      <span className="text-accent">({index})</span>
      <span data-label-line className="h-px w-14 origin-left bg-white/30" />
      <span>{label}</span>
    </div>
  )
}
