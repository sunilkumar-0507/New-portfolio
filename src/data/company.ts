// Single source of truth for K76 company information.
// Content sourced from the existing K76 Business Solutions website.

export const company = {
  name: 'K76 Business Solutions',
  shortName: 'K76',
  url: 'https://k76.in',
  tagline: 'Build Smarter. Market Better. Grow Faster.',
  founded: 2021,
  email: 'hello@k76.in',
  phoneDisplay: '+91 91762 37622',
  phoneE164: '+919176237622',
  whatsappNumber: '919176237622',
  hours: 'Mon–Sun · 10am to 10pm IST',
  description:
    'K76 Business Solutions builds websites, custom software, CRMs, brands, marketing and AI automation for growing businesses — and trains the next generation of talent through K76 Learn.',
} as const

export const offices = [
  { label: 'Chennai — Kalavakkam', lines: ['SSN IFOUND, Kalavakkam', 'Thirupporur P/o'], city: 'Chennai', postalCode: '603110' },
  { label: 'Tenkasi', lines: ['Arunachalapuram', 'Kadayanallur Taluk'], city: 'Tenkasi', postalCode: '627862' },
] as const

export const about = {
  who: 'K76 Business Solutions is a multidisciplinary team of marketers, engineers, designers and strategists. We partner with founders and brands to turn ideas into compounding growth — from the first wireframe onwards.',
  origin:
    'K76 started with a simple frustration: businesses were juggling four different vendors — an agency for marketing, a freelancer for the website, a designer for the brand and “someone” for automation. Nothing connected. We built K76 to be the partner we wished existed.',
  today:
    'Today, we ship websites, CRMs, brand systems, performance campaigns and AI automations for founders and growing companies across India.',
  mission: 'Help 1,000 businesses scale by 2030 with measurable, compounding systems.',
  vision: 'Become India’s most trusted partner for marketing, software and AI together.',
  promise: 'Senior teams, transparent reporting, work we’d happily put our name on.',
} as const

export const philosophy = [
  { title: 'Outcome obsession', body: 'We optimise for the business result, not the deliverable.' },
  { title: 'Radical clarity', body: 'Honest scopes, honest timelines, honest reporting.' },
  { title: 'Craft matters', body: 'We sweat the details others quietly skip.' },
  { title: 'Long-term partner', body: 'Most clients stay with us beyond the first project.' },
] as const

export const principles = [
  { title: 'Outcome-first', body: 'Tied to revenue, not vanity metrics.' },
  { title: 'Senior teams', body: 'No handoffs to juniors after the pitch.' },
  { title: 'Transparent', body: 'Weekly reporting on every engagement.' },
  { title: 'End-to-end', body: 'Strategy, build, launch and growth — together.' },
] as const

export const founder = {
  name: 'Pearari Krishnan K',
  role: 'Founder & Chief Executive Officer',
  quote: 'Technology should empower businesses to grow faster — not become another problem to manage.',
} as const

export const stats = [
  { value: 2021, prefix: '', suffix: '', label: 'Founded', isYear: true },
  { value: 100, prefix: '', suffix: '+', label: 'Projects shipped', isYear: false },
  { value: 50, prefix: '', suffix: '+', label: 'Clients', isYear: false },
  { value: 5, prefix: '', suffix: '', label: 'Business verticals', isYear: false },
] as const

export const milestones = [
  { year: '2021', title: 'K76 founded', body: 'Started as a small marketing studio with three founding clients.' },
  { year: '2022', title: 'Engineering arm', body: 'Launched the software practice — websites, CRMs and dashboards.' },
  { year: '2023', title: 'K76 Learn', body: 'Opened the EdTech vertical with placement-driven cohorts.' },
  { year: '2024', title: 'AI Solutions', body: 'Built our internal AI lab — automations, chatbots, agents.' },
  { year: '2025', title: 'K76 Land & Cafe', body: 'Expanded into real estate and a coworking cafe community.' },
] as const

export const strengths = [
  { title: 'Innovation First', body: 'We bring new tools, AI and fresh thinking to every brief — so your business stays ahead, not just current.' },
  { title: 'Technology Driven', body: 'Senior engineers build on modern, proven stacks — web, mobile, cloud and automation engineered for speed.' },
  { title: 'Creative Thinking', body: 'Brand, interface and campaign ideas designed around how your customers actually decide.' },
  { title: 'Client Focused', body: 'Outcome-first and transparent — weekly reporting, honest scopes and no handoffs after the pitch.' },
  { title: 'Scalable Solutions', body: 'Systems that grow with you — from a first website to CRMs, ERPs and AI workflows.' },
  { title: 'Continuous Support', body: 'Measure, optimise and compound. We stay on after launch — most clients stay beyond the first project.' },
] as const

