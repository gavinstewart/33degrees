"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

const LINKS = [
  { href: "#shows", label: "Shows" },
  { href: "#discography", label: "Music" },
  { href: "#gallery", label: "Gallery" },
  { href: "#news", label: "News" },
  { href: "#band", label: "Band" },
  { href: "#merch", label: "Merch" },
  { href: "#enquiries", label: "Contact" },
];

export default function Nav({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.band_name ?? "Thirty Three Degrees";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" onClick={() => setMenuOpen(false)}>
          {settings?.logo_url && (
            <Image src={settings.logo_url} alt={name} width={36} height={36} />
          )}
          {name}
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links${menuOpen ? " nav-links--open" : ""}`}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
