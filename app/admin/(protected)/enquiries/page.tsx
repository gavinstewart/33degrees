import { getEnquiries, getEnquirySettings } from "@/lib/data";
import {
  updateEnquiryRecipients,
  deleteEnquiry,
} from "@/app/admin/(protected)/enquiries/actions";

export default async function AdminEnquiriesPage() {
  const [enquiries, settings] = await Promise.all([
    getEnquiries(),
    getEnquirySettings(),
  ]);

  return (
    <div>
      <h1 className="admin-page-title">Enquiries</h1>

      <div className="admin-card">
        <h3>Notification recipients</h3>
        <form action={updateEnquiryRecipients} className="admin-form">
          <label>
            Email addresses (comma-separated)
            <input
              type="text"
              name="recipients"
              placeholder="e.g. shane@example.com, booking@example.com"
              defaultValue={settings?.recipients ?? ""}
            />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn--small">
              Save
            </button>
          </div>
        </form>
      </div>

      {enquiries.length === 0 ? (
        <p className="empty-state">No enquiries yet.</p>
      ) : (
        enquiries.map((enquiry) => (
          <div key={enquiry.id} className="admin-card">
            <h3>
              {enquiry.name} &lt;{enquiry.email}&gt;
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              {new Date(enquiry.created_at).toLocaleString("en-AU")}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{enquiry.message}</p>
            <form action={deleteEnquiry} style={{ marginTop: 8 }}>
              <input type="hidden" name="id" value={enquiry.id} />
              <button type="submit" className="btn btn--danger btn--small">
                Delete
              </button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}
