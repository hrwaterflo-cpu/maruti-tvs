import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maruti TVS | Authorized Sub Dealer & Genuine Spare Parts",
  description:
    "Maruti TVS — Authorized TVS Sub Dealer. Explore TVS scooters and check real-time genuine spare parts availability online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#E31E24] selection:text-white">
        {children}
      </body>
    </html>
  );
}
