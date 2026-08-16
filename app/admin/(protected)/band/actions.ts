"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull, numOrNull } from "@/lib/form";
import { uploadMedia } from "@/lib/storage";

async function resolvePhotoUrl(formData: FormData, existing: string | null) {
  const file = formData.get("photo") as File | null;
  if (file && file.size > 0) {
    return uploadMedia(file, "band");
  }
  return existing;
}

export async function createBandMember(formData: FormData) {
  const supabase = await createClient();

  const photoUrl = await resolvePhotoUrl(formData, strOrNull(formData, "photo_url"));

  await supabase.from("band_members").insert({
    name: str(formData, "name"),
    role: str(formData, "role"),
    bio: strOrNull(formData, "bio"),
    photo_url: photoUrl,
    sort_order: numOrNull(formData, "sort_order") ?? 0,
  });

  revalidatePath("/");
  revalidatePath("/admin/band");
}

export async function updateBandMember(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const photoUrl = await resolvePhotoUrl(
    formData,
    strOrNull(formData, "existing_photo_url")
  );

  await supabase
    .from("band_members")
    .update({
      name: str(formData, "name"),
      role: str(formData, "role"),
      bio: strOrNull(formData, "bio"),
      photo_url: photoUrl,
      sort_order: numOrNull(formData, "sort_order") ?? 0,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/band");
}

export async function deleteBandMember(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("band_members").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/band");
}
