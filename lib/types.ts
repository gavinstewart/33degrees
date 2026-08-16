export interface Show {
  id: string;
  show_date: string; // 'YYYY-MM-DD'
  title: string;
  venue: string;
  city: string;
  ticket_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  kind: "photo" | "video";
  media_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  sizes: string[] | null;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  post_date: string; // 'YYYY-MM-DD'
  created_at: string;
}

export interface BandMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface DiscographyTrack {
  id: string;
  title: string;
  release_year: number | null;
  youtube_url: string | null;
  spotify_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface SiteSettings {
  id: 1;
  band_name: string;
  kicker: string | null;
  tagline: string | null;
  logo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  linktree_url: string | null;
  booking_email: string | null;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface EnquirySettings {
  id: 1;
  recipients: string | null;
}
