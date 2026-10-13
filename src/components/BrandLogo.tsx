import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  darkText?: boolean;
  imageOnly?: boolean;
}

/**
 * Displays the official RD INFRA 3D Blue & Silver Hexagonal Architectural Logo
 * ("RD | INFRA — BUILDING BETTER TOMORROWS") unedited across all brand locations.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  darkText = true,
  imageOnly = false,
}) => {
  const [logoSrc, setLogoSrc] = React.useState('/rd-infra-logo.svg');

  const boxSizes = {
    sm: 'h-11 w-14',
    md: 'h-13 w-16',
    lg: 'h-16 w-20',
    xl: 'h-24 w-28',
  }[size];

  const titleSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${boxSizes} relative rounded-lg overflow-hidden bg-white border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 p-0.5`}
      >
        <img
          src={logoSrc}
          alt="RD INFRA — Building Better Tomorrows Official Logo"
          referrerPolicy="no-referrer"
          onError={() => {
            if (logoSrc !== '/favicon.svg') {
              setLogoSrc('/favicon.svg');
            }
          }}
          className="w-full h-full object-contain"
        />
      </div>

      {!imageOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight leading-none whitespace-nowrap ${titleSize} ${
                darkText ? 'text-[#0A4D92]' : 'text-white'
              }`}
            >
              RD{' '}
              <span
                className={`font-normal mx-0.5 ${
                  darkText ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                |
              </span>{' '}
              <span className={darkText ? 'text-[#1E293B]' : 'text-slate-200'}>INFRA</span>
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] leading-tight mt-1 whitespace-nowrap ${
                darkText ? 'text-[#0F294A]' : 'text-slate-300'
              }`}
            >
              Building Better Tomorrows
            </span>
          )}
        </div>
      )}
    </div>
  );
};
