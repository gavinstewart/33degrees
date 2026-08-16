import type { SiteSettings } from "@/lib/types";

export default function Marquee({ settings }: { settings: SiteSettings | null }) {
  const text = `${settings?.band_name ?? "Thirty Three Degrees"} — ${
    settings?.kicker ?? "Central Coast, NSW"
  } — `;
  const repeated = text.repeat(6);

  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{repeated}</span>
        <span aria-hidden="true">{repeated}</span>
      </div>
    </div>
  );
}
