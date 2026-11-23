export type NavItem = { label: string; id: string }

export const navItems: readonly NavItem[] = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Why K76', id: 'why' },
  { label: 'Contact', id: 'contact' },
] as const

export const footerNav: readonly NavItem[] = [
  ...navItems.slice(0, 4),
  { label: 'Approach', id: 'approach' },
  { label: 'Ecosystem', id: 'ecosystem' },
  { label: 'Contact', id: 'contact' },
]