export const approach = [
  { index: '01', title: 'Understand', body: 'We audit, listen and pinpoint where growth is leaking — your customers, your numbers, your current tools.' },
  { index: '02', title: 'Strategize', body: 'Goals become a plan: scope, priorities, budget and the metrics we will be judged against. Signed before anything is built.' },
  { index: '03', title: 'Design', body: 'Brand, interface and flows designed around how your customers actually decide — reviewed with you screen by screen.' },
  { index: '04', title: 'Develop', body: 'Senior engineers ship in short, transparent sprints. You see working software every week, not a reveal at the end.' },
  { index: '05', title: 'Deliver', body: 'Testing, performance, SEO and analytics are in place before go-live. Your team is trained to run it on day one.' },
] as const

export type Division = {
  id: 'solutions' | 'learn' | 'products'
  index: string
  title: string
  kicker: string
  role: string
  summary: string
  items: readonly string[]
  href?: string
  hrefLabel?: string
}

export const divisions: readonly Division[] = [
  {
    id: 'solutions',
    index: '01',
    title: 'K76 Business Solutions',
    kicker: 'Build · Market · Automate',
    role: 'Builds & grows',
    summary:
      'One senior team across software, marketing, branding and automation — so growth stops being a multi-vendor maze.',
    items: ['Website Development', 'Custom Software Development', 'Web Application Development', 'Digital Marketing', 'Branding and Identity', 'Business Automation', 'Business Consulting'],
  },
  {
    id: 'learn',
    index: '02',
    title: 'K76 Learn',
    kicker: 'EdTech & Placement',
    role: 'Trains talent',
    summary:
      'Cohort-based, career-focused training taught by working professionals — with capstone projects, internships and placement preparation. New cohorts every month.',
    items: ['Full Stack Development', 'Frontend Development', 'Backend Development', 'UI/UX Design', 'Programming', 'Digital Marketing', 'Practical Industry Training'],
    href: 'https://k76learn.in/',
    hrefLabel: 'Explore K76 Learn',
  },
  {
    id: 'products',
    index: '03',
    title: 'K76 Products',
    kicker: 'Software we own & ship',
    role: 'Packages what works',
    summary:
      'Business software built from what we learn on client work — systems that run operations, money and customer relationships.',
    items: ['CRM Platforms', 'Business Management Systems', 'Financial Management Software', 'SaaS Applications', 'Custom Business Tools'],
  },
] as const

export const flywheel = [
  { from: 'K76 Learn', to: 'Business Solutions', label: 'Skilled people' },
  { from: 'Business Solutions', to: 'K76 Products', label: 'Proven solutions' },
  { from: 'K76 Products', to: 'K76 Learn', label: 'Real tools to learn on' },
] as const

export const learnPrograms = [
  { title: 'Web Development', weeks: 16 },
  { title: 'Digital Marketing', weeks: 12 },
  { title: 'Python Programming', weeks: 12 },
  { title: 'Java Programming', weeks: 12 },
  { title: 'UI / UX Design', weeks: 10 },
  { title: 'Graphic Design', weeks: 8 },
] as const

export const industries = ['Education', 'Healthcare', 'Real Estate', 'E-commerce', 'SaaS', 'Hospitality', 'Manufacturing', 'Finance', 'Legal', 'Travel', 'Logistics', 'Wellness'] as const

export type SocialKey = 'instagram' | 'linkedin' | 'facebook' | 'x'

export const socials: readonly { key: SocialKey; label: string; handle: string; href: string }[] = [
  { key: 'instagram', label: 'Instagram', handle: '@k76.in', href: 'https://www.instagram.com/k76.in' },
  { key: 'linkedin', label: 'LinkedIn', handle: 'K76 Business Solutions', href: 'https://www.linkedin.com/company/k76-business-solutions' },
  { key: 'facebook', label: 'Facebook', handle: 'K76', href: 'https://www.facebook.com/share/1bKEAMxf8T/' },
  { key: 'x', label: 'X', handle: '@k76bs', href: 'https://x.com/k76bs' },
]

export const whatsappLink = (text?: string) =>
  `https://wa.me/${company.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const q = params.toString().replace(/\+/g, '%20')
  return `mailto:${company.email}${q ? `?${q}` : ''}`
}
