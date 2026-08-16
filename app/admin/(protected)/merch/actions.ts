"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull, numOrNull, listOrNull } from "@/lib/form";
import { uploadMedia } from "@/lib/storage";

async function resolveImageUrl(formData: FormData, existing: string | null) {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    return uploadMedia(file, "merch");
  }
  return strOrNull(formData, "image_url") ?? existing;
}

export async function createMerchItem(formData: FormData) {
  const supabase = await createClient();

  const imageUrl = await resolveImageUrl(formData, null);
  const priceDollars = Number(str(formData, "price"));

  await supabase.from("merch_items").insert({
    name: str(formData, "name"),
    description: strOrNull(formData, "description"),
    price_cents: Math.round(priceDollars * 100),
    image_url: imageUrl,
    sizes: listOrNull(formData, "sizes"),
    in_stock: formData.get("in_stock") === "on",
    sort_order: numOrNull(formData, "sort_order") ?? 0,
  });

  revalidatePath("/");
  revalidatePath("/admin/merch");
}

export async function updateMerchItem(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const imageUrl = await resolveImageUrl(
    formData,
    strOrNull(formData, "existing_image_url")
  );
  const priceDollars = Number(str(formData, "price"));

  await supabase
    .from("merch_items")
    .update({
      name: str(formData, "name"),
      description: strOrNull(formData, "description"),
      price_cents: Math.round(priceDollars * 100),
      image_url: imageUrl,
      sizes: listOrNull(formData, "sizes"),
      in_stock: formData.get("in_stock") === "on",
      sort_order: numOrNull(formData, "sort_order") ?? 0,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/merch");
}

export async function deleteMerchItem(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("merch_items").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/merch");
}
