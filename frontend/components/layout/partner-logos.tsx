import { PARTNER_LOGOS } from '@/lib/branding';

export function PartnerLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8">
      {PARTNER_LOGOS.map((logo) => (
        <div key={logo.src} className="flex shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt=""
            className={`w-auto max-h-12 object-contain ${logo.height}`}
          />
        </div>
      ))}
    </div>
  );
}
