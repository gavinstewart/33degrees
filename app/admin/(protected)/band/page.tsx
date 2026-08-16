import { getBandMembers } from "@/lib/data";
import {
  createBandMember,
  updateBandMember,
  deleteBandMember,
} from "@/app/admin/(protected)/band/actions";

export default async function AdminBandPage() {
  const members = await getBandMembers();

  return (
    <div>
      <h1 className="admin-page-title">Band</h1>

      <div className="admin-card">
        <h3>Add a band member</h3>
        <form action={createBandMember} className="admin-form" encType="multipart/form-data">
          <div className="admin-form-row">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Role
              <input type="text" name="role" placeholder="e.g. Vocals, Guitar" required />
            </label>
          </div>
          <label>
            Bio
            <textarea name="bio" />
          </label>
          <label>
            Photo
            <input type="file" name="photo" accept="image/*" />
          </label>
          <label>
            Or photo URL
            <input type="url" name="photo_url" />
          </label>
          <label>
            Sort order
            <input type="number" name="sort_order" defaultValue={members.length} />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add member
            </button>
          </div>
        </form>
      </div>

      {members.map((member) => (
        <div key={member.id} className="admin-card">
          <h3>{member.name}</h3>
          {member.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo_url} alt={member.name} className="admin-current-image" />
          )}
          <form
            action={updateBandMember}
            className="admin-form"
            encType="multipart/form-data"
          >
            <input type="hidden" name="id" value={member.id} />
            <input type="hidden" name="existing_photo_url" value={member.photo_url ?? ""} />
            <div className="admin-form-row">
              <label>
                Name
                <input type="text" name="name" defaultValue={member.name} required />
              </label>
              <label>
                Role
                <input type="text" name="role" defaultValue={member.role} required />
              </label>
            </div>
            <label>
              Bio
              <textarea name="bio" defaultValue={member.bio ?? ""} />
            </label>
            <label>
              Replace photo
              <input type="file" name="photo" accept="image/*" />
            </label>
            <label>
              Sort order
              <input type="number" name="sort_order" defaultValue={member.sort_order} />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteBandMember} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={member.id} />
            <button type="submit" className="btn btn--danger btn--small">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
