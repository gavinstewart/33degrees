import { getMerchItems } from "@/lib/data";
import {
  createMerchItem,
  updateMerchItem,
  deleteMerchItem,
} from "@/app/admin/(protected)/merch/actions";

export default async function AdminMerchPage() {
  const items = await getMerchItems();

  return (
    <div>
      <h1 className="admin-page-title">Merch</h1>

      <div className="admin-card">
        <h3>Add a merch item</h3>
        <form action={createMerchItem} className="admin-form" encType="multipart/form-data">
          <div className="admin-form-row">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Price (AUD)
              <input type="number" name="price" step="0.01" min="0" required />
            </label>
          </div>
          <label>
            Description
            <textarea name="description" />
          </label>
          <label>
            Image
            <input type="file" name="image" accept="image/*" />
          </label>
          <label>
            Or image URL
            <input type="url" name="image_url" />
          </label>
          <label>
            Sizes (comma-separated, e.g. S, M, L, XL)
            <input type="text" name="sizes" />
          </label>
          <div className="admin-form-row">
            <label>
              <input type="checkbox" name="in_stock" defaultChecked style={{ width: "auto" }} />{" "}
              In stock
            </label>
            <label>
              Sort order
              <input type="number" name="sort_order" defaultValue={items.length} />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add item
            </button>
          </div>
        </form>
      </div>

      {items.map((item) => (
        <div key={item.id} className="admin-card">
          <h3>{item.name}</h3>
          {item.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={item.name} className="admin-current-image" />
          )}
          <form
            action={updateMerchItem}
            className="admin-form"
            encType="multipart/form-data"
          >
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="existing_image_url" value={item.image_url ?? ""} />
            <div className="admin-form-row">
              <label>
                Name
                <input type="text" name="name" defaultValue={item.name} required />
              </label>
              <label>
                Price (AUD)
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  defaultValue={(item.price_cents / 100).toFixed(2)}
                  required
                />
              </label>
            </div>
            <label>
              Description
              <textarea name="description" defaultValue={item.description ?? ""} />
            </label>
            <label>
              Replace image
              <input type="file" name="image" accept="image/*" />
            </label>
            <label>
              Sizes (comma-separated)
              <input type="text" name="sizes" defaultValue={item.sizes?.join(", ") ?? ""} />
            </label>
            <div className="admin-form-row">
              <label>
                <input
                  type="checkbox"
                  name="in_stock"
                  defaultChecked={item.in_stock}
                  style={{ width: "auto" }}
                />{" "}
                In stock
              </label>
              <label>
                Sort order
                <input type="number" name="sort_order" defaultValue={item.sort_order} />
              </label>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteMerchItem} style={{ marginTop: 8 }}>
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
