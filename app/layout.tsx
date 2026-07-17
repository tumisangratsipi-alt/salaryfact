import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const clashDisplay = localFont({
  src: "../assets/fonts/ClashDisplay-Semibold.ttf",
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salary Percentile Calculator — Where Does Your Pay Rank?",
  description:
    "Find out what percentile your salary is in nationally and by state. See how your pay compares to the median. All 50 states. Free, no sign-up.",
  metadataBase: new URL("https://salaryfact.com"),
  openGraph: {
    title: "Salary Percentile Calculator",
    description:
      "Find out what percentile your salary is in nationally and by state. BLS 2024 data.",
    url: "https://salaryfact.com",
    siteName: "salaryfact.com",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Salary Percentile Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Percentile Calculator",
    description: "See where your salary ranks nationally and by state. Free, no sign-up.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://salaryfact.com",
  },
  verification: {
    google: "ImM2vBJAmWBWeP5qZW0A-f5xM7ZWjiIl-Y5jaChFIXA",
  },
  other: {
    "google-adsense-account": "ca-pub-1046440660422479",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || 'G-PDXEK5JF9E';
  return (
    <html lang="en" className={`${clashDisplay.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* @ts-expect-error impact.com requires non-standard value= attribute */}
        <meta name="impact-site-verification" value="88057ff0-999e-41af-afa2-0fcf546cc1ca" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1046440660422479"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','${ga4Id}',{page_path:window.location.pathname});
        `}</Script>
      </body>
    </html>
  );
}
