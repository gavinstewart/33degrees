"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull, numOrNull } from "@/lib/form";

export async function createTrack(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("discography_tracks").insert({
    title: str(formData, "title"),
    release_year: numOrNull(formData, "release_year"),
    youtube_url: strOrNull(formData, "youtube_url"),
    spotify_url: strOrNull(formData, "spotify_url"),
    sort_order: numOrNull(formData, "sort_order") ?? 0,
  });

  revalidatePath("/");
  revalidatePath("/admin/discography");
}

export async function updateTrack(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase
    .from("discography_tracks")
    .update({
      title: str(formData, "title"),
      release_year: numOrNull(formData, "release_year"),
      youtube_url: strOrNull(formData, "youtube_url"),
      spotify_url: strOrNull(formData, "spotify_url"),
      sort_order: numOrNull(formData, "sort_order") ?? 0,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/discography");
}

export async function deleteTrack(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("discography_tracks").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/discography");
}
