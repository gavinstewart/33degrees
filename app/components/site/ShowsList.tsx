import { formatLocalDate } from "@/lib/format";
import type { Show } from "@/lib/types";
import AddToCalendar from "@/app/components/site/AddToCalendar";

export default function ShowsList({
  shows,
  bandName,
}: {
  shows: Show[];
  bandName: string;
}) {
  return (
    <section id="shows" className="section">
      <div className="container">
        <h2 className="section-heading">Upcoming Shows</h2>
        {shows.length === 0 ? (
          <p className="empty-state">No shows booked yet — check back soon.</p>
        ) : (
          <div className="shows-list">
            {shows.map((show) => (
              <div key={show.id} className="show-row">
                <div className="show-date">{formatLocalDate(show.show_date)}</div>
                <div className="show-details">
                  <div className="show-venue">
                    {show.title || show.venue}
                  </div>
                  <div className="show-city">
                    {show.venue}, {show.city}
                  </div>
                  {show.notes && <div className="show-notes">{show.notes}</div>}
                </div>
                <div className="show-actions">
                  {show.ticket_url && (
                    <a
                      href={show.ticket_url}
                      className="btn btn--small"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tickets
                    </a>
                  )}
                  <AddToCalendar show={show} bandName={bandName} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
