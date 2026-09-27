import { MorrowMark } from "@/components/Icons";
import { CAMPAIGN } from "@/lib/campaign";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="flex items-center gap-2 font-display text-lg font-semibold">
          <MorrowMark width={24} height={24} className="text-ember" />
          {CAMPAIGN.cafe}
        </p>
        <p className="text-sm text-roast">
          {CAMPAIGN.area} · {CAMPAIGN.hours}
        </p>
        <p className="text-sm text-roast">A fictional café, built as a frontend assignment.</p>
      </div>
    </footer>
  );
}
