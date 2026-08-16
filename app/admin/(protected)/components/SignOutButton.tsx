"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn btn--ghost btn--small"
      style={{ marginTop: 24, color: "var(--color-paper)", borderColor: "var(--color-paper)" }}
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
