import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Phone,
  MessageCircle,
  CheckCircle2,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { SiteSettingsRecord } from '../types';

interface AIAgentWidgetProps {
  settings: SiteSettingsRecord;
  onSubmitEnquiry: (payload: {
    name: string;
    phone: string;
    email: string;
    project: string;
    requirement: string;
    message: string;
  }) => Promise<boolean>;
}

interface AgentMessage {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'Meet Our Director — Mr. Ravinder Deshwal',
  'Farmhouse projects in Sohna & NH-48',
  'Investment corridors where RD INFRA operates',
  'Upcoming projects in Vrindavan & Expressway',
];

export const AIAgentWidget: React.FC<AIAgentWidgetProps> = ({
  settings,
  onSubmitEnquiry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadRequirement, setLeadRequirement] = useState('Farmhouse Projects');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: 'assistant',
      text: `Welcome to ${settings.company_name} (“${settings.tagline}”). I am your AI Real Estate Advisory Agent.\n\nAsk me about our Farmhouse Projects, Land Investment Corridors (NH-48, Sohna, Delhi–Mumbai Expressway, Vrindavan), or Residential & Commercial developments across Gurgaon, Karnal, Dharuhera, and Bawal.`,
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, showLeadCapture]);

  const sendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const nextHistory: AgentMessage[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.reply ||
            `Please contact the RD INFRA team directly at ${settings.phone} or ${settings.email} for verified project information.`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `For immediate assistance regarding "${trimmed}", please call or WhatsApp RD INFRA at ${settings.phone}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadSubmitting(true);
    const lastUserQuery =
      [...messages].reverse().find((m) => m.role === 'user')?.text ||
      'AI Agent Consultation Request';

    const ok = await onSubmitEnquiry({
      name: leadName,
      phone: leadPhone,
      email: '',
      project: 'AI Agent Assisted Consultation',
      requirement: leadRequirement,
      message: `Submitted via RD INFRA AI Agent. Recent query: "${lastUserQuery}"`,
    });
    setLeadSubmitting(false);
    if (ok) {
      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Thank you, ${leadName}! Your consultation request for ${leadRequirement} has been saved to our enquiry database. Our team will contact you on ${leadPhone} shortly.`,
        },
      ]);
      setTimeout(() => {
        setShowLeadCapture(false);
        setLeadSubmitted(false);
        setLeadName('');
        setLeadPhone('');
      }, 2200);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Welcome to ${settings.company_name} (“${settings.tagline}”). How can I assist you with your real estate or land investment inquiry today?`,
      },
    ]);
    setShowLeadCapture(false);
  };

  const whatsappDirectLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.company_name} (${settings.domain}), I would like to schedule a consultation regarding your real estate projects.`
  )}`;

  return (
    <>
      {/* Floating Action Bar (Call Now, WhatsApp, AI Agent Button) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-wrap items-center justify-end gap-2.5">
        <a
          href={`tel:+91${settings.phone_raw}`}
          className="h-11 px-4 rounded-full bg-[#1E293B] hover:bg-slate-800 text-white shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-semibold transition-transform hover:scale-105 whitespace-nowrap"
          title={`Call ${settings.phone}`}
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Call Now</span>
        </a>

        <a
          href={whatsappDirectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-4 rounded-full bg-white hover:bg-slate-50 text-[#0A4D92] shadow-lg border border-slate-300 flex items-center gap-2 text-xs font-semibold transition-transform hover:scale-105 whitespace-nowrap"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-[#0A4D92]" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-11 px-4 rounded-full bg-[#0A4D92] hover:bg-[#083D75] text-white shadow-lg flex items-center gap-2 text-xs font-semibold transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOpen ? 'Close AI Agent' : 'RD INFRA AI Agent'}</span>
        </button>
      </div>

      {/* AI Agent Interactive Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[92vw] sm:w-[410px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[78vh]">
          {/* Header (Professional Blue & Official Unedited Logo) */}
          <div className="px-5 py-4 bg-[#0A4D92] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
                <img
                  src="/rd-infra-logo.svg"
                  alt="RD INFRA Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-heading font-bold text-sm leading-tight">
                  RD INFRA AI Advisory Agent
                </div>
                <div className="text-[11px] text-blue-100">
                  Real Estate & Corridor Intelligence · Since 2014
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetConversation}
                className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 cursor-pointer"
                aria-label="Close AI Agent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#F8FAFC] max-h-[340px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#0A4D92] text-white'
                      : 'bg-white text-[#1E293B] border border-slate-200 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500">
                  RD INFRA AI Agent is preparing guidance...
                </div>
              </div>
            )}

            {/* Inline Quick Consultation Booking Card inside AI Agent */}
            {showLeadCapture && (
              <div className="p-4 rounded-xl bg-white border border-[#0A4D92] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-[#1E293B] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#0A4D92]" />
                    Book a Callback with RD INFRA
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLeadCapture(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                {leadSubmitted ? (
                  <div className="p-2.5 rounded-lg bg-slate-50 text-[#0A4D92] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Registered! Our team will call you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleQuickLeadSubmit} className="space-y-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                    <select
                      value={leadRequirement}
                      onChange={(e) => setLeadRequirement(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    >
                      <option value="Farmhouse Projects">Farmhouse Projects</option>
                      <option value="Land Investment Projects">Land Investment Projects</option>
                      <option value="Residential Projects">Residential Projects</option>
                      <option value="Commercial Projects">Commercial Projects</option>
                      <option value="Plotted Developments">Plotted Developments</option>
                    </select>
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full py-2 px-3 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold cursor-pointer"
                    >
                      {leadSubmitting ? 'Saving...' : 'Confirm Callback Request'}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0A4D92] hover:text-white text-slate-700 border border-slate-200 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about farmhouses, corridors, or projects..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] disabled:opacity-50 text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Bar with Instant Consultation & Direct Phone */}
          <div className="px-4 py-2.5 bg-[#1E293B] text-white flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setShowLeadCapture(!showLeadCapture)}
              className="font-semibold text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Book Consultation in Chat</span>
            </button>
            <a
              href={`tel:+91${settings.phone_raw}`}
              className="text-slate-300 hover:text-white font-mono-tabular"
            >
              {settings.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
};
