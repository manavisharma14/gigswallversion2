/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";

// ✅ Hardcoded blogs (same data as in [id]/page.tsx)
const blogs = [
  {
    id: "manavi-story",
    title: "Still Learning. Still Building.",
    coverImg: "/assets/blog1.png",
    content: `I’m Manavi Sharma, and I grew up in Gurgaon. As a kid, I wasn’t the most curious person — more of a daydreamer than anything else. Basketball was where I felt most alive, and the court was my space to reset. At different points, I imagined myself becoming a doctor, an astronomer, or maybe even a teacher. But life took me in another direction...

(Preview only — click to read more)`,
    authorName: "Manavi Sharma",
    authorImage: "/assets/manavi1.png",
    createdAt: "2025-09-10",
  },
  {
    id: "top-freelancing-skills",
    title: "Top 10 Freelancing Skills Every Student Should Learn in 2025",
    coverImg: "/assets/blog2.jpeg",
    content: `The freelancing economy is booming, and college students are uniquely positioned to capitalize on this trend. 

Students generally have flexible schedules, access to current knowledge, and are digital natives, which means they can easily start generating income while still studying. But which skills should you develop?

(Preview only — click to read more)`,
    authorName: "Shrishti",
    authorImage: "/assets/shrishti.png",
    createdAt: "2025-09-10",
  },
];

export default function BlogsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center"> Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <div className="border rounded-xl shadow hover:shadow-lg transition bg-white overflow-hidden p-4 cursor-pointer">
              {blog.coverImg && (
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {blog.content}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <img
                  src={blog.authorImage}
                  alt={blog.authorName}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-xs text-gray-500">
                  {blog.authorName} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}