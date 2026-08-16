import { getNewsPosts } from "@/lib/data";
import {
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
} from "@/app/admin/(protected)/news/actions";

export default async function AdminNewsPage() {
  const posts = await getNewsPosts();

  return (
    <div>
      <h1 className="admin-page-title">News</h1>

      <div className="admin-card">
        <h3>Add a post</h3>
        <form action={createNewsPost} className="admin-form">
          <div className="admin-form-row">
            <label>
              Date
              <input type="date" name="post_date" required />
            </label>
            <label>
              Title
              <input type="text" name="title" required />
            </label>
          </div>
          <label>
            Body
            <textarea name="body" required />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn">
              Add post
            </button>
          </div>
        </form>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="admin-card">
          <h3>{post.title}</h3>
          <form action={updateNewsPost} className="admin-form">
            <input type="hidden" name="id" value={post.id} />
            <div className="admin-form-row">
              <label>
                Date
                <input type="date" name="post_date" defaultValue={post.post_date} required />
              </label>
              <label>
                Title
                <input type="text" name="title" defaultValue={post.title} required />
              </label>
            </div>
            <label>
              Body
              <textarea name="body" defaultValue={post.body} required />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn--small">
                Save
              </button>
            </div>
          </form>
          <form action={deleteNewsPost} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={post.id} />
            <button type="submit" className="btn btn--danger btn--small">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
