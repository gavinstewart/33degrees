import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteSettings } from "@/lib/data";

export const alt = "Thirty Three Degrees — Central Coast, NSW";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const antonPromise = readFile(join(process.cwd(), "assets/fonts/Anton-Regular.ttf"));
const caveatPromise = readFile(join(process.cwd(), "assets/fonts/Caveat-Regular.ttf"));

async function loadLogo(logoUrl: string | null | undefined) {
  if (!logoUrl) return null;

  if (logoUrl.startsWith("http")) {
    const res = await fetch(logoUrl);
    const buffer = await res.arrayBuffer();
    return `data:${res.headers.get("content-type") ?? "image/jpeg"};base64,${Buffer.from(buffer).toString("base64")}`;
  }

  const buffer = await readFile(join(process.cwd(), "public", logoUrl));
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export default async function Image() {
  const [settings, antonData, caveatData] = await Promise.all([
    getSiteSettings(),
    antonPromise,
    caveatPromise,
  ]);

  const logoSrc = await loadLogo(settings?.logo_url);
  const bandName = settings?.band_name ?? "Thirty Three Degrees";
  const kicker = settings?.kicker ?? "Central Coast, NSW";
  const [firstWord, ...restWords] = bandName.split(" ");
  const rest = restWords.join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          background:
            "linear-gradient(135deg, #F4A623 0%, #E88A2B 45%, #C9631B 75%, #1A1410 100%)",
        }}
      >
        {logoSrc && (
          <img
            src={logoSrc}
            alt=""
            width={280}
            height={280}
            style={{
              borderRadius: "50%",
              border: "6px solid #1A1410",
              marginRight: 64,
              objectFit: "cover",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Caveat", fontSize: 44, color: "#1A1410" }}>
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Anton",
              fontSize: 90,
              lineHeight: 1.05,
              color: "#1A1410",
              textTransform: "uppercase",
            }}
          >
            <span>{firstWord}</span>
            {rest && <span>{rest}</span>}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonData, style: "normal", weight: 400 },
        { name: "Caveat", data: caveatData, style: "normal", weight: 400 },
      ],
    }
  );
}
