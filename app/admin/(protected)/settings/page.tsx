import { getSiteSettings } from "@/lib/data";
import { updateSiteSettings } from "@/app/admin/(protected)/settings/actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="admin-page-title">Settings</h1>

      <div className="admin-card">
        <form action={updateSiteSettings} className="admin-form" encType="multipart/form-data">
          <input
            type="hidden"
            name="existing_logo_url"
            value={settings?.logo_url ?? ""}
          />
          <label>
            Band name
            <input type="text" name="band_name" defaultValue={settings?.band_name ?? ""} required />
          </label>
          <label>
            Kicker
            <input type="text" name="kicker" defaultValue={settings?.kicker ?? ""} />
          </label>
          <label>
            Tagline
            <input type="text" name="tagline" defaultValue={settings?.tagline ?? ""} />
          </label>
          {settings?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt="Logo" className="admin-current-image" />
          )}
          <label>
            Replace logo
            <input type="file" name="logo" accept="image/*" />
          </label>
          <label>
            Facebook URL
            <input type="url" name="facebook_url" defaultValue={settings?.facebook_url ?? ""} />
          </label>
          <label>
            Instagram URL
            <input type="url" name="instagram_url" defaultValue={settings?.instagram_url ?? ""} />
          </label>
          <label>
            Spotify URL
            <input type="url" name="spotify_url" defaultValue={settings?.spotify_url ?? ""} />
          </label>
          <label>
            YouTube Music URL
            <input type="url" name="youtube_url" defaultValue={settings?.youtube_url ?? ""} />
          </label>
          <label>
            Booking email
            <input type="email" name="booking_email" defaultValue={settings?.booking_email ?? ""} />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Save settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
