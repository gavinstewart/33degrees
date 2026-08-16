import { createClient } from "@/lib/supabase/server";

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const supabase = await createClient();

  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Failed to upload media: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return publicUrl;
}
