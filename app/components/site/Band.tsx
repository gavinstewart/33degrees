import Image from "next/image";
import type { BandMember } from "@/lib/types";

export default function Band({ members }: { members: BandMember[] }) {
  return (
    <section id="band" className="section">
      <div className="container">
        <h2 className="section-heading">The Band</h2>
        {members.length === 0 ? (
          <p className="empty-state">Band bios coming soon.</p>
        ) : (
          <div className="band-grid">
            {members.map((member) => (
              <div key={member.id} className="band-card">
                {member.photo_url && (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    width={220}
                    height={220}
                    className="band-photo"
                  />
                )}
                <div className="band-name">{member.name}</div>
                <div className="band-role">{member.role}</div>
                {member.bio && <p className="band-bio">{member.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
