import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteSettings, getBandMembers } from "@/lib/data";

export const alt = "Thirty Three Degrees — Central Coast, NSW";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const antonPromise = readFile(join(process.cwd(), "assets/fonts/Anton-Regular.ttf"));
const caveatPromise = readFile(join(process.cwd(), "assets/fonts/Caveat-Regular.ttf"));
const interPromise = readFile(join(process.cwd(), "assets/fonts/Inter-Regular.ttf"));

async function loadImage(url: string | null | undefined) {
  if (!url) return null;

  if (url.startsWith("http")) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return `data:${res.headers.get("content-type") ?? "image/jpeg"};base64,${Buffer.from(buffer).toString("base64")}`;
  }

  const buffer = await readFile(join(process.cwd(), "public", url));
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export default async function Image() {
  const [settings, band, antonData, caveatData, interData] = await Promise.all([
    getSiteSettings(),
    getBandMembers(),
    antonPromise,
    caveatPromise,
    interPromise,
  ]);

  const bgPhotos = band.filter((member) => member.photo_url).slice(0, 3);
  const [logoSrc, photoSrcs] = await Promise.all([
    loadImage(settings?.logo_url),
    Promise.all(bgPhotos.map((member) => loadImage(member.photo_url))),
  ]);

  const bandName = settings?.band_name ?? "Thirty Three Degrees";
  const kicker = settings?.kicker ?? "Central Coast, NSW";
  const tagline = settings?.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {photoSrcs.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
            }}
          >
            {photoSrcs.map((src, i) => {
              const colWidth = Math.round(size.width / photoSrcs.length);
              return (
                src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={colWidth}
                    height={size.height}
                    style={{
                      width: colWidth,
                      height: size.height,
                      objectFit: "cover",
                      filter: "grayscale(1) contrast(1.1) brightness(0.85)",
                    }}
                  />
                )
              );
            })}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            opacity: 0.88,
            background:
              "radial-gradient(circle at 50% 40%, #F4A623 0%, #E88A2B 45%, #C9631B 75%, #1A1410 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {logoSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt=""
              width={150}
              height={150}
              style={{
                borderRadius: "50%",
                border: "5px solid #1A1410",
                marginBottom: 20,
                objectFit: "cover",
              }}
            />
          )}
          <div style={{ display: "flex", fontFamily: "Caveat", fontSize: 40, color: "#1A1410" }}>
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 76,
              lineHeight: 1.05,
              color: "#1A1410",
              textTransform: "uppercase",
            }}
          >
            {bandName}
          </div>
          {tagline && (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                maxWidth: 720,
                fontFamily: "Inter",
                fontSize: 28,
                color: "#2E2620",
              }}
            >
              {tagline}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonData, style: "normal", weight: 400 },
        { name: "Caveat", data: caveatData, style: "normal", weight: 400 },
        { name: "Inter", data: interData, style: "normal", weight: 400 },
      ],
    }
  );
}
