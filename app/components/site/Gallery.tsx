"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isYoutubeOrVimeo, toEmbedUrl } from "@/lib/format";
import type { GalleryItem } from "@/lib/types";

function PlayIcon() {
  return (
    <svg className="gallery-play-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(26, 20, 16, 0.75)" />
      <path d="M9.5 7.5v9l8-4.5-8-4.5z" fill="#fbf3e3" />
    </svg>
  );
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, items.length]);

  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="gallery" className="section">
      <div className="container">
        <h2 className="section-heading">Gallery</h2>
        {items.length === 0 ? (
          <p className="empty-state">No photos or videos yet.</p>
        ) : (
          <div className="gallery-grid">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="gallery-item gallery-item--clickable"
                onClick={() => setOpenIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpenIndex(index);
                }}
              >
                {item.kind === "video" ? (
                  isYoutubeOrVimeo(item.media_url) ? (
                    <iframe
                      src={toEmbedUrl(item.media_url)}
                      title={item.caption ?? "Video"}
                      tabIndex={-1}
                    />
                  ) : (
                    <video src={item.media_url} muted playsInline preload="metadata" />
                  )
                ) : (
                  <Image
                    src={item.media_url}
                    alt={item.caption ?? "Gallery photo"}
                    fill
                    sizes="(max-width: 600px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
                {item.kind === "video" && (
                  <div className="gallery-play-overlay">
                    <PlayIcon />
                  </div>
                )}
                {item.caption && (
                  <div className="gallery-caption">{item.caption}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {current && (
        <div className="lightbox-overlay" onClick={() => setOpenIndex(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
          >
            &times;
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((openIndex! - 1 + items.length) % items.length);
                }}
                aria-label="Previous item"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((openIndex! + 1) % items.length);
                }}
                aria-label="Next item"
              >
                &rsaquo;
              </button>
            </>
          )}

          {current.kind === "video" ? (
            isYoutubeOrVimeo(current.media_url) ? (
              <iframe
                src={toEmbedUrl(current.media_url)}
                title={current.caption ?? "Video"}
                className="lightbox-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={current.media_url}
                controls
                autoPlay
                className="lightbox-video"
                onClick={(e) => e.stopPropagation()}
              />
            )
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.media_url}
              alt={current.caption ?? "Gallery photo"}
              className="lightbox-image"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {current.caption && (
            <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
              {current.caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
