import Image from "next/image";
import type { BandMember, SiteSettings } from "@/lib/types";

export default function Hero({
  settings,
  band,
}: {
  settings: SiteSettings | null;
  band: BandMember[];
}) {
  const bgPhotos = band.filter((member) => member.photo_url).slice(0, 3);

  return (
    <section id="top" className="hero">
      {bgPhotos.length > 0 && (
        <div className="hero-bg-photos" aria-hidden="true">
          {bgPhotos.map((member) => (
            <div key={member.id} className="hero-bg-photo">
              <Image
                src={member.photo_url!}
                alt=""
                fill
                sizes="34vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="hero-bg-gradient" aria-hidden="true" />
      {bgPhotos[1] && (
        <div className="hero-bg-photo-featured" aria-hidden="true">
          <Image
            src={bgPhotos[1].photo_url!}
            alt=""
            fill
            sizes="34vw"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
        </div>
      )}
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
