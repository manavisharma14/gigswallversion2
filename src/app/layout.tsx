import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "react-hot-toast";
import GA from "../components/GA";
import { Providers } from "./providers";
import localFont from "next/font/local";
import { Suspense } from "react";

const myCustomFont = localFont({
  src: "../../public/fonts/font.ttf",
  variable: "--font-cal-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata = {
  title: "GigsWall",
  description: "Find and post campus gigs.",
  icons: {
    icon: [{ url: "/favicon-512.png", sizes: "512x512" }],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${myCustomFont.className} scroll-smooth`}>
      <head>
        {GA_ID && (
          <>
            <Script id="ga4-base" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
          </>
        )}
      </head>

      <body className={`${bricolage.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                background: "#fffaf3",
                color: "#1a1a1a",
                fontFamily: "Bricolage Grotesque",
              },
            }}
          />
        </Providers>

        {/* ✅ Wrap GA in Suspense to fix build errors */}
        {GA_ID && (
          <Suspense fallback={null}>
            <GA gaId={GA_ID} />
          </Suspense>
        )}
      </body>
    </html>
  );
}