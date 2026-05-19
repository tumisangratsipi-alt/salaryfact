import type { Metadata } from "next";
import "./globals.css";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Percentile Calculator",
    description: "See where your salary ranks nationally and by state. Free, no sign-up.",
  },
  alternates: {
    canonical: "https://salaryfact.com",
  },
  verification: {
    google: "ImM2vBJAmWBWeP5qZW0A-f5xM7ZWjiIl-Y5jaChFIXA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
