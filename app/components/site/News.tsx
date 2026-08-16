import { formatLocalDate } from "@/lib/format";
import type { NewsPost } from "@/lib/types";

function renderWithLinks(text: string) {
  return text.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function News({ posts }: { posts: NewsPost[] }) {
  return (
    <section id="news" className="section">
      <div className="container">
        <h2 className="section-heading">News</h2>
        {posts.length === 0 ? (
          <p className="empty-state">Nothing posted yet.</p>
        ) : (
          <div className="news-list">
            {posts.map((post) => (
              <article key={post.id} className="news-post">
                <div className="news-date">{formatLocalDate(post.post_date)}</div>
                <h3 className="news-title">{post.title}</h3>
                <p className="news-body">{renderWithLinks(post.body)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
