import { createClient } from "@/lib/supabase/server";
import type {
  BandMember,
  DiscographyTrack,
  Enquiry,
  EnquirySettings,
  GalleryItem,
  MerchItem,
  NewsPost,
  Show,
  SiteSettings,
} from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}

export async function getUpcomingShows(): Promise<Show[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("shows")
    .select("*")
    .gte("show_date", today)
    .order("show_date", { ascending: true });
  return data ?? [];
}

export async function getAllShows(): Promise<Show[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shows")
    .select("*")
    .order("show_date", { ascending: false });
  return data ?? [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getMerchItems(): Promise<MerchItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("merch_items")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .order("post_date", { ascending: false });
  return data ?? [];
}

export async function getBandMembers(): Promise<BandMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("band_members")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getDiscography(): Promise<DiscographyTrack[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("discography_tracks")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getEnquirySettings(): Promise<EnquirySettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiry_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}
