import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "NusaHistoria";
  const category = searchParams.get("category") || "Sejarah Islam Jawa";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #facc15, #eab308, #facc15)",
          }}
        />
        
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#facc15",
              color: "#0a0a0a",
              padding: "8px 20px",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "4px",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: "1.2",
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          {title}
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: "24px",
            color: "#facc15",
            fontWeight: "bold",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          NusaHistoria
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
