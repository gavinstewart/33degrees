"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull } from "@/lib/form";

export async function createShow(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("shows").insert({
    show_date: str(formData, "show_date"),
    title: str(formData, "title"),
    venue: str(formData, "venue"),
    city: str(formData, "city"),
    ticket_url: strOrNull(formData, "ticket_url"),
    notes: strOrNull(formData, "notes"),
  });

  revalidatePath("/");
  revalidatePath("/admin/shows");
}

export async function updateShow(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase
    .from("shows")
    .update({
      show_date: str(formData, "show_date"),
      title: str(formData, "title"),
      venue: str(formData, "venue"),
      city: str(formData, "city"),
      ticket_url: strOrNull(formData, "ticket_url"),
      notes: strOrNull(formData, "notes"),
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/shows");
}

export async function deleteShow(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("shows").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/shows");
}
