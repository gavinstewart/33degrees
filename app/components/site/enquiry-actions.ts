"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { str } from "@/lib/form";
import { sendEnquiryNotification } from "@/lib/email";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  error?: string;
};

export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot: real visitors never see or fill this field in — bots do.
  // Pretend success so the bot doesn't learn to look for a different field.
  if (str(formData, "company")) {
    return { status: "success" };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || !email || !message) {
    return { status: "error", error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("enquiries")
    .insert({ name, email, message });

  if (insertError) {
    return {
      status: "error",
      error: "Something went wrong submitting your enquiry. Please try again.",
    };
  }

  try {
    const admin = createAdminClient();
    const { data: settings } = await admin
      .from("enquiry_settings")
      .select("recipients")
      .eq("id", 1)
      .single();

    const recipients = settings?.recipients
      ? settings.recipients
          .split(",")
          .map((r: string) => r.trim())
          .filter(Boolean)
      : [];

    await sendEnquiryNotification({ name, email, message, recipients });
  } catch (err) {
    // The enquiry is already saved above even if the notification email fails —
    // log it so a broken key/domain doesn't fail silently forever.
    console.error("Failed to send enquiry notification email:", err);
  }

  return { status: "success" };
}
