import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        {settings?.logo_url && (
          <Image
            src={settings.logo_url}
            alt={settings.band_name}
            width={140}
            height={140}
            className="hero-logo"
            priority
          />
        )}
        {settings?.kicker && (
          <span className="hero-kicker">{settings.kicker}</span>
        )}
        <h1 className="hero-title">{settings?.band_name ?? "Thirty Three Degrees"}</h1>
        {settings?.tagline && <p className="hero-tagline">{settings.tagline}</p>}
        <div className="hero-actions">
          <a href="#shows" className="btn">
            See upcoming shows
          </a>
          <a href="#merch" className="btn btn--ghost">
            Shop merch
          </a>
        </div>
      </div>
    </section>
  );
}
