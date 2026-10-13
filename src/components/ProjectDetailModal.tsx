import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Send,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { ProjectRecord, SiteSettingsRecord } from '../types';

interface ProjectDetailModalProps {
  project: ProjectRecord | null;
  settings: SiteSettingsRecord;
  onClose: () => void;
  onSubmitEnquiry: (payload: {
    name: string;
    phone: string;
    email: string;
    project: string;
    requirement: string;
    message: string;
  }) => Promise<boolean>;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  settings,
  onClose,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (project) {
      setRequirement(project.project_type);
      setSubmitted(false);
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    const ok = await onSubmitEnquiry({
      name,
      phone,
      email,
      project: project.project_name,
      requirement: requirement || project.project_type,
      message:
        message ||
        `Enquiring about ${project.project_name} (${project.location}). Please share verified details and schedule a consultation.`,
    });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello RD INFRA (${settings.domain}), I would like to enquire about "${project.project_name}" located in ${project.location}. Please share more details.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A4D92] text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-medium text-blue-100 whitespace-nowrap">
              {project.project_type}
            </span>
            <span className="text-blue-300" aria-hidden="true">
              ·
            </span>
            <h3 className="font-heading font-bold text-base sm:text-lg truncate">
              {project.project_name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Project Image, Description & Highlights */}
            <div className="lg:col-span-7 space-y-5">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={project.image}
                  alt={project.project_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-[#0A4D92] shrink-0" />
                  <span className="font-medium text-slate-700">{project.location}</span>
                  <span>·</span>
                  <span>{project.project_type}</span>
                </div>

                <h4 className="font-heading font-bold text-xl text-[#1E293B]">
                  {project.project_name}
                </h4>

                <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
              </div>

              {/* Key Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <h5 className="font-heading font-semibold text-sm text-[#1E293B]">
                    Key Highlights
                  </h5>
                  <ul className="space-y-2">
                    {project.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0A4D92] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verification Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#0A4D92] shrink-0 mt-0.5" />
                <span>
                  Please verify current availability, plot/unit sizes, pricing, and project
                  approvals directly with the RD INFRA team before making any investment decision.
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Enquire Now Form & Direct Contact */}
            <div className="lg:col-span-5 bg-[#F8FAFC] p-6 rounded-xl border border-slate-200 space-y-5">
              <div>
                <h5 className="font-heading font-bold text-base text-[#1E293B]">
                  Enquire About This Project
                </h5>
                <p className="text-xs text-slate-600 mt-1">
                  Talk to our team for verified project details and site visit scheduling.
                </p>
              </div>

              {/* Direct Call & WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:+91${settings.phone_raw}`}
                  className="py-2.5 px-3 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-[#0A4D92] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Enquiry Received by RD INFRA
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Thank you, <strong>{name}</strong>. Our team will reach out to you on{' '}
                    <strong>{phone}</strong> regarding <strong>{project.project_name}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requirement</label>
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      placeholder="e.g., Farmhouse / Land Investment / Plot"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Share your questions or preferred consultation time..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
