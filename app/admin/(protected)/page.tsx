import Link from "next/link";

const SECTIONS = [
  { href: "/admin/shows", label: "Shows" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/merch", label: "Merch" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/band", label: "Band" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-dashboard-grid">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="admin-dashboard-card">
            {section.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
