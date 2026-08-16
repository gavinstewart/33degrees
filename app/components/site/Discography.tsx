"use client";

import { useState } from "react";
import Image from "next/image";
import type { DiscographyTrack } from "@/lib/types";

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function SpotifyIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path d="M6.5 15.8c3.3-1 7.4-1 10.4.6" />
      <path d="M6 12.2c3.9-1.2 8.7-1.2 12.5.5" />
      <path d="M5.6 8.6c4.4-1.4 10.1-1.4 14.4.7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="discography-play-icon" viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(26, 20, 16, 0.75)" />
      <path d="M9.5 7.5v9l8-4.5-8-4.5z" fill="#fbf3e3" />
    </svg>
  );
}

export default function Discography({ tracks }: { tracks: DiscographyTrack[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section id="discography" className="section">
      <div className="container">
        <h2 className="section-heading">Discography</h2>
        {tracks.length === 0 ? (
          <p className="empty-state">No tracks yet.</p>
        ) : (
          <div className="discography-list">
            {tracks.map((track) => {
              const youtubeId = track.youtube_url ? extractYoutubeId(track.youtube_url) : null;
              const isPlaying = playingId === track.id;

              return (
                <div key={track.id} className="discography-row">
                  <div className="discography-thumb">
                    {isPlaying && youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={track.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : youtubeId ? (
                      <button
                        type="button"
                        className="discography-thumb-button"
                        onClick={() => setPlayingId(track.id)}
                        aria-label={`Play ${track.title}`}
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 200px"
                          style={{ objectFit: "cover" }}
                        />
                        <PlayIcon />
                      </button>
                    ) : (
                      <div className="discography-thumb-empty" />
                    )}
                  </div>
                  <div className="discography-info">
                    <div className="discography-title">{track.title}</div>
                    {track.release_year && (
                      <div className="discography-year">{track.release_year}</div>
                    )}
                  </div>
                  {track.spotify_url && (
                    <a
                      href={track.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="discography-spotify"
                      aria-label={`Listen to ${track.title} on Spotify`}
                    >
                      <SpotifyIcon />
                      Spotify
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
