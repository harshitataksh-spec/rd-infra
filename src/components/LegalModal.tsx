import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';
import { SiteSettingsRecord } from '../types';

interface LegalModalProps {
  activeDoc: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
  settings: SiteSettingsRecord;
}

export const LegalModal: React.FC<LegalModalProps> = ({ activeDoc, onClose, settings }) => {
  if (!activeDoc) return null;

  const titles = {
    privacy: 'Privacy Policy — RD INFRA (rd-infra.in)',
    terms: 'Terms & Conditions — RD INFRA (rd-infra.in)',
    disclaimer: 'Real Estate & Investment Disclaimer — RD INFRA',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#0A4D92] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeDoc === 'disclaimer' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <h3 className="font-heading font-bold text-base">{titles[activeDoc]}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 cursor-pointer"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 lg:p-8 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[75vh] overflow-y-auto">
          {activeDoc === 'disclaimer' && (
            <>
              <p className="font-semibold text-slate-900">
                Important Notice Regarding Property Information & Investment Decisions:
              </p>
              <p>{settings.disclaimer_text}</p>
              <p>
                1. <strong>Independent Verification:</strong> Prospective buyers and investors are
                advised to independently verify all project details, land records, layout plans,
                zoning regulations, statutory approvals, and availability directly with{' '}
                <strong>{settings.company_name}</strong> before entering into any transaction.
              </p>
              <p>
                2. <strong>No Guaranteed Returns:</strong> Real estate markets are subject to
                macroeconomic, infrastructure, and regulatory factors. {settings.company_name} does
                not represent or guarantee any fixed rate of capital appreciation or investment
                return.
              </p>
              <p>
                3. <strong>Sample & Placeholder Content:</strong> Project cards marked as sample
                placeholders are illustrative of the property categories and corridors served by{' '}
                {settings.company_name}. Contact our team at <strong>{settings.phone}</strong> or{' '}
                <strong>{settings.email}</strong> for current project documentation.
              </p>
            </>
          )}

          {activeDoc === 'privacy' && (
            <>
              <p>
                <strong>{settings.company_name}</strong> ({settings.domain}) respects your privacy
                and is committed to protecting the personal contact details you share through our
                enquiry and consultation forms.
              </p>
              <p>
                <strong>Information Collected:</strong> When you submit an enquiry or register
                interest on {settings.domain}, we collect your full name, phone number, email
                address, interested project, and message solely to respond to your property inquiry.
              </p>
              <p>
                <strong>Data Usage & Security:</strong> Your contact information is used exclusively
                by {settings.company_name}’s advisory team to provide project details, schedule
                consultations, and share relevant real estate updates. We do not sell your personal
                data to third-party telemarketers.
              </p>
              <p>
                For any privacy inquiries or data removal requests, please contact us at{' '}
                <strong>{settings.email}</strong> or call <strong>{settings.phone}</strong>.
              </p>
            </>
          )}

          {activeDoc === 'terms' && (
            <>
              <p>
                By accessing and using <strong>https://{settings.domain}</strong>, you agree to the
                following terms and conditions set forth by <strong>{settings.company_name}</strong>:
              </p>
              <p>
                1. All text, branding, the RD INFRA logo, and layout structure on this website are
                the intellectual property of {settings.company_name}.
              </p>
              <p>
                2. Submission of an online enquiry or interest registration does not constitute a
                binding allotment, reservation, or legal offer for any real estate property.
              </p>
              <p>
                3. All real estate consultations and transactions are governed by applicable Indian
                real estate laws and formal written agreements executed between the parties.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
