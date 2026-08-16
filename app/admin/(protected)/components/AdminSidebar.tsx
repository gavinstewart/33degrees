import Link from "next/link";
import SignOutButton from "@/app/admin/(protected)/components/SignOutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/shows", label: "Shows" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/merch", label: "Merch" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/band", label: "Band" },
  { href: "/admin/discography", label: "Discography" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-sidebar-brand">
        Thirty Three Degrees
      </Link>
      <nav>
        <ul>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <SignOutButton />
    </aside>
  );
}
