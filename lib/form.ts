export function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

export function strOrNull(formData: FormData, key: string): string | null {
  const value = (formData.get(key) as string | null)?.trim();
  return value ? value : null;
}

export function numOrNull(formData: FormData, key: string): number | null {
  const value = (formData.get(key) as string | null)?.trim();
  if (!value) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

export function listOrNull(formData: FormData, key: string): string[] | null {
  const value = (formData.get(key) as string | null)?.trim();
  if (!value) return null;
  const list = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return list.length ? list : null;
}
