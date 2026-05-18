import React, { lazy } from 'react';
import {
  Rocket, LayoutDashboard, MessageSquare, Calendar, Users, Columns, CreditCard,
  Megaphone, Workflow, LifeBuoy, GraduationCap, PhoneCall, ArrowUpCircle,
  Briefcase, Share2, BookOpen, TrendingUp, Fingerprint, Layout, ShieldCheck,
  Lightbulb, Cpu, Brain, RefreshCcw, Wifi, Globe, Server, BarChart3, Zap, Bot
} from 'lucide-react';

import { COMPONENT_MAP } from './componentRegistry';

export const PAGE_REGISTRY = {
  dashboard: { component: COMPONENT_MAP.dashboard, icon: LayoutDashboard, label: 'Dashboard' },
  contacts: { component: COMPONENT_MAP.contacts, icon: Users, label: 'Contacts' },
  opportunities: { component: COMPONENT_MAP.opportunities, icon: Columns, label: 'Opportunities' },
  launchpad: { component: COMPONENT_MAP.launchpad, icon: Rocket, label: 'Launchpad' },
  conversations: { component: COMPONENT_MAP.conversations, icon: MessageSquare, label: 'Conversations' },
  calendars: { component: COMPONENT_MAP.calendars, icon: Calendar, label: 'Calendars' },
  payments: { component: COMPONENT_MAP.payments, icon: CreditCard, label: 'Payments' },
  marketing: { component: COMPONENT_MAP.marketing, icon: Megaphone, label: 'Marketing' },
  automation: { component: COMPONENT_MAP.automation, icon: Workflow, label: 'Automation' },
  support: { component: COMPONENT_MAP.support, icon: LifeBuoy, label: 'Support' },
  university: { component: COMPONENT_MAP.university, icon: GraduationCap, label: 'University' },
  outbound: { component: COMPONENT_MAP.outbound, icon: PhoneCall, label: 'Outbound' },
  identity: { component: COMPONENT_MAP.identity, icon: Fingerprint, label: 'Identity & Anti-Detection' },
  factory: { component: COMPONENT_MAP.factory, icon: RefreshCcw, label: 'Account Factory' },
  deliverability: { component: COMPONENT_MAP.deliverability, icon: ShieldCheck, label: 'Deliverability' },
  website: { component: COMPONENT_MAP.website, icon: Layout, label: 'Website Builder' },
  upgrade: { component: COMPONENT_MAP.upgrade, icon: ArrowUpCircle, label: 'Upgrade' },
  services: { component: COMPONENT_MAP.services, icon: Briefcase, label: 'Services' },
  refer: { component: COMPONENT_MAP.refer, icon: Share2, label: 'Refer Us' },
  growth: { component: COMPONENT_MAP.growth, icon: TrendingUp, label: 'Growth Hub' },
  blueprint: { component: COMPONENT_MAP.blueprint, icon: Lightbulb, label: 'Blueprint Architect' },
  'content-board': { component: COMPONENT_MAP['content-board'], icon: Columns, label: 'Content Kanban' },
  resources: { component: COMPONENT_MAP.resources, icon: BookOpen, label: 'Resources' },
  'ai-center': { component: COMPONENT_MAP['ai-center'], icon: Cpu, label: 'AI Command Center' },
  'omni-brain': { component: COMPONENT_MAP['omni-brain'], icon: Brain, label: 'Omni Brain' },
  'apps-hub': { component: COMPONENT_MAP['apps-hub'], icon: RefreshCcw, label: 'Apps & Hub' },
  'connections': { component: COMPONENT_MAP.connections, icon: Zap, label: 'Connections Hub' },
  'browser': { component: COMPONENT_MAP.browser, icon: Globe, label: 'Web Browser' },
  'webhosting': { component: COMPONENT_MAP.webhosting, icon: Server, label: 'Web Hosting' },
  'trading': { component: COMPONENT_MAP.trading, icon: BarChart3, label: 'Trading Hub' },
  'scraper': { component: COMPONENT_MAP.scraper, icon: Bot, label: 'Scraper Agent' },
  'lead-validator': { component: COMPONENT_MAP['lead-validator'], icon: Zap, label: 'Lead Validator' },
};
