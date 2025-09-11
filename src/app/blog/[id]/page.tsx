import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

type Blog = {
  title: string;
  coverImg: string;
  description: string;
  keywords: string[];
  content: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
};

// Hardcoded blogs
const blogs: Record<string, Blog> = {
  "manavi-story": {
    title: "Still Learning. Still Building.",
    coverImg: "/assets/blog1.png",
    description:
      "Personal journey of Manavi Sharma building GigsWall as a student, learning and creating opportunities for peers.",
    keywords: ["student story", "building GigsWall", "student entrepreneurship"],
    content: `I’m Manavi Sharma, and I grew up in Gurgaon...`,
    authorName: "Manavi Sharma",
    authorImage: "/assets/manavi1.png",
    createdAt: "2025-09-10",
  },

  "top-freelancing-skills": {
    title: "Top 10 Freelancing Skills Every Student Should Learn in 2025",
    coverImg: "/assets/blog2.jpeg",
    description:
      "Discover the top freelancing skills students should master in 2025 to earn money and build real-world experience.",
    keywords: [
      "freelancing skills",
      "student freelance jobs",
      "top skills 2025",
      "gig economy",
    ],
    content: `The freelancing economy is booming...`,
    authorName: "Shrishti",
    authorImage: "/assets/shrishti.png",
    createdAt: "2025-09-10",
  },
};

// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const blog = blogs[params.id];
  if (!blog) return {};

  return {
    title: `${blog.title} | GigsWall Blog`,
    description: blog.description,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.coverImg],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.coverImg],
    },
  };
}

// ✅ Blog Page
export default function BlogPage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const blog = blogs[id];

  if (!blog) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 pt-32">
      <Image
        src={blog.coverImg}
        alt={blog.title}
        width={800}
        height={400}
        className="w-full h-60 object-cover rounded-xl mb-6"
        priority
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-2 mb-6">
        <Image
          src={blog.authorImage}
          alt={blog.authorName}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full"
        />
        <p className="text-sm text-gray-500">
          {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p className="whitespace-pre-line leading-relaxed text-lg text-gray-700">
        {blog.content}
      </p>
    </div>
  );
}