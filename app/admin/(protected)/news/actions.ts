"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str } from "@/lib/form";

export async function createNewsPost(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("news_posts").insert({
    title: str(formData, "title"),
    body: str(formData, "body"),
    post_date: str(formData, "post_date"),
  });

  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function updateNewsPost(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase
    .from("news_posts")
    .update({
      title: str(formData, "title"),
      body: str(formData, "body"),
      post_date: str(formData, "post_date"),
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function deleteNewsPost(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("news_posts").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/news");
}
