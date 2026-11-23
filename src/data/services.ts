import type { LucideIcon } from 'lucide-react'
import { Bot, Code2, GraduationCap, LayoutTemplate, Megaphone, MonitorSmartphone, PenTool, ShoppingBag, Sparkles } from 'lucide-react'

export type Service = {
  index: string
  title: string
  short: string
  description: string
  tags: readonly string[]
  icon: LucideIcon
}

export const services: readonly Service[] = [
  {
    index: '01',
    title: 'Website Development',
    short: 'Websites',
    description: 'Fast, search-ready business websites that look premium and convert visitors into enquiries.',
    tags: ['Business Websites', 'Landing Pages', 'SEO-ready', 'Performance'],
    icon: MonitorSmartphone,
  },
  {
    index: '02',
    title: 'Custom Software Development',
    short: 'Software',
    description: 'CRM, ERP and management systems for schools, colleges, hospitals and growing businesses — built around how you operate.',
    tags: ['CRM & ERP', 'Institution Systems', 'Custom Software', 'API & Cloud'],
    icon: Code2,
  },
  {
    index: '03',
    title: 'Web Application Development',
    short: 'Web Apps',
    description: 'Web and mobile applications engineered for speed and scale, shipped in short, transparent sprints.',
    tags: ['Web Apps', 'Mobile Apps', 'Dashboards', 'SaaS'],
    icon: LayoutTemplate,
  },
  {
    index: '04',
    title: 'E-commerce Solutions',
    short: 'E-commerce',
    description: 'Online stores with smooth checkout, catalogue management and the marketing to keep orders coming.',
    tags: ['Online Stores', 'Payments', 'Catalogue', 'Growth'],
    icon: ShoppingBag,
  },
  {
    index: '05',
    title: 'UI/UX Design',
    short: 'UI/UX',
    description: 'Interfaces and flows designed around how your customers actually decide — reviewed with you screen by screen.',
    tags: ['Research', 'Wireframes', 'Interface Design', 'Design Systems'],
    icon: PenTool,
  },
  {
    index: '06',
    title: 'Digital Marketing',
    short: 'Marketing',
    description: 'Performance-led marketing that grows pipeline, not just impressions.',
    tags: ['SEO & Content', 'Google Ads', 'Meta Ads', 'Lead Generation'],
    icon: Megaphone,
  },
  {
    index: '07',
    title: 'Branding & Creative Solutions',
    short: 'Branding',
    description: 'Identity systems and creative that make your brand impossible to ignore.',
    tags: ['Logo & Identity', 'Packaging', 'Video Editing', 'Brand Guidelines'],
    icon: Sparkles,
  },
  {
    index: '08',
    title: 'AI & Automation',
    short: 'AI',
    description: 'Automations and AI assistants that compound time, not headcount.',
    tags: ['AI Chatbots', 'WhatsApp Automation', 'CRM Automation', 'Custom AI Agents'],
    icon: Bot,
  },
  {
    index: '09',
    title: 'Technical Education – K76 Learn',
    short: 'K76 Learn',
    description: 'Career-focused cohorts in development, design and marketing — taught by people doing the work every day.',
    tags: ['Full Stack', 'UI/UX', 'Programming', 'Placements'],
    icon: GraduationCap,
  },
] as const
