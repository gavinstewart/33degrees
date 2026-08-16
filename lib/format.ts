export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLocalDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-AU", options);
}

export function isYoutubeOrVimeo(url: string): boolean {
  return /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
}

export function toEmbedUrl(url: string): string {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
}
