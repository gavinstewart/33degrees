import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-links">
          {settings?.facebook_url && (
            <li>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          )}
          {settings?.instagram_url && (
            <li>
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          )}
          {settings?.spotify_url && (
            <li>
              <a href={settings.spotify_url} target="_blank" rel="noopener noreferrer">
                Spotify
              </a>
            </li>
          )}
          {settings?.youtube_url && (
            <li>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                YouTube Music
              </a>
            </li>
          )}
          {settings?.booking_email && (
            <li>
              <a href={`mailto:${settings.booking_email}`}>Booking</a>
            </li>
          )}
        </ul>
        <p className="footer-meta">
          &copy; {year} {settings?.band_name ?? "Thirty Three Degrees"}. Central Coast, NSW.
        </p>
      </div>
    </footer>
  );
}
