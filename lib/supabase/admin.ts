import { createClient } from "@supabase/supabase-js";

// Service-role client for privileged server-only reads (e.g. enquiry_settings,
// which anon/authenticated RLS deliberately does not expose). Never import
// this from a Client Component or expose it to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
