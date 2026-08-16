import { getAllShows } from "@/lib/data";
import { createShow, updateShow, deleteShow } from "@/app/admin/(protected)/shows/actions";

export default async function AdminShowsPage() {
  const shows = await getAllShows();

  return (
    <div>
      <h1 className="admin-page-title">Shows</h1>

      <div className="admin-card">
        <h3>Add a new show</h3>
        <form action={createShow} className="admin-form">
          <div className="admin-form-row">
            <label>
              Date
              <input type="date" name="show_date" required />
            </label>
            <label>
              Title
              <input type="text" name="title" placeholder="e.g. Summer Sessions" />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Venue
              <input type="text" name="venue" required />
            </label>
            <label>
              City
              <input type="text" name="city" required />
            </label>
          </div>
          <label>
            Ticket URL
            <input type="url" name="ticket_url" />
          </label>
          <label>
            Notes
            <textarea name="notes" />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add show
            </button>
          </div>
        </form>
      </div>

      {shows.map((show) => (
        <div key={show.id} className="admin-card">
          <h3>{show.venue}</h3>
          <form action={updateShow} className="admin-form">
            <input type="hidden" name="id" value={show.id} />
            <div className="admin-form-row">
              <label>
                Date
                <input type="date" name="show_date" defaultValue={show.show_date} required />
              </label>
              <label>
                Title
                <input type="text" name="title" defaultValue={show.title} />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Venue
                <input type="text" name="venue" defaultValue={show.venue} required />
              </label>
              <label>
                City
                <input type="text" name="city" defaultValue={show.city} required />
              </label>
            </div>
            <label>
              Ticket URL
              <input type="url" name="ticket_url" defaultValue={show.ticket_url ?? ""} />
            </label>
            <label>
              Notes
              <textarea name="notes" defaultValue={show.notes ?? ""} />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteShow} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={show.id} />
            <button type="submit" className="btn btn--danger btn--small">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
