import { getGalleryItems } from "@/lib/data";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/app/admin/(protected)/gallery/actions";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      <h1 className="admin-page-title">Gallery</h1>

      <div className="admin-card">
        <h3>Add a photo or video</h3>
        <form action={createGalleryItem} className="admin-form" encType="multipart/form-data">
          <label>
            Type
            <select name="kind" required>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label>
            Upload a file
            <input type="file" name="file" accept="image/*,video/*" />
          </label>
          <label>
            Or paste a URL (image, video file, or YouTube/Vimeo link)
            <input type="url" name="media_url" />
          </label>
          <label>
            Caption
            <input type="text" name="caption" />
          </label>
          <label>
            Sort order
            <input type="number" name="sort_order" defaultValue={items.length} />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add item
            </button>
          </div>
        </form>
      </div>

      {items.map((item) => (
        <div key={item.id} className="admin-card">
          <h3>{item.caption || item.kind}</h3>
          <form
            action={updateGalleryItem}
            className="admin-form"
            encType="multipart/form-data"
          >
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="existing_media_url" value={item.media_url} />
            <label>
              Type
              <select name="kind" defaultValue={item.kind} required>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>
              Replace file
              <input type="file" name="file" accept="image/*,video/*" />
            </label>
            <label>
              Or replace URL
              <input type="url" name="media_url" placeholder={item.media_url} />
            </label>
            <label>
              Caption
              <input type="text" name="caption" defaultValue={item.caption ?? ""} />
            </label>
            <label>
              Sort order
              <input type="number" name="sort_order" defaultValue={item.sort_order} />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteGalleryItem} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="btn btn--danger btn--small">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
