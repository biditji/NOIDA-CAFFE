import { Clock, MorrowMark } from "@/components/Icons";
import { CAMPAIGN } from "@/lib/campaign";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-5 md:px-8 md:pt-7">
      <p className="hero-rise flex items-center gap-2.5" style={{ "--i": 0 } as React.CSSProperties}>
        <MorrowMark width={30} height={30} className="text-ember" />
        <span className="leading-tight">
          <span className="block font-display text-xl font-semibold tracking-tight">Morrow Café</span>
          <span className="block text-xs font-medium text-roast">{CAMPAIGN.area}</span>
        </span>
      </p>
      <p
        className="hero-rise hidden items-center gap-2 rounded-full border border-crema bg-paper/70 px-3.5 py-1.5 text-sm font-medium text-roast sm:flex"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <Clock width={16} height={16} />
        {CAMPAIGN.hours}
      </p>
    </header>
  );
}
