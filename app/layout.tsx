import type { Metadata } from "next";
import Script from "next/script";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – Lập bàn thờ tưởng niệm online`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Google Analytics – chỉ nạp khi đã cấu hình env */}
        {siteConfig.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${siteConfig.gaId}');`}
            </Script>
          </>
        )}

        {/* Google AdSense – chỉ nạp khi đã cấu hình env */}
        {siteConfig.adsenseId && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
