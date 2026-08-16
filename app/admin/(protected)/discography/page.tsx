import { getDiscography } from "@/lib/data";
import {
  createTrack,
  updateTrack,
  deleteTrack,
} from "@/app/admin/(protected)/discography/actions";

export default async function AdminDiscographyPage() {
  const tracks = await getDiscography();

  return (
    <div>
      <h1 className="admin-page-title">Discography</h1>

      <div className="admin-card">
        <h3>Add a track</h3>
        <form action={createTrack} className="admin-form">
          <div className="admin-form-row">
            <label>
              Title
              <input type="text" name="title" required />
            </label>
            <label>
              Release year
              <input type="number" name="release_year" />
            </label>
          </div>
          <label>
            YouTube URL
            <input type="url" name="youtube_url" />
          </label>
          <label>
            Spotify URL
            <input type="url" name="spotify_url" />
          </label>
          <label>
            Sort order
            <input type="number" name="sort_order" defaultValue={tracks.length} />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add track
            </button>
          </div>
        </form>
      </div>

      {tracks.map((track) => (
        <div key={track.id} className="admin-card">
          <h3>{track.title}</h3>
          <form action={updateTrack} className="admin-form">
            <input type="hidden" name="id" value={track.id} />
            <div className="admin-form-row">
              <label>
                Title
                <input type="text" name="title" defaultValue={track.title} required />
              </label>
              <label>
                Release year
                <input type="number" name="release_year" defaultValue={track.release_year ?? ""} />
              </label>
            </div>
            <label>
              YouTube URL
              <input type="url" name="youtube_url" defaultValue={track.youtube_url ?? ""} />
            </label>
            <label>
              Spotify URL
              <input type="url" name="spotify_url" defaultValue={track.spotify_url ?? ""} />
            </label>
            <label>
              Sort order
              <input type="number" name="sort_order" defaultValue={track.sort_order} />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteTrack} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={track.id} />
            <button type="submit" className="btn btn--danger btn--small">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
