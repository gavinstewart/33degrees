"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { str, strOrNull } from "@/lib/form";

export async function updateEnquiryRecipients(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("enquiry_settings")
    .update({ recipients: strOrNull(formData, "recipients") })
    .eq("id", 1);

  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  await supabase.from("enquiries").delete().eq("id", id);

  revalidatePath("/admin/enquiries");
}
