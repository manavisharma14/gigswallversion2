export const dynamic = 'force-static';
import AboutSection from "./AboutSection";

export const metadata = {
  title: "About GigsWall | Student Freelance Platform",
  description:
    "Learn more about GigsWall — a trusted freelance platform built around students, collaboration, and real opportunities. Discover why GigsWall is the simplest way to learn, earn, and grow.",
  keywords: [
    "About GigsWall",
    "student freelance platform",
    "why GigsWall",
    "student gigs",
    "freelance opportunities",
    "side hustles for students",
  ],
  openGraph: {
    title: "About GigsWall | Student Freelance Platform",
    description:
      "Discover why GigsWall is the trusted freelance platform for students and communities. Learn, earn, and grow through real opportunities.",
    url: "https://gigswall.com/about",
    siteName: "GigsWall",
    images: [
      {
        url: "/assets/aboutus.png",
        width: 1200,
        height: 630,
        alt: "About GigsWall",
      },
    ],
    type: "website",
  }
};

export default function AboutPage() {
  return <AboutSection />;
}