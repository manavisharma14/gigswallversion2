// app/layout.tsx (or src/app/layout.tsx)
import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { getUserServerSide } from "@/lib/getUserServerSide";
import GA from "../components/GA";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "GigsWall",
  description: "Find and post campus gigs.",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // set to "G-WXV7QDD172"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserServerSide();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>

      <body className={`${bricolage.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider initialUser={user}>
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
        </AuthProvider>

        {/* Track route changes as pageviews */}
        {GA_ID && <GA gaId={GA_ID} />}
      </body>
    </html>
  );
}