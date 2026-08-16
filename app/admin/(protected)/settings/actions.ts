"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull } from "@/lib/form";
import { uploadMedia } from "@/lib/storage";

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("logo") as File | null;
  const logoUrl =
    file && file.size > 0
      ? await uploadMedia(file, "settings")
      : strOrNull(formData, "existing_logo_url");

  await supabase
    .from("site_settings")
    .update({
      band_name: str(formData, "band_name"),
      kicker: strOrNull(formData, "kicker"),
      tagline: strOrNull(formData, "tagline"),
      logo_url: logoUrl,
      facebook_url: strOrNull(formData, "facebook_url"),
      instagram_url: strOrNull(formData, "instagram_url"),
      spotify_url: strOrNull(formData, "spotify_url"),
      youtube_url: strOrNull(formData, "youtube_url"),
      linktree_url: strOrNull(formData, "linktree_url"),
      booking_email: strOrNull(formData, "booking_email"),
    })
    .eq("id", 1);

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
