import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_HOST } from "@/site";

export const alt = "Rafael Naves";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#171a20",
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 500 }}>Rafael Naves</div>
      <div style={{ marginTop: 20, fontSize: 40, color: "#393c41" }}>
        {t("role")}
      </div>
      <div style={{ marginTop: 56, fontSize: 28, color: "#5c5e62" }}>
        {SITE_HOST}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          background: "#3e6ae1",
        }}
      />
    </div>,
    size,
  );
}
