import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  Send,
  Globe,
  Building2,
  Compass,
  BarChart3,
  ShieldCheck,
  Users,
  TrendingUp,
  Quote,
  Star,
  Menu,
  X,
  Database,
  CalendarClock,
  Layers,
  Target,
  Eye,
  Award,
  HeartHandshake,
} from 'lucide-react';
import {
  ProjectRecord,
  ProjectCategory,
  UpcomingProjectRecord,
  TestimonialRecord,
  SiteSettingsRecord,
} from './types';
import {
  HERO_BANNER_IMAGE,
  INITIAL_PROJECTS,
  INITIAL_UPCOMING_PROJECTS,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
  INVESTMENT_CORRIDORS,
  WHY_CHOOSE_FEATURES,
} from './data/initialData';
import { BrandLogo } from './components/BrandLogo';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { XamppArchitectureModal } from './components/XamppArchitectureModal';
import { LegalModal } from './components/LegalModal';
import { AIAgentWidget } from './components/AIAgentWidget';

const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Farmhouse Projects',
  'Land Investment Projects',
  'Residential Projects',
  'Commercial Projects',
  'Plotted Developments',
];

export default function App() {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [upcomingProjects, setUpcomingProjects] = useState<UpcomingProjectRecord[]>(
    INITIAL_UPCOMING_PROJECTS
  );
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<SiteSettingsRecord>(INITIAL_SITE_SETTINGS);

  // Navigation & Filters
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');

  // Modals State
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectRecord | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isXamppModalOpen, setIsXamppModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<'privacy' | 'terms' | 'disclaimer' | null>(
    null
  );

  // Contact / Enquiry Form State (Exact Required Fields)
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProject, setFormProject] = useState(
    'RD INFRA Greenwoods Farmhouse Estate (Sample Placeholder)'
  );
  const [formRequirement, setFormRequirement] = useState('Farmhouse Projects');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load live data from backend on mount + restore locally uploaded Director photo if present
  useEffect(() => {
    const savedLocalDirectorPhoto = localStorage.getItem('rd_infra_director_photo');
    fetch('/api/bootstrap')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (Array.isArray(data.upcomingProjects) && data.upcomingProjects.length > 0) {
          setUpcomingProjects(data.upcomingProjects);
        }
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
        if (data.settings) {
          setSettings({
            ...data.settings,
            director: {
              ...data.settings.director,
              photo_url:
                savedLocalDirectorPhoto ||
                data.settings.director?.photo_url ||
                '/director-portrait.jpg',
            },
          });
        }
      })
      .catch(() => {
        if (savedLocalDirectorPhoto) {
          setSettings((prev) => ({
            ...prev,
            director: {
              ...prev.director,
              photo_url: savedLocalDirectorPhoto,
            },
          }));
        }
      });
  }, []);

  const handleDirectorPhotoSelected = (dataUrl: string) => {
    try {
      localStorage.setItem('rd_infra_director_photo', dataUrl);
    } catch {
      // ignore storage quota
    }
    setSettings((prev) => ({
      ...prev,
      director: {
        ...prev.director,
        photo_url: dataUrl,
      },
    }));
    fetch('/api/director/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_url: dataUrl }),
    }).catch(() => {});
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.project_type === selectedCategory);
  }, [projects, selectedCategory]);

  const submitEnquiryToBackend = async (payload: {
    name: string;
    phone: string;
    email: string;
    project: string;
    requirement: string;
    message: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return true;
    }
  };

  const handleMainEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;
    setFormSubmitting(true);
    const ok = await submitEnquiryToBackend({
      name: formName,
      phone: formPhone,
      email: formEmail,
      project: formProject,
      requirement: formRequirement,
      message: formMessage,
    });
    setFormSubmitting(false);
    if (ok) {
      setFormSubmitted(true);
    }
  };

  const prefillEnquiryAndScroll = (projectName: string, projectCategory: string) => {
    setFormProject(projectName);
    setFormRequirement(projectCategory);
    setFormSubmitted(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDirectLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.company_name} (${settings.domain}), I would like to schedule a consultation regarding your real estate and farmhouse projects.`
  )}`;

  const whyIcons = [Building2, Compass, BarChart3, ShieldCheck, Users, TrendingUp];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1E293B]">
      {/* 1. TOP CORPORATE BAR (STRICT 3-COLOR SYSTEM: BLUE, GREY, WHITE) */}
      <div className="bg-[#1E293B] text-slate-200 border-b border-slate-700 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
            <span className="font-semibold text-white">{settings.company_name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 truncate">“{settings.tagline}”</span>
            <span className="text-slate-500 hidden md:inline">·</span>
            <span className="text-slate-300 hidden md:inline">Since 2014</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="#home"
              className="hover:text-white font-semibold text-white flex items-center gap-1.5 whitespace-nowrap"
              title="Official RD INFRA Website"
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span>Official Website: rd-infra</span>
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="hover:text-white flex items-center gap-1.5 whitespace-nowrap"
              title="Official RD INFRA Email ID"
            >
              <Mail className="w-3.5 h-3.5 text-slate-300" />
              <span>{settings.email}</span>
            </a>

            <a
              href={`tel:+91${settings.phone_raw}`}
              className="hover:text-white font-mono-tabular font-semibold text-white flex items-center gap-1.5 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              <span>{settings.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsXamppModalOpen(true)}
              className="hover:text-white flex items-center gap-1 text-slate-300 whitespace-nowrap cursor-pointer"
              title="XAMPP, PHP & MySQL (rd_infra) Setup Guide"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">XAMPP & SQL Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="px-2.5 py-1 rounded bg-[#0A4D92] hover:bg-[#083D75] text-white flex items-center gap-1 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY NAVIGATION BAR (3-Zone Contract + Mobile Hamburger Menu) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Official RD INFRA Logo */}
          <a href="#home" className="shrink-0">
            <BrandLogo size="md" showTagline={true} darkText={true} />
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#home"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Home
            </a>
            <a
              href="#about"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              About RD INFRA
            </a>
            <a
              href="#director"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Meet Our Director
            </a>
            <a
              href="#projects"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Projects
            </a>
            <a
              href="#upcoming"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Upcoming Projects
            </a>
            <a
              href="#corridors"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Investment Corridors
            </a>
            <a
              href="#testimonials"
              className="hover:text-[#0A4D92] transition-colors whitespace-nowrap shrink-0"
            >
              Testimonials
            </a>
          </nav>

          {/* Zone 3: Primary CTA Button + Mobile Hamburger Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              className="hidden sm:inline-flex px-5 py-2.5 text-xs font-semibold text-white bg-[#0A4D92] hover:bg-[#083D75] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Schedule a Consultation
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 text-sm font-medium text-slate-700">
            {[
              { href: '#home', label: 'Home' },
              { href: '#about', label: 'About RD INFRA' },
              { href: '#director', label: 'Meet Our Director' },
              { href: '#projects', label: 'Projects' },
              { href: '#upcoming', label: 'Upcoming Projects' },
              { href: '#corridors', label: 'Investment Corridors' },
              { href: '#testimonials', label: 'Testimonials' },
              { href: '#contact', label: 'Contact RD INFRA' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0A4D92]"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 3. PREMIUM HERO SECTION */}
      <section
        id="home"
        className="relative bg-[#1E293B] text-white overflow-hidden border-b border-slate-200"
      >
        <div className="absolute inset-0">
          <img
            src={HERO_BANNER_IMAGE}
            alt="RD INFRA Premium Farmhouse & Real Estate Development"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B] via-[#1E293B]/90 to-[#1E293B]/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="text-xs font-semibold tracking-widest uppercase text-slate-300">
                {settings.company_name} · “{settings.tagline}”
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-[54px] leading-[1.12] tracking-tight text-white">
                {settings.hero_headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                {settings.hero_subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-6 py-3.5 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-lg bg-white hover:bg-slate-100 text-[#1E293B] font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Official Unedited RD INFRA Brand Emblem Card */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-xs w-full text-center space-y-3">
                <div className="w-36 h-36 mx-auto flex items-center justify-center">
                  <img
                    src="/rd-infra-logo.svg"
                    alt="RD INFRA Official Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-heading font-bold text-sm text-[#1E293B]">
                    Trusted Real Estate Partner
                  </div>
                  <div className="text-xs font-semibold text-[#0A4D92] mt-0.5">
                    Official Website: rd-infra
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Required Trust Indicators Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/15">
              <div className="font-heading font-bold text-xl text-white">Since 2014</div>
              <p className="text-xs text-slate-300 mt-1">
                Established track record in North Indian real estate markets
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/15">
              <div className="font-heading font-bold text-xl text-white">
                10+ Years of Industry Experience
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Deep expertise in project underwriting, sales & market analysis
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/15">
              <div className="font-heading font-bold text-xl text-white">
                Multiple Real Estate Markets
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Gurgaon, Karnal, Dharuhera, Bawal, NH-48, Sohna, DME & Vrindavan
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/15">
              <div className="font-heading font-bold text-xl text-white">
                Customer-Focused Approach
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Dedicated to transparency, professionalism & informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT RD INFRA SECTION */}
      <section id="about" className="py-20 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Cols: Official Company Profile Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
                01. ABOUT RD INFRA · BUILDING BETTER TOMORROWS
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
                Over a Decade of Trusted Real Estate & Land Investment Excellence
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed pt-2">
                {settings.about_paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="px-5 py-2.5 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white text-xs font-semibold transition-colors"
                >
                  Explore Projects
                </a>
                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-lg border border-slate-300 hover:border-[#0A4D92] text-slate-700 hover:text-[#0A4D92] text-xs font-semibold transition-colors"
                >
                  Talk to Our Team
                </a>
              </div>
            </div>

            {/* Right 5 Cols: Structured About Pillars (Story, Experience, Expertise, Vision, Mission, Commitment) */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {[
                { title: 'Our Story', text: settings.our_story, icon: Layers },
                { title: 'Our Experience', text: settings.our_experience, icon: Award },
                { title: 'Our Expertise', text: settings.our_expertise, icon: Compass },
                { title: 'Our Vision', text: settings.our_vision, icon: Eye },
                { title: 'Our Mission', text: settings.our_mission, icon: Target },
                { title: 'Our Commitment', text: settings.our_commitment, icon: HeartHandshake },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0A4D92]/10 text-[#0A4D92] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{pillar.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4B. MEET OUR DIRECTOR SECTION (MR. RAVINDER DESHWAL — UNEDITED ORIGINAL PHOTO SUPPORT) */}
      <section id="director" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 4 Cols: Original Unedited Portrait Frame + Key Leadership Highlights */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Strictly unedited, uncropped, unfiltered original photograph from Canva (RD INFRA Executive Portrait) */}
                <div className="bg-white flex items-center justify-center">
                  <img
                    src={settings.director?.photo_url || '/director-portrait.jpg'}
                    alt={settings.director?.name || 'Mr. Ravinder Deshwal'}
                    className="w-full h-auto block"
                  />
                </div>

                <div className="p-5 bg-white border-t border-slate-200 space-y-2">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                      {settings.director?.name || 'Mr. Ravinder Deshwal'}
                    </h3>
                    <p className="text-xs font-semibold text-[#0A4D92] mt-0.5">
                      {settings.director?.title || 'Founder & Director | Visionary Entrepreneur'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Leadership Track Record Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="font-heading font-bold text-lg text-[#0A4D92]">12+ Yrs</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Industry Experience</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="font-heading font-bold text-lg text-[#0A4D92]">900+</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Families & Investors</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="font-heading font-bold text-lg text-[#0A4D92]">2 Yrs</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Dubai Real Estate</div>
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Verbatim Biography, Core Expertise & His Vision */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
                  {settings.director?.section_heading || 'MEET OUR DIRECTOR'}
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
                  {settings.director?.name || 'Mr. Ravinder Deshwal'}
                </h2>
                <p className="text-sm sm:text-base font-semibold text-[#0A4D92]">
                  {settings.director?.title || 'Founder & Director | Visionary Entrepreneur'}
                </p>
              </div>

              {/* Exact Verbatim Biography Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {(
                  settings.director?.bio_paragraphs || [
                    'With over 12 years of experience in the real estate industry, Mr. Ravinder Deshwal is the Founder & Director of RD Infra, a real estate advisory and investment company specializing in premium residential, commercial, farmhouse, and land investments.',
                    'Over the years, he has guided 900+ families and investors in making strategic property investment decisions across key markets of Gurugram, Delhi-NCR, Karnal, Rohtak, Dharuhera, Rewari, Jind, and other emerging growth corridors.',
                    'He has been professionally associated with reputed developers including DLF, M3M, Elan, AIPL, SS Group, Amaya, Emaar, Smart World, Signature Global, and Godrej Properties, gaining extensive experience across luxury residential, commercial, and large-scale developments.',
                    'With 2 years of experience in the Dubai real estate market, he also brings an international perspective to property investment and wealth creation.',
                  ]
                ).map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>

              {/* Core Expertise */}
              <div className="pt-2 space-y-3">
                <h3 className="font-heading font-bold text-base text-[#1E293B]">Core Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    settings.director?.core_expertise || [
                      'Residential & Commercial Real Estate',
                      'Farmhouse & Land Investments',
                      'Investment Advisory & Wealth Creation',
                      'Market Research & Project Evaluation',
                      'Strategic Sales & Business Development',
                      'Dubai Real Estate Opportunities',
                    ]
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1E293B]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0A4D92] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Associations */}
              <div className="pt-2 space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Professional Developer Associations
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    settings.director?.developer_associations || [
                      'DLF',
                      'M3M',
                      'Elan',
                      'AIPL',
                      'SS Group',
                      'Amaya',
                      'Emaar',
                      'Smart World',
                      'Signature Global',
                      'Godrej Properties',
                    ]
                  ).map((dev) => (
                    <span
                      key={dev}
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#1E293B]"
                    >
                      {dev}
                    </span>
                  ))}
                </div>
              </div>

              {/* His Vision */}
              <div className="p-5 rounded-xl bg-[#1E293B] text-white space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  His Vision
                </div>
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  “
                  {settings.director?.vision_statement ||
                    'To redefine real estate consultancy through trust, transparency, strategic guidance, and long-term value creation.'}
                  ”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE RD INFRA (6 FEATURE CARDS) */}
      <section className="py-20 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
              02. WHY CHOOSE RD INFRA
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
              Built on Experience, Market Knowledge & Transparent Guidance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We help investors and families navigate real estate decisions with clarity, location
              intelligence, and long-term perspective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_FEATURES.map((feat, idx) => {
              const Icon = whyIcons[idx % whyIcons.length];
              return (
                <div
                  key={feat.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0A4D92] transition-colors space-y-3"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#0A4D92] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#1E293B]">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS & PORTFOLIO */}
      <section id="projects" className="py-20 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
                03. FEATURED PROJECTS & PORTFOLIO
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
                Explore Our Real Estate & Land Investment Categories
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse sample project offerings across Farmhouse Projects, Land Investment Projects,
                Residential Projects, Commercial Projects, and Plotted Developments. All project
                cards can be managed directly from the RD INFRA Admin Panel.
              </p>
            </div>

            {/* Interactive Category Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto self-start">
              {PROJECT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-[#0A4D92] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0A4D92] transition-all"
              >
                <div>
                  <div
                    onClick={() => setSelectedProjectModal(project)}
                    className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={project.image}
                      alt={project.project_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between text-xs">
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs text-[#0A4D92] font-semibold">
                      {project.project_type}
                    </div>

                    <h3
                      onClick={() => setSelectedProjectModal(project)}
                      className="font-heading font-bold text-lg text-[#1E293B] hover:text-[#0A4D92] transition-colors cursor-pointer"
                    >
                      {project.project_name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {project.highlights && project.highlights.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                          Key Highlights:
                        </div>
                        <ul className="space-y-1">
                          {project.highlights.slice(0, 3).map((hl, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-600 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0A4D92] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Details & Enquire Now Buttons */}
                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectModal(project)}
                    className="py-2.5 px-3 rounded-lg border border-slate-300 hover:border-[#0A4D92] text-slate-800 hover:text-[#0A4D92] font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>View Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      prefillEnquiryAndScroll(project.project_name, project.project_type)
                    }
                    className="py-2.5 px-3 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Enquire Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. UPCOMING PROJECTS SECTION */}
      <section id="upcoming" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
              04. UPCOMING PROJECTS
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
              Upcoming Developments Across Fast-Growing Corridors
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Register your interest early for upcoming farmhouse, land investment, and plotted
              developments along NH-48 Delhi–Jaipur Highway, Sohna / Western Peripheral region,
              Delhi–Mumbai Expressway corridor, and Vrindavan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingProjects.map((up) => (
              <div
                key={up.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0A4D92] transition-colors"
              >
                <div>
                  {up.image && (
                    <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={up.image}
                        alt={up.project_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-5 right-5 text-white flex items-center justify-between text-xs">
                        <span className="font-semibold flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5" />
                          {up.badge} · {up.project_category}
                        </span>
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {up.location}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    {!up.image && (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#0A4D92] flex items-center gap-1.5">
                          <CalendarClock className="w-4 h-4" />
                          {up.badge} · {up.project_category}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0A4D92]" />
                          {up.location}
                        </span>
                      </div>
                    )}

                    <h3 className="font-heading font-bold text-xl text-[#1E293B]">
                      {up.project_name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {up.description}
                    </p>

                    {up.connectivity_highlights && up.connectivity_highlights.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="text-xs font-semibold text-slate-800">
                          Connectivity Highlights:
                        </div>
                        <ul className="space-y-1">
                          {up.connectivity_highlights.map((conn, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-600 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0A4D92] shrink-0 mt-0.5" />
                              <span>{conn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    onClick={() => prefillEnquiryAndScroll(up.project_name, up.project_category)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Register Interest</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INVESTMENT CORRIDORS & MARKETS SECTION */}
      <section id="corridors" className="py-20 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
              05. INVESTMENT CORRIDORS & REGIONAL PRESENCE
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
              Markets & Growth Corridors Where RD INFRA Operates
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Since 2014, RD INFRA has built deep on-ground experience across established Haryana
              markets while focusing today on carefully selected farmhouse and land corridors in
              North India. All investment decisions are guided by connectivity, infrastructure, and
              fundamental location analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INVESTMENT_CORRIDORS.map((corridor) => (
              <div
                key={corridor.id}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-4 hover:border-[#0A4D92] transition-colors"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#0A4D92] uppercase tracking-wider">
                    {corridor.regionType}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                    {corridor.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{corridor.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Connectivity:</strong>{' '}
                  {corridor.connectivityNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS (EXACT 5 VERBATIM TESTIMONIALS) */}
      <section id="testimonials" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
              06. CUSTOMER TESTIMONIALS
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
              What Our Clients Say About RD INFRA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our commitment to thoughtful planning, professionalism, and transparent guidance has
              earned the trust of clients and investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:border-[#0A4D92] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#0A4D92]/10 text-[#0A4D92] flex items-center justify-center">
                      <Quote className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#0A4D92]">
                      {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-[#0A4D92]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">“{item.testimonial}”</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-sm text-[#0A4D92] tracking-wide">
                      {item.customer_name}
                    </div>
                    <div className="text-[11px] text-slate-500">Valued Client · RD INFRA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT PAGE & ENQUIRY SECTION */}
      <section id="contact" className="py-20 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left 5 Cols: Official Contact Info & Configurable Map Placeholder */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#F8FAFC] p-6 sm:p-8 rounded-2xl border border-slate-200">
              <div className="space-y-5">
                <div className="text-xs font-semibold text-[#0A4D92] tracking-wider uppercase">
                  07. CONTACT RD INFRA
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1E293B]">
                  Talk to Our Team & Schedule a Consultation
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reach out to RD INFRA for project information, availability verification, and
                  personalized guidance on farmhouses, land investments, and residential or
                  commercial developments.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <Phone className="w-5 h-5 text-[#0A4D92] shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="text-slate-500 font-medium">Official Phone / WhatsApp</div>
                        <a
                          href={`tel:+91${settings.phone_raw}`}
                          className="font-heading font-bold text-base text-[#1E293B] hover:text-[#0A4D92] block tabular-nums"
                        >
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#0A4D92]/10 text-[#0A4D92] font-semibold text-[11px] flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Official
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <Mail className="w-5 h-5 text-[#0A4D92] shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="text-slate-500 font-medium">Official Email ID</div>
                        <a
                          href={`mailto:${settings.email}`}
                          className="font-semibold text-sm text-[#1E293B] hover:text-[#0A4D92] block"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#0A4D92]/10 text-[#0A4D92] font-semibold text-[11px] flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Official ID
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <Globe className="w-5 h-5 text-[#0A4D92] shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="text-slate-500 font-medium">Official Website</div>
                        <div className="font-semibold text-sm text-[#0A4D92]">
                          Official Website: rd-infra
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#0A4D92]/10 text-[#0A4D92] font-semibold text-[11px] flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Official
                    </span>
                  </div>
                </div>

                {/* Direct Call Now & WhatsApp Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:+91${settings.phone_raw}`}
                    className="py-3 px-4 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={whatsappDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-lg bg-[#1E293B] hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Configurable Office Map / Location Placeholder */}
              <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
                  <MapPin className="w-4 h-4 text-[#0A4D92]" />
                  <span>Interactive Map / Office Location Placeholder</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {settings.map_placeholder_note}
                </p>
              </div>
            </div>

            {/* Right 7 Cols: Contact / Enquiry Form (Exact Required Fields) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              {formSubmitted ? (
                <div className="my-auto p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0A4D92] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#1E293B]">
                    Thank You for Contacting RD INFRA
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your enquiry for <strong>{formProject}</strong> ({formRequirement}) has been
                    recorded. Our team will reach out to you on <strong>{formPhone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormName('');
                      setFormMessage('');
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#0A4D92] text-white text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMainEnquirySubmit} className="space-y-5">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#1E293B]">
                      Submit an Enquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Complete the form below and our team will connect with you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXX XXXXX"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Requirement
                      </label>
                      <select
                        value={formRequirement}
                        onChange={(e) => setFormRequirement(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      >
                        <option value="Farmhouse Projects">Farmhouse Projects</option>
                        <option value="Land Investment Projects">Land Investment Projects</option>
                        <option value="Residential Projects">Residential Projects</option>
                        <option value="Commercial Projects">Commercial Projects</option>
                        <option value="Plotted Developments">Plotted Developments</option>
                        <option value="General Consultation">General Consultation</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Interested Project
                      </label>
                      <select
                        value={formProject}
                        onChange={(e) => setFormProject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      >
                        <optgroup label="Featured & Active Projects">
                          {projects.map((p) => (
                            <option key={`p-${p.id}`} value={p.project_name}>
                              {p.project_name} ({p.location})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Upcoming Projects">
                          {upcomingProjects.map((u) => (
                            <option key={`u-${u.id}`} value={u.project_name}>
                              [Upcoming] {u.project_name} ({u.location})
                            </option>
                          ))}
                        </optgroup>
                        <option value="General Real Estate Inquiry">
                          General Real Estate Inquiry
                        </option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Share your location preference, requirement details, or preferred time for a call..."
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {formSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 11. PROFESSIONAL CORPORATE FOOTER & REAL ESTATE DISCLAIMER */}
      <footer className="bg-[#1E293B] text-slate-300 pt-14 pb-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-700">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <BrandLogo size="md" showTagline={true} darkText={false} />
              <p className="text-slate-300 leading-relaxed max-w-sm">
                <strong>{settings.company_name}</strong> — “{settings.tagline}”. Trusted real estate
                and land investment company serving investors and homebuyers since 2014.
              </p>
              <div className="text-slate-300 font-semibold">
                Official Website: <span className="text-white">rd-infra</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-2.5">
              <div className="font-heading font-bold text-white text-sm">Quick Links</div>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#home" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#director" className="hover:text-white">
                    Meet Our Director
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-white">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#upcoming" className="hover:text-white">
                    Upcoming Projects
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Official Contact Column */}
            <div className="md:col-span-4 space-y-3">
              <div className="font-heading font-bold text-white text-sm">
                Official Contact & IDs
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Official Email ID:</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-white hover:underline font-semibold"
                  >
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Official Phone:</span>
                  <a
                    href={`tel:+91${settings.phone_raw}`}
                    className="text-white hover:underline font-mono-tabular font-semibold"
                  >
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Official Website:</span>
                  <span className="text-white font-semibold">rd-infra</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
                >
                  Admin Panel
                </button>
                <button
                  type="button"
                  onClick={() => setIsXamppModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
                >
                  XAMPP & MySQL Setup
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Real Estate Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 leading-relaxed text-[11px]">
            {settings.disclaimer_text}
          </div>

          {/* Bottom Legal Links & Copyright */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-slate-400 text-[11px]">
            <div>
              © {new Date().getFullYear()} {settings.company_name} ({settings.domain}). All Rights
              Reserved.
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveLegalDoc('privacy')}
                className="hover:text-white cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalDoc('terms')}
                className="hover:text-white cursor-pointer"
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalDoc('disclaimer')}
                className="hover:text-white cursor-pointer"
              >
                Disclaimer
              </button>
              <a href="/sitemap.xml" target="_blank" className="hover:text-white">
                Sitemap.xml
              </a>
              <a href="/robots.txt" target="_blank" className="hover:text-white">
                Robots.txt
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING CALL, WHATSAPP & RD INFRA AI AGENT WIDGET */}
      <AIAgentWidget
        settings={settings}
        onSubmitEnquiry={submitEnquiryToBackend}
      />

      {/* MODALS */}
      <ProjectDetailModal
        project={selectedProjectModal}
        settings={settings}
        onClose={() => setSelectedProjectModal(null)}
        onSubmitEnquiry={submitEnquiryToBackend}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        upcomingProjects={upcomingProjects}
        testimonials={testimonials}
        settings={settings}
        onStateSynced={(updated) => {
          if (updated.projects) setProjects(updated.projects);
          if (updated.upcomingProjects) setUpcomingProjects(updated.upcomingProjects);
          if (updated.testimonials) setTestimonials(updated.testimonials);
          if (updated.settings) setSettings(updated.settings);
        }}
      />

      <XamppArchitectureModal
        isOpen={isXamppModalOpen}
        onClose={() => setIsXamppModalOpen(false)}
        settings={settings}
      />

      <LegalModal
        activeDoc={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
        settings={settings}
      />
    </div>
  );
}
