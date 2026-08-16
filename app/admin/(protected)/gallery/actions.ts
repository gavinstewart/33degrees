"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull, numOrNull } from "@/lib/form";
import { uploadMedia } from "@/lib/storage";

async function resolveMediaUrl(formData: FormData, existing: string | null) {
  const file = formData.get("file") as File | null;
  if (file && file.size > 0) {
    return uploadMedia(file, "gallery");
  }
  const pastedUrl = strOrNull(formData, "media_url");
  return pastedUrl ?? existing;
}

export async function createGalleryItem(formData: FormData) {
  const supabase = await createClient();

  const mediaUrl = await resolveMediaUrl(formData, null);
  if (!mediaUrl) return;

  await supabase.from("gallery_items").insert({
    kind: str(formData, "kind"),
    media_url: mediaUrl,
    caption: strOrNull(formData, "caption"),
    sort_order: numOrNull(formData, "sort_order") ?? 0,
  });

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const mediaUrl = await resolveMediaUrl(
    formData,
    strOrNull(formData, "existing_media_url")
  );

  await supabase
    .from("gallery_items")
    .update({
      kind: str(formData, "kind"),
      media_url: mediaUrl,
      caption: strOrNull(formData, "caption"),
      sort_order: numOrNull(formData, "sort_order") ?? 0,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("gallery_items").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
